import React, { useState, useEffect } from 'react';
import { keyBy } from 'lodash';
import { useNexusContext } from '@bbp/react-nexus';

import { hippocampus, basePath } from '../../config';
import ImageViewer from '../ImageViewer';

import styles from './styles.module.scss'


type ExpMorphologyTableProps = {
  morphologies: Record<string, any>[];
  currentMorphology?: string;
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

const ExpMorphologyTable: React.FC<ExpMorphologyTableProps> = ({ currentMorphology, morphologies = [] }) => {
  const nexus = useNexusContext();

  const agentIds = morphologies.reduce((ids: string[], morphology) => {
    const currIds = entryToArray(morphology.contribution)
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
  }, [morphologies]);

  const isCurrent = morphology => morphology.name === currentMorphology;

  return (
    <div id="expMorphologyTable" className="layer-anatomy-summary__basis mt-2">
      <table>
        <thead className={styles.highlightedRowBg}>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>M-Type</th>
            <th>Contribution</th>
          </tr>
        </thead>
        <tbody>
          {morphologies.map(morph => (
            <tr
              className={isCurrent(morph) ? styles.highlightedRowBg : undefined}
              key={morph.name}
            >
              <td className={`text-capitalize ${isCurrent(morph) ? 'text-bold' : ''}`}>
                {morph.name}
              </td>
              <td style={{ textAlign: 'center'}}>
                <div className={styles.morphImageContainer}>
                  <ImageViewer
                    src={`${basePath}/assets/images/exp-morph-images/${morph.name}.jpeg`}
                    alt={`Morphology ${morph.name} image`}
                    loading="lazy"
                  />
                </div>
              </td>
              <td className={isCurrent(morph) ? 'text-bold' : ''}>
                {morph.annotation.hasBody.label}
              </td>
              <td>
                {agentMap && entryToArray(morph.contribution)
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


export default ExpMorphologyTable;
