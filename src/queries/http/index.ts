
import { basePath, dataPath } from '@/config';
import { VolumeSection } from '@/types';

// Experimental Data

export const expMorphFactesheetPath = (morphName: string) => {
  return `${dataPath}/1_experimental-data/neuronal-morphology/morphology/${morphName}/factsheet.json`;
};

export const expMorphPopulationFactesheetPath = (mtype: string) => {
  return `${dataPath}/1_experimental-data/neuronal-morphology/mtype/${mtype}/factsheet.json`;
};

export const expMorphPopulationDistributionPlotsPath = (mtype: string) => {
  return `${dataPath}/1_experimental-data/neuronal-morphology/mtype/${mtype}/distribution-plots.json`;
};

export const expMorphDistributionPlotsPath = (morph: string) => {
  return `${dataPath}/1_experimental-data/neuronal-morphology/morphology/${morph}/distribution-plots.json`;
};

export const subregionCircuitFactsheetPath = (subregion: string): string => {
  return `${basePath}/data/model-data/factsheets/REGION/${subregion}/Circuit/factsheet.json`;
};

export const regionCircuitFactsheetPath = (): string => {
  return `${basePath}/data/model-data/factsheets/Circuit/factsheet.json`;
}

export const subregionMicrocircuitFactsheetPath = (subregion: string): string => {
  return `${basePath}/data/model-data/factsheets/REGION/${subregion}/Central/Circuit/factsheet.json`;
}

export const etypeFactsheetPath = (
  instance: string
): string => {
  return `${basePath}/data/model-info/${instance}/etype_factsheet.json`;
}

export const metypeFactsheetPath = (
  region: string,
  mtype: string,
  etype: string,
  instance: string,
) => {
  return `${basePath}/data/memodel_factsheets/${mtype}/${etype}/${region}/${instance}/me_type_factsheeet.json`;
}

export const layerFactsheetPath = (subregion: string, layerNum: number): string => {
  return `${basePath}/data/model-data/factsheets/REGION/${subregion}/Central/CircuitLayers/${layerNum}/factsheet.json`;
};

export const pathwayFactsheetPath = (subregion: string, pathway: string): string => {
  return `${basePath}/data/model-data/factsheets/REGION/${subregion}/Central/Pathways/${pathway}/factsheet.json`;
};

export const expMorphologyFactsheetPath = (morphologyName: string): string => {
  return `${basePath}/data/exp-morphologies/factsheets/${morphologyName}/morphology_factsheeet.json`;
};

export const morphHistogramIndexPath = (region: string, mtype: string) => {
  return `${basePath}/data/morph-histogram/${region}_Column/${mtype}/histogram-index.json`;
};


// Reconstruction Data - Volume

export const volumeRasterDataPath = (volumeSection: VolumeSection) => {
  const fileName = volumeSection === 'region' ? 'CA1' : volumeSection;

  return `${dataPath}/rec-data/volume/${fileName}.xz`;
};

export const volumeAnalysisPath = `${dataPath}/rec-data/volume/volume_analysis.json`;


// Digital Reconstructions

// Digital Reconstructions - Region

export const regionFactsheetPath = (volumeSection: VolumeSection) => {
  if (!volumeSection) return "";

  return `${dataPath}/dig-rec/region/${volumeSection}/factsheet.json`;
};

// Digital Reconstructions - Pathways

export const pathwayIndexPath = `${dataPath}/pathway-index.json`;

export const connectionViewerDataPath = (preMtype: string, postMtype: string) => {
  return `${dataPath}/dig-rec/pathways/connection-viewer/${preMtype}-${postMtype}.msgpack`;
};

