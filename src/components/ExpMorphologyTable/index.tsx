import React, { useEffect } from 'react';
import { keyBy } from 'lodash';
import { useNexusContext } from '@bbp/react-nexus';
import { Table } from 'antd';

import { hippocampus } from '../../config';
import { entryToArray } from '../../utils';
import { Layer } from '../../types';
import { useExpMorphologyColumns } from './expMorphologyTableUtils';

import styles from './styles.module.scss'


type ExpMorphologyTableProps = {
  // layer and mtype here are used to compose a link to the morphology instance page
  layer: Layer;
  mtype: string;
  morphologies: Record<string, any>[];
  currentMorphology?: string;
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

const ExpMorphologyTable: React.FC<ExpMorphologyTableProps> = ({
  layer,
  mtype,
  currentMorphology,
  morphologies = []
}) => {
  const nexus = useNexusContext();

  const agentIds = morphologies.reduce((ids: string[], morphology) => {
    const currIds = entryToArray(morphology.contribution)
      .map(contribution => contribution.agent?.['@id'])
      .filter(Boolean);

    return Array.from(new Set([...ids, ...currIds]));
  }, []);

  // const [agentMap, setAgentMap] = useState<Record<string, any>>(null);
  const { setAgentMap, columns } = useExpMorphologyColumns(layer, mtype, currentMorphology);

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
  }, [morphologies]);

  return (
    <div id="expMorphologyTable" className="layer-anatomy-summary__basis mt-2">
      <Table
        className="responsiveTable"
        columns={columns}
        dataSource={morphologies}
        size="small"
        rowKey={(record) => record.name}
        rowClassName={morphology => morphology.name === currentMorphology ? styles.highlightedRowBg : undefined}
      />
    </div>
  );
};


export default ExpMorphologyTable;
