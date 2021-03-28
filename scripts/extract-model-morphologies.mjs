import { readdirSync, copyFileSync } from 'node:fs';


const MODELS_PATH = '/Users/getta/dev/tmp/hippocampus-models';
const OUTPUT_PATH = './public/data/model-morphologies';

const morphologyRe = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_[a-zA-Z0-9]+\_(.+)\_[a-zA-Z0-9]+$/;


async function main() {
  const modelNames = readdirSync(MODELS_PATH);

  modelNames.forEach(modelName => {
    if (modelName.includes('tar')) return;

    console.log(modelName);
    const morphology = modelName.match(morphologyRe)[1];

    copyFileSync(
      `${MODELS_PATH}/${modelName}/morphology/${morphology}.asc`,
      `${OUTPUT_PATH}/${morphology}.asc`
    );
  });
}

main();
