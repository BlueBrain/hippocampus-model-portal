import { createNexusClient } from '@bbp/nexus-sdk';
import fetch from 'node-fetch';
import get from 'lodash/get.js';
import AbortController from 'abort-controller/polyfill.js';
import { writeFileSync } from 'fs';


const org = 'public';
const project = 'hippocampus';
const datasetViewId = encodeURIComponent('https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset');

export const nexusConf = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL || 'https://bbp.epfl.ch/nexus/v1',
  token: process.env.NEXT_PUBLIC_NEXUS_TOKEN,
};

const nexus = createNexusClient({
  fetch,
  uri: nexusConf.url,
  token: nexusConf.token,
});

async function main() {
  const allMorphologies = await nexus.View.elasticSearchQuery(
    org,
    project,
    datasetViewId,
    {
      from: 0,
      size: 1000,
      query: {
        term: {
          '@type': 'https://neuroshapes.org/ReconstructedCell'
        }
      },
    }
  )
    .then(esData => esData.hits.hits)
    .then(esMorphs => esMorphs.map(esMorph => esMorph._source))
    .catch(err => console.log(err));

  console.log(`Fetched ${allMorphologies.length} morphologies`);

  const expMorphList = allMorphologies
    .map(rawMorph => {
      const rawRegion = get(rawMorph, 'brainLocation.brainRegion.label');
      if (!rawRegion) {
        console.log(`No region found for morphology: ${rawMorph.name}`);
        return;
      }
      const region = rawRegion.match(/\w+\_(\w+)/)[1];

      const mtype = get(rawMorph, 'annotation.hasBody.label');
      if (!mtype) {
        console.log(`No mtype found for morphology: ${rawMorph.name}`);
        console.log(rawMorph);
      }

      return {
        name: rawMorph.name,
        id: rawMorph['@id'],
        region,
        mtype,
      };
    })
    .filter(Boolean);

  console.log(`Got ${expMorphList.length} morphologies in the list`);

  writeFileSync('./src/exp-morphology-list.json', JSON.stringify(expMorphList));
}

main();
