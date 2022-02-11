import React, { useEffect } from 'react';
import { keyBy } from 'lodash';
import { Table } from 'antd';
import { useNexusContext } from '@bbp/react-nexus';

import { hippocampus } from '../../config';
import { entryToArray } from '../../utils';
import { NexusTrace } from '../../types';
import { useExperimentalTraceTable } from './expTraceTableUtils';

import styles from './styles.module.scss'


type ExpTraceTableProps = {
  etype: string;
  traces: NexusTrace[];
  currentTrace?: string;
};

function getAgentLabel(agent) {
  return agent.name
    ? agent.name
    : `${agent.givenName} ${agent.familyName}`;
}

function getAgentType(agent) {
  return agent.name
    ? 'institution'
    : 'person';
}

const ExpTraceTable: React.FC<ExpTraceTableProps> = ({ etype, currentTrace, traces = [] }) => {
  const nexus = useNexusContext();

  const agentIds = traces.reduce((ids: string[], trace) => {
    const currIds = entryToArray(trace.contribution)
      .map(contribution => contribution.agent?.['@id'])
      .filter(Boolean);

    return Array.from(new Set([...ids, ...currIds]));
  }, []);

  const { agentMap, setAgentMap, columns } = useExperimentalTraceTable(etype, currentTrace);

  useEffect(() => {
    if (!agentIds.length) return;

    const contributionEsQuery = {
      from: 0,
      size: 100,
      query: {
        terms: {
          '_id': agentIds,
        }
      }
    }

    nexus.View
      // query ElesticSearch endpoint to get agents by their ids
      .elasticSearchQuery(hippocampus.org, hippocampus.project, hippocampus.datasetViewId, contributionEsQuery)
      // extract ES documents
      .then(data => data.hits.hits)
      // extract Nexus original documents
      .then(esDocuments => esDocuments.map(esDocument => esDocument._source))
      // pick only agent ids and labels
      .then(agents => agents.map(agent => ({
        id: agent['@id'],
        label: getAgentLabel(agent),
        type: getAgentType(agent),
      })))
      // create a map of agents of type Record<id, label>
      .then(agents => keyBy(agents, 'id'))
      .then(agentMap => setAgentMap(agentMap));
  }, [traces]);

  const isCurrent = trace => trace.name === currentTrace;

  return (
    <div
      id={traces.length && agentMap ? 'expTraceTable' : null}
      className="layer-anatomy-summary__basis mt-2"
    >
      <Table<NexusTrace>
        columns={columns}
        dataSource={traces}
        rowKey={({ name }) => name}
        rowClassName={trace => isCurrent(trace) ? styles.highlightedRowBg : undefined}
      />
    </div>
  );
};


export default ExpTraceTable;
