import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Title from "@/components/Title";
import InfoBox from "@/components/InfoBox";
import Filters from "@/layouts/Filters";
import DataContainer from "@/components/DataContainer";
import { QuickSelectorEntry } from "@/types";
import List from "@/components/List";
import Collapsible from "@/components/Collapsible";

import { defaultSelection } from "@/constants";
import withPreselection from "@/hoc/with-preselection";
import { colorName } from "./config";
import { basePath, dataPath } from "@/config";
import { downloadAsJson, downloadFile } from "@/utils";
import DownloadButton from "@/components/DownloadButton";
import TraceGraph from "../5_predictions/components/Trace";
import Factsheet from "@/components/Factsheet";

import modelsData from "./neuron-model-libraries.json";

import DownloadModel from "@/components/DownloadModel";
import ExperimentalMorphologyTable from "@/components/ExperiementalMorphologyUsed";
import { PranavViewer } from "@/components/PranavViewer";
import { SwcViewer } from "../MorphoViewer/SwcViewer";
import LayerSelector3D from "@/components/LayerSelector3D";
import { Layer } from "@/types";

type ModelData = {
  layer: Layer;
  mtype: string;
  etype: string;
  morphology: string;
  id: string;
};

const getUniqueValues = (
  key: keyof ModelData,
  filters: Partial<ModelData> = {}
): string[] => {
  return Array.from(
    new Set(
      modelsData
        .filter((model) =>
          Object.entries(filters).every(
            ([filterKey, filterValue]) =>
              !filterValue ||
              model[filterKey as keyof ModelData] === filterValue
          )
        )
        .map((model) => model[key] as string)
    )
  ).sort();
};
const getFilteredData = (filters: Partial<ModelData>): ModelData[] => {
  return modelsData.filter((model) =>
    Object.entries(filters).every(
      ([key, value]) => !value || model[key as keyof ModelData] === value
    )
  ).map(model => ({
    ...model,
    layer: model.layer as Layer
  }));
};

const NeuronsModelLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentLayer, setCurrentLayer] = useState<Layer | "">("");
  const [currentMtype, setCurrentMtype] = useState("");
  const [currentEtype, setCurrentEtype] = useState("");
  const [currentMorphology, setCurrentMorphology] = useState<any | null>(null);
  const [currentId, setCurrentId] = useState("");
  const [traceData, setTraceData] = useState<any | null>(null);
  const [factsheetData, setFactsheetData] = useState<any | null>(null);
  const [morphologyData, setMorphologyData] = useState<string | null>(null);

  const layers = useMemo(() => getUniqueValues("layer") as Layer[], []);
  const mtypes = useMemo(
    () => getUniqueValues("mtype", { layer: currentLayer as Layer }),
    [currentLayer]
  );
  const etypes = useMemo(
    () => getUniqueValues("etype", { 
      layer: currentLayer as Layer,
      mtype: currentMtype 
    }),
    [currentLayer, currentMtype]
  );
  const ids = useMemo(
    () =>
      getUniqueValues("id", {
        layer: currentLayer as Layer,
        mtype: currentMtype,
        etype: currentEtype,
      }),
    [currentLayer, currentMtype, currentEtype]
  );

  // const morphologies = useMemo(
  //   () =>
  //     getUniqueValues("morphology", {
  //       layer: currentLayer as Layer,
  //       mtype: currentMtype,
  //       etype: currentEtype,
  //       id: currentId,
  //     }),
  //   [currentLayer, currentMtype, currentEtype, currentId]
  // );

  useEffect(() => {
    if (!router.isReady) return;

    const newLayer =
      typeof query.layer === "string" && layers.includes(query.layer as Layer)
        ? (query.layer as Layer)
        : layers[0] || "";

    const newMtypes = getUniqueValues("mtype", { layer: newLayer });
    const newMtype =
      typeof query.mtype === "string" && newMtypes.includes(query.mtype)
        ? query.mtype
        : newMtypes[0] || "";

    const newEtypes = getUniqueValues("etype", { mtype: newMtype });
    const newEtype =
      typeof query.etype === "string" && newEtypes.includes(query.etype)
        ? query.etype
        : newEtypes[0] || "";

    const newIds = getUniqueValues("id", {
      mtype: newMtype,
      etype: newEtype,
    });
    const newId =
      typeof query.id === "string" && newIds.includes(query.id)
        ? query.id
        : newIds[0] || "";
    
    const newMorphologies = getUniqueValues("morphology", {
      mtype: newMtype,
      etype: newEtype,
      id: newId,
    });
    const newMorphology =
      typeof query.morphology === "string" && newMorphologies.includes(query.morphology)
        ? query.morphology
        : newMorphologies[0] || "";

    console.log("**query**", query);
    console.log("**newLayer**", newLayer);
    console.log("**newMtype**", newMtype);
    console.log("**newEtype**", newEtype);
    console.log("**newId**", newId);
    console.log("**newMorphology**", newMorphology);
    // console.log("**morphologies**", morphologies);
    setCurrentLayer(newLayer);
    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
    setCurrentId(newId);
    setCurrentMorphology(newMorphology);
  }, [query, layers, router.isReady]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentMtype && currentEtype && currentId && currentMorphology && currentLayer) {
        try {


          const [traceResponse, factsheetResponse, morphologyResponse] =
            await Promise.all([
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/trace.json`
              ),
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/processed_features.json`
              ),
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/morphology/${currentMorphology}.swc`
              ),
            ]);
          
          console.log("**dataPath**", dataPath);

          const traceData = await traceResponse.json();
          const factsheetData = await factsheetResponse.json();
          const morphologyData = await morphologyResponse.text();

          setTraceData(traceData);
          setFactsheetData(factsheetData);
          setMorphologyData(morphologyData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setTraceData(null);
          setFactsheetData(null);
          setMorphologyData(null);
        }
      }
    };

    fetchData();
  }, [currentMtype, currentEtype, currentId, currentMorphology, currentLayer]);

  const setParams = (params: {
    layer?: Layer;
    mtype?: string;
    etype?: string;
    id?: string;
  }) => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, {
      shallow: true,
    });
  };

  const setLayer = (layer: Layer) => {
    const newMtypes = getUniqueValues("mtype", { layer }) as string[];
    const newMtype = newMtypes[0] || "";
    const newEtypes = getUniqueValues("etype", {
      layer,
      mtype: newMtype,
    }) as string[];
    const newEtype = newEtypes[0] || "";
    const newIds = getUniqueValues("id", {
      layer,
      mtype: newMtype,
      etype: newEtype,
    });
    const newId = newIds[0] || "";

    setParams({
      layer,
      mtype: newMtype,
      etype: newEtype,
      id: newId,
    });
  };

  const setMtype = (mtype: string) => {
    const newEtypes = getUniqueValues("etype", { mtype });
    const newEtype = newEtypes[0] || "";
    const newIds = getUniqueValues("id", {
      mtype,
      etype: newEtype,
    });
    const newId = newIds[0] || "";

    setParams({
      mtype,
      etype: newEtype,
      id: newId,
    });
  };

  const setEtype = (etype: string) => {
    const newIds = getUniqueValues("id", {
      mtype: currentMtype,
      etype,
    });
    const newId = newIds[0] || "";

    setParams({
      etype,
      id: newId,
    });
  };

  const setId = (id: string) => {
    setParams({
      id,
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: "M-Type",
      key: "mtype",
      values: mtypes,
      setFn: setMtype,
    },
    {
      title: "E-Type",
      key: "etype",
      values: etypes,
      setFn: setEtype,
    },
    {
      title: "Cell model instance",
      key: "id",
      values: ids,
      setFn: setId,
    },
  ];

  return (
    <>
      <Filters theme={theme}>
        <div className="row w-100 content-center">
          <div className="col-xs-12 col-lg-6 content-center">
            <Title
              title="Neuron model library"
              subtitle="Reconstruction Data"
              theme={theme}
            />
            <InfoBox color={colorName}>
              <p>
                Initial set of single{" "}
                <Link
                  className={`link theme-${theme}`}
                  href="/reconstruction-data/neuron-models"
                >
                  cell models
                </Link>{" "}
                are combined with the{" "}
                <Link
                  className={`link theme-${theme}`}
                  href="/experimental-data/neuronal-morphology/"
                >
                  morphology library
                </Link>{" "}
                to produce a library of neuron models.
              </p>
            </InfoBox>
          </div>

          <div className="col-xs-12 col-lg-6">
            <div className="selector">
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>
                  Choose a layer
                </div>
                <div className="selector__selector-container">
                  <LayerSelector3D
                    value={currentLayer || undefined}
                    onSelect={setLayer}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme}`}>
                <div className={`selector__head theme-${theme}`}>
                  Select reconstruction
                </div>
                <div className="selector__body">
                  <List
                    block
                    list={mtypes}
                    value={currentMtype}
                    title={`M-type ${
                      mtypes.length ? `(${mtypes.length})` : ""
                    }`}
                    color={colorName}
                    onSelect={setMtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={etypes}
                    value={currentEtype}
                    title={`E-type ${
                      etypes.length ? `(${etypes.length})` : ""
                    }`}
                    color={colorName}
                    onSelect={setEtype}
                    theme={theme}
                  />
                  <List
                    block
                    list={ids}
                    value={currentId}
                    title={`Cell model instance ${
                      ids.length ? `(${ids.length})` : ""
                    }`}
                    color={colorName}
                    onSelect={setId}
                    anchor="data"
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        theme={theme}
        navItems={[
          { id: "downloadModelSection", label: "Download Model" },
          { id: "morphologySection", label: "Morphology" },
          { id: "bPAPPSPSection", label: "bPAP & PSP" },
          { id: "traceSection", label: "Trace" },
          { id: "factsheetSection", label: "Factsheet" },
          {
            id: "ExperimentalMorphologySection",
            label: "Experimental morphology used for this model",
          },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <Collapsible id="downloadModelSection" className="mt-4" title="Download NEURON model">
          <p>
            Download the complete NEURON model package, including morphology, mechanisms, 
            and electrophysiology data for the selected model instance.
          </p>
          <div className="mt-4">
            <DownloadButton
              onClick={() => downloadFile(`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/model_files.zip`, `${currentId}_model_files.zip`)}
              theme={theme}
            >
              Download model package
            </DownloadButton>
          </div>
        </Collapsible>
        <Collapsible id="morphologySection" className="mt-4" title="Morphology">
          <SwcViewer
            href={`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/morphology/${currentMorphology}.swc`}
          />
          <div className="mt-4">
            <DownloadButton
              onClick={() => downloadFile(`${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentId}/morphology/${currentMorphology}.swc`, `${currentMorphology}.swc`)}
              theme={theme}
            >
              Download morphology
            </DownloadButton>
          </div>
        </Collapsible>


        <Collapsible id="traceSection" className="mt-4" title="Trace">
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} maxTime={1200} />}
          </div>

          {traceData && (
            <div className="mt-4">
              <DownloadButton
                onClick={() =>
                  downloadAsJson(
                    traceData,
                    `${currentMtype}-${currentEtype}-${currentMorphology}-trace.json`
                  )
                }
                theme={theme}
              >
                Trace data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible id="factsheetSection" className="mt-4" title="Factsheet">
          {factsheetData && (
            <>
              <Factsheet facts={factsheetData} />
              <div className="mt-4">
                <DownloadButton
                  onClick={() =>
                    downloadAsJson(
                      factsheetData,
                      `${currentMtype}-${currentEtype}-${currentMorphology}-factsheet.json`
                    )
                  }
                  theme={theme}
                >
                  Factsheet
                </DownloadButton>
              </div>
            </>
          )}
        </Collapsible>

        <Collapsible id="bPAPPSPSection" className="mt-4" title="bPAP & PSP">
          <PranavViewer
            url={`${dataPath}/epsp-bpap/neuron_model_lib/${currentMtype}/${currentEtype}/${currentId}`}
          />
        </Collapsible>




        <Collapsible
          id="ExperimentalMorphologySection"
          className="mt-4"
          title="Experimental morphology used for this model"
        >
          <ExperimentalMorphologyTable
            MorphologyData={modelsData}
            currentInstance={currentMorphology}
            isMorphologyLibrary={true}
          />
        </Collapsible>
      </DataContainer>
    </>
  );
};

export default withPreselection(NeuronsModelLibrary, {
  key: "mtype",
  defaultQuery: defaultSelection.digitalReconstruction.NeuronModelLibrary,
});