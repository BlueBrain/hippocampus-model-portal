import { writeFileSync, readFileSync, readdirSync } from 'fs';


const MODELS_PATH = '/Users/getta/dev/tmp/hippocampus-models';
const NEURON_DB_PATH = '/Users/getta/Desktop/neuronDB.dat';


const morphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;
const etypeRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_([a-zA-Z0-9]+)\_.+\_[a-zA-Z0-9]+$/;
const neuronDbRecordRe = /^\w+\s(\w+)\s(\w+)$/;

async function main() {
  const modelDb = readFileSync(NEURON_DB_PATH, 'utf-8');

  const modelNames = readdirSync(MODELS_PATH);

  const models = modelNames.map(modelName => {
    // console.log(`Model name: ${modelName}`);
    const morphology = modelName.match(morphologyRe)[1];
    // console.log(`Morphology: ${morphology}`);
    const etype = modelName.match(etypeRe)[1];
    // console.log(`Etype     : ${etype}`);

    const neuronDbRe = new RegExp(`^${morphology}\\s\\w+\\s\\w+$`, 'gmi');
    const neuronDbMatch = modelDb.match(neuronDbRe);

    if (!neuronDbMatch) {
      // console.warn(`Warn: no NeuronDB record for ${morphology}`);
      return {
        name: modelName,
        morphology,
        region: null,
        etype,
        mtype: null,
      }
    }

    // console.log(neuronDbMatch);

    const neuronDbRecordMatch = neuronDbMatch[0].match(neuronDbRecordRe);

    const model = {
      name: modelName,
      morphology,
      region: neuronDbRecordMatch ? neuronDbRecordMatch[1] : null,
      etype,
      mtype: neuronDbRecordMatch ? neuronDbRecordMatch[2] : null,
    };

    return model;
  });

  // writeFileSync('./src/traces.json', JSON.stringify(ephys));
  console.log(JSON.stringify(models));
}

main();
