import React, { useState, useEffect } from 'react';
import { useNexusContext } from '@bbp/react-nexus';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import { hippocampus } from '../../config';


function entryToArray(entry) {
  if (Array.isArray(entry)) return entry;

  return [entry];
}

function getAgentRoleLabel(agent) {
  if (!agent.role) return '';

  return ': ' + agent.role
    .replace(/^neuron\s/, '')
    .replace(/\srole$/, '');
}

function getAgentName(agent) {
  return agent.name
    ? agent.name
    : `${agent.familyName} ${agent.givenName}`;
}

function getAgentType(agent) {
  return agent.name
    ? 'institution'
    : 'person';
}

export type MetadataProps = {
  nexusDocument: Record<string, any>;
};

const Metadata: React.FC<MetadataProps> = ({ nexusDocument }) => {
  const nexus = useNexusContext();

  const [agents, setAgents] = useState<Record<string, any>[]>(null);

  const contributions = entryToArray(nexusDocument.contribution).filter(Boolean);
  const roleByAgentId = contributions.reduce((acc, contribution) => ({
    ...acc,
    [contribution.agent['@id']]: get(contribution, 'hadRole.label'),
  }), {});


  const agentIds = contributions
    .map(contribution => contribution.agent?.['@id'])
    .filter(Boolean);

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
        name: getAgentName(agent),
        type: getAgentType(agent),
        role: roleByAgentId[agent['@id']],
      })))
      .then(agents => agents.filter(agent => !agent?.role || !agent?.role.match(/transformation/i))) // filter out data transformation
      .then(agents => sortBy(agents, 'name'))
      .then(agents => sortBy(agents, 'type')) // brings institutions first
      .then(agents => setAgents(agents));
  }, [nexusDocument]);

  const contributionStr = agents
    ? agents.map(agent => `${agent.name}${getAgentRoleLabel(agent)}`)
      .join(', ')
    : '...';

  return (
    <>
      <h3>Contribution</h3>
      <p id={agents ? 'metadata' : undefined}>
        {contributionStr}.
      </p>
    </>
  );

};


export default Metadata;
