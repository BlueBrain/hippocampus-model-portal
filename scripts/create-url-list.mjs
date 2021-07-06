import { readFileSync } from 'fs';
import qs from 'querystring';


const basePath = '/model';

const expMorphList = JSON.parse(readFileSync('./src/exp-morphology-list.json'));
const expTrace = JSON.parse(readFileSync('./src/traces.json'));
const digRecModels = JSON.parse(readFileSync('./src/models.json'));


console.log('### Home ###');
console.log(`${basePath}/`);

console.log('### Experimental Data - Neuron Morphology ###');
expMorphList.forEach(morph => {
  const query = qs.stringify({
    layer: morph.region,
    mtype: morph.mtype,
    instance: morph.name,
  });
  console.log(`${basePath}/experimental-data/neuronal-morphology/?${query}`);
});

console.log('### Experimental Data - Neuron Electrophysiology ###');
Object.entries(expTrace).forEach(([etype, etypeInstances]) => {
  etypeInstances.forEach((etypeInstance) => {
    const query = qs.stringify({
      etype,
      etype_instance: etypeInstance,
    });
    console.log(`${basePath}/experimental-data/neuronal-electrophysiology/?${query}`);
  });
});

console.log('### Digital Reconstructions - Neurons ###');
digRecModels.forEach(model => {
  const query = qs.stringify({
    layer: model.layer,
    mtype: model.mtype,
    etype: model.etype,
    instance: model.name,
  });
  console.log(`${basePath}/digital-reconstructions/neurons/?${query}`);
});
