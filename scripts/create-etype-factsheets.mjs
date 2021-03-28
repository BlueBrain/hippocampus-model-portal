import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'fs';

const MODEL_INFO_PATH = '/Users/getta/dev/tmp/hippocampus-packages-info';
const OUTPUT_PATH = './public/data/model-info';

async function main() {
  const modelNames = readdirSync(MODEL_INFO_PATH);

  for (let modelName of modelNames) {
    const rawDistributions = JSON.parse(readFileSync(`${MODEL_INFO_PATH}/${modelName}/distributions.json`));
    const distributions = Object.values(rawDistributions)[0];

    const rawFeatures = JSON.parse(readFileSync(`${MODEL_INFO_PATH}/${modelName}/features.json`));
    const features = Object.values(rawFeatures)[0];

    const factsheet = {
      features,
      distributions,
    }

    mkdirSync(`${OUTPUT_PATH}/${modelName}`);
    writeFileSync(
      `${OUTPUT_PATH}/${modelName}/etype_factsheet.json`,
      JSON.stringify(factsheet),
    );
  }
}

main();
