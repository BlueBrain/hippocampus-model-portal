import { createNexusClient } from '@bbp/nexus-sdk';
import fetch from 'node-fetch';
import AbortController from 'abort-controller/polyfill.js';
import { copyFileSync } from 'fs';


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
  const morphologies = await nexus.View.elasticSearchQuery(
    org,
    project,
    datasetViewId,
    {
      from: 0,
      size: 100,
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

  for await (let morphology of morphologies) {
    console.log(`Fetching image for ${morphology.name}`);
    const image = await nexus.File.get(org, project, encodeURIComponent(morphology.image['@id']));
    copyFileSync(image._location.replace('file://', ''), `./exp-morph-images/${image._filename}`);
  }
}

main();
