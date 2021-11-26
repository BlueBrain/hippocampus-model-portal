import React, { useState, useEffect } from 'react';
import { keyBy } from 'lodash';
import { useNexusContext } from '@bbp/react-nexus';

import { hippocampus } from '../../config';
import ImageViewer from '../ImageViewer';

import styles from './styles.module.scss'


type ExpTraceTableProps = {
  traces: Record<string, any>[];
  currentTrace?: string;
};

function entryToArray(entry) {
  if (Array.isArray(entry)) return entry;

  return [entry];
}

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

const ExpTraceTable: React.FC<ExpTraceTableProps> = ({ currentTrace, traces = [] }) => {
  const nexus = useNexusContext();

  const agentIds = traces.reduce((ids: string[], trace) => {
    const currIds = entryToArray(trace.contribution)
      .map(contribution => contribution.agent?.['@id'])
      .filter(Boolean);

    return Array.from(new Set([...ids, ...currIds]));
  }, []);

  const [agentMap, setAgentMap] = useState<Record<string, any>>(null);

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
      <table>
        <thead>
          <tr className={styles.highlightedRowBg}>
            <th>Name</th>
            {/* <th>Image</th> */}
            <th>E-Type</th>
            <th>Contribution</th>
          </tr>
        </thead>
        <tbody>
          {traces.map(trace => (
            <tr className={isCurrent(trace) ? styles.highlightedRowBg : undefined} key={trace.name}>
              <td className={`text-capitalize ${isCurrent(trace) ? 'text-bold' : undefined}`}>
                {trace.name}
              </td>
              <td className={`text-capitalize ${isCurrent(trace) ? 'text-bold' : undefined}`}>
                {trace.annotation.hasBody.label}
              </td>
              <td>
                {agentMap && entryToArray(trace.contribution)
                  .map(contribution => agentMap[contribution.agent['@id']])
                  .sort((a1, a2) => a1.type > a2.type ? 1 : -1)
                  .map(agent => <span key={agent.label}>{agent.label} <br/></span>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ExpTraceTable;
