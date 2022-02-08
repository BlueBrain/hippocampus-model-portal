import { writeFileSync, readFileSync, readdirSync } from 'fs';


const MODELS_PATH = 'tmp/models';
const NEURON_DB_PATH = 'tmp/neuronDB.dat';


const morphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;
const etypeRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_([a-zA-Z0-9]+)\_.+\_[a-zA-Z0-9]+$/;
const neuronDbRecordRe = /^\w+\s(\w+)\s(\w+)$/;

async function main() {
  const modelDb = readFileSync(NEURON_DB_PATH, 'utf-8');

  const modelNames = readdirSync(MODELS_PATH);

  const models = modelNames.map(modelName => {
    const morphology = modelName.match(morphologyRe)[1];
    const etype = modelName.match(etypeRe)[1];

    const neuronDbRe = new RegExp(`^${morphology}\\s\\w+\\s\\w+$`, 'gmi');
    const neuronDbMatch = modelDb.match(neuronDbRe);

    if (!neuronDbMatch) {
      return {
        name: modelName,
        morphology,
        region: null,
        etype,
        mtype: null,
      }
    }

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

  console.log(JSON.stringify(models));
}

main();
