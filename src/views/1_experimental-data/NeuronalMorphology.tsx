import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Filters from "@/layouts/Filters";
import StickyContainer from "@/components/StickyContainer";
import Title from "@/components/Title";
import InfoBox from "@/components/InfoBox";
import List from "@/components/List";
import LayerSelector3D from "@/components/LayerSelector3D";
import DataContainer from "@/components/DataContainer";
import Collapsible from "@/components/Collapsible";
import AuthorBox from "@/components/AuthorBox/AuthorBox";
import HttpData from "@/components/HttpData";
import InstanceViewer from "./neuronal-morphology/InstanceViewer";
import NeuronFactsheet from "./neuronal-morphology/NeuronFactsheet";
import { basePath } from "@/config";
import { defaultSelection, layers } from "@/constants";
import { Layer } from "@/types";
import morphologies from "@/exp-morphology-list.json";
import MorphDistributionPlots from "@/components/MorphDistributionsPlots";
import DownloadButton from "@/components/DownloadButton";
import { downloadAsJson } from "@/utils";
import NeuronTable from "./neuronal-morphology/NeuronTable";
import withPreselection from "@/hoc/with-preselection";
import { SwcViewer } from "../MorphoViewer/SwcViewer";

type QuickSelection = {
  layer: Layer | null;
  mtype: string;
  instance: string;
};

const NeuronalMorphologyView: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const [quickSelection, setQuickSelection] = useState<QuickSelection>({
    layer: null,
    mtype: "",
    instance: "",
  });

  const theme = 1;

  useEffect(() => {
    if (!router.isReady) return;

    if (!query.layer && !query.mtype && !query.instance) {
      const defaultQuery = defaultSelection.experimentalData.neuronMorphology;
      setQuickSelection(defaultQuery as QuickSelection);
      router.replace({ query: defaultQuery }, undefined, { shallow: true });
    } else {
      setQuickSelection({
        layer: (query.layer as Layer) || null,
        mtype: (query.mtype as string) || "",
        instance: (query.instance as string) || "",
      });
    }
  }, [router.isReady, query]);

  const setParams = (params: Partial<QuickSelection>): void => {
    const newQuery = { ...router.query, ...params };
    router.push({ query: newQuery }, undefined, { shallow: true });
  };

  const getMtypes = (layer: Layer | null) => {
    return layer
      ? Array.from(
          new Set(
            morphologies.filter((m) => m.region === layer).map((m) => m.mtype)
          )
        ).sort()
      : [];
  };

  const getInstances = (mtype: string) => {
    return mtype
      ? morphologies
          .filter((m) => m.mtype === mtype)
          .map((m) => m.name)
          .sort()
      : [];
  };

  const setLayerQuery = (layer: string) => {
    setQuickSelection((prev) => {
      const newLayer = layer as Layer | null;
      const newMtypes = getMtypes(newLayer);
      const newMtype = newMtypes.length > 0 ? newMtypes[0] : "";
      const newInstances = getInstances(newMtype);
      const newInstance = newInstances.length > 0 ? newInstances[0] : "";

      const updatedSelection = {
        layer: newLayer,
        mtype: newMtype,
        instance: newInstance,
      };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setMtypeQuery = (mtype: string) => {
    setQuickSelection((prev) => {
      const newInstances = getInstances(mtype);
      const newInstance = newInstances.length > 0 ? newInstances[0] : "";

      const updatedSelection = { ...prev, mtype, instance: newInstance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setInstanceQuery = (instance: string) => {
    setQuickSelection((prev) => {
      const updatedSelection = { ...prev, instance };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const mtypes = getMtypes(quickSelection.layer);
  const instances = getInstances(quickSelection.mtype);

  const qsEntries = [
    {
      title: "Layer",
      key: "layer",
      values: layers,
      setFn: setLayerQuery,
    },
    {
      title: "M-type",
      key: "mtype",
      values: mtypes,
      setFn: setMtypeQuery,
    },
    {
      title: "Instance",
      key: "instance",
      values: instances,
      setFn: setInstanceQuery,
    },
  ];

  return (
    <>
      <Filters theme={theme} hasData={!!quickSelection.instance}>
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/3 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title={<span>Neuronal Morphology</span>}
                subtitle="Experimental Data"
                theme={theme}
              />
              <div className="w-full" role="information">
                <InfoBox>
                  <p>
                    We classified neuronal morphologies into different
                    morphological types (m-types) and created digital 3D
                    reconstructions. Using objective classification methods, we
                    identified 12 m-types in region CA1 of the rat hippocampus.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>
          <div className="flex flex-col-reverse md:flex-row-reverse gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-2/3 md:w-full flex-grow md:flex-none">
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>
                Select reconstruction
              </div>
              <div className="selector__body">
                <List
                  block
                  list={mtypes}
                  value={quickSelection.mtype}
                  title="m-type"
                  onSelect={setMtypeQuery}
                  theme={theme}
                />
                <List
                  block
                  list={instances}
                  value={quickSelection.instance}
                  title="Reconstructed morphology"
                  onSelect={setInstanceQuery}
                  anchor="data"
                  theme={theme}
                />
              </div>
            </div>
            <div className={`selector__column theme-${theme} w-full`}>
              <div className={`selector__head theme-${theme}`}>
                Choose a layer
              </div>
              <div className="selector__body">
                <LayerSelector3D
                  value={quickSelection.layer || undefined}
                  onSelect={setLayerQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </Filters>
      <DataContainer
        theme={theme}
        visible={!!quickSelection.instance}
        navItems={[
          { id: "morphologySection", label: "Neuron Morphology" },
          { id: "populationSection", label: "Population" },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible
          id="morphologySection"
          title="Neuron Morphology"
          properties={[
            quickSelection.layer,
            quickSelection.mtype,
            quickSelection.instance,
          ]}
        >
          <AuthorBox>
            <h3 className="text-lg">Contribution</h3>
            <p>
              Alex Thomson: supervision, Audrey Mercer: supervision, University
              College London.
            </p>
          </AuthorBox>
          <p className="text-lg mt-10 mb-2 ">
            We provide visualization and morphometrics for the selected
            morphology.
          </p>
          <InstanceViewer
            theme={theme}
            currentMtype={quickSelection.mtype}
            currentInstance={quickSelection.instance}
          />
          <SwcViewer
            href={`data/1_experimental-data/neuronal-morphology/morphology/${quickSelection.instance}/morphology.swc`}
          />
          <div className="mb-4">
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/morphology/${quickSelection.instance}/factsheet.json`}
            >
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet
                        id="morphometrics"
                        facts={factsheetData.values}
                      />
                      <div className="mt-4">
                        <DownloadButton
                          onClick={() =>
                            downloadAsJson(
                              factsheetData.values,
                              `${quickSelection.instance}-factsheet.json`
                            )
                          }
                          theme={theme}
                        >
                          Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
          <div className="mb-4">
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/morphology/${quickSelection.instance}/distribution-plots.json`}
            >
              {(plotsData) => (
                <>
                  {plotsData && (
                    <>
                      <MorphDistributionPlots
                        type="singleMorphology"
                        data={plotsData}
                      />
                      <div className="mt-4">
                        <DownloadButton
                          onClick={() =>
                            downloadAsJson(
                              plotsData,
                              `${instances}-plot-data.json`
                            )
                          }
                          theme={theme}
                        >
                          Plot Data
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
          <div className="mt-8 ">
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/morphology/${quickSelection.instance}/table.json`}
            >
              {(tableData) => (
                <>
                  {tableData && (
                    <NeuronTable
                      theme={theme}
                      data={tableData}
                      layer={quickSelection.layer || undefined}
                      mtype={quickSelection.mtype}
                      nameLink={false}
                    />
                  )}
                </>
              )}
            </HttpData>
          </div>
        </Collapsible>
        <Collapsible id="populationSection" title="Population">
          <p className="text-lg mb-2">
            We provide morphometrics for the entire m-type group selected.
          </p>
          <div className="mb-4">
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/mtype/${quickSelection.mtype}/factsheet.json`}
            >
              {(factsheetData) => (
                <>
                  {factsheetData && (
                    <>
                      <NeuronFactsheet
                        id="morphometrics"
                        facts={factsheetData.values}
                      />
                      <div className="mt-4">
                        <DownloadButton
                          onClick={() =>
                            downloadAsJson(
                              factsheetData.values,
                              `${quickSelection.mtype}-factsheet.json`
                            )
                          }
                          theme={theme}
                        >
                          Factsheet
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>

          <div className="mt-8">
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/mtype/${quickSelection.mtype}/distribution-plots.json`}
            >
              {(plotsData) => (
                <>
                  {plotsData && (
                    <>
                      <MorphDistributionPlots
                        type="singleMorphology"
                        data={plotsData}
                      />
                      <div className="mt-4">
                        <DownloadButton
                          onClick={() =>
                            downloadAsJson(
                              plotsData,
                              `${instances}-plot-data.json`
                            )
                          }
                          theme={theme}
                        >
                          Plot Data
                        </DownloadButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </HttpData>
          </div>
          <div>
            <HttpData
              path={`${basePath}/data/1_experimental-data/neuronal-morphology/mtype/${quickSelection.mtype}/table.json`}
            >
              {(tableData) => (
                <>
                  {tableData && (
                    <NeuronTable
                      theme={theme}
                      data={tableData}
                      layer={quickSelection.layer || undefined}
                      mtype={quickSelection.mtype}
                      nameLink={true}
                    />
                  )}
                </>
              )}
            </HttpData>
          </div>
        </Collapsible>
      </DataContainer>
    </>
  );
};

const hocPreselection = withPreselection(NeuronalMorphologyView, {
  key: "layer",
  defaultQuery: defaultSelection.experimentalData.neuronMorphology,
});

export default hocPreselection;
