import { createNexusClient } from '@bbp/nexus-sdk';
import fetch from 'node-fetch';
import get from 'lodash/get.js';
import AbortController from 'abort-controller/polyfill.js';
import { writeFileSync } from 'fs';


const org = 'public';
const project = 'hippocampus-hub';
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
  const allTraces = await nexus.View.elasticSearchQuery(
    org,
    project,
    datasetViewId,
    {
      from: 0,
      size: 1000,
      query: {
        term: {
          '@type': 'Trace'
        }
      },
    }
  )
    .then(esData => esData.hits.hits)
    .then(esTraces => esTraces.map(esTrace => esTrace._source))
    .catch(err => console.log(err));

  const nonSmrTraces = allTraces.filter(trace => {
    const distributions = Array.isArray(trace.distribution)
      ? trace.distribution
      : [trace.distribution];

    return !distributions.some(distribution => distribution.name.match(/smr/i));
  });

  const ephys = {};

  const noEtypeLabelTraces = new Set();
  const duplicateNameTraces = new Set();

  nonSmrTraces.forEach(trace => {
    if (get(trace, 'annotation.name') !== 'E-type Annotation') {
      noEtypeLabelTraces.add(trace.name);
      return;
    }

    const etype = trace.annotation.hasBody.label;

    if (!ephys[etype]) {
      ephys[etype] = [trace.name];
    } else if (!ephys[etype].includes(trace.name)){
      ephys[etype].push(trace.name);
    } else {
      duplicateNameTraces.add(trace.name);
    }
  });

  console.log('Traces skipped due to lack of E-type annotation:');
  console.log(Array.from(noEtypeLabelTraces));
  console.log();
  console.log('Traces skipped due to name duplication:');
  console.log(Array.from(duplicateNameTraces));

  console.log(ephys);

  writeFileSync('./src/traces.json', JSON.stringify(ephys));
}

main();
