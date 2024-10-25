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
import { dataPath } from "@/config";
import { downloadAsJson, downloadFile } from "@/utils";
import DownloadButton from "@/components/DownloadButton";
import TraceGraph from "../5_predictions/components/Trace";
import Factsheet from "@/components/Factsheet";

import modelsData from "./neuron-model-libraries.json";

import DownloadModel from "@/components/DownloadModel";
import ExperimentalMorphologyTable from "@/components/ExperiementalMorphologyUsed";
import { PranavViewer } from "@/components/PranavViewer";
import { SwcViewer } from "../MorphoViewer/SwcViewer";

type ModelData = {
  mtype: string;
  etype: string;
  morphology: string;
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
  );
};

const NeuronsModelLibrary: React.FC = () => {
  const router = useRouter();
  const theme = 3;

  const { query } = router;
  const [currentMtype, setCurrentMtype] = useState("");
  const [currentEtype, setCurrentEtype] = useState("");
  const [currentMorphology, setCurrentMorphology] = useState("");
  const [traceData, setTraceData] = useState<any | null>(null);
  const [factsheetData, setFactsheetData] = useState<any | null>(null);
  const [morphologyData, setMorphologyData] = useState<string | null>(null);

  const mtypes = useMemo(() => getUniqueValues("mtype"), []);
  const etypes = useMemo(
    () => getUniqueValues("etype", { mtype: currentMtype }),
    [currentMtype]
  );
  const morphologies = useMemo(
    () =>
      getUniqueValues("morphology", {
        mtype: currentMtype,
        etype: currentEtype,
      }),
    [currentMtype, currentEtype]
  );

  useEffect(() => {
    if (!router.isReady) return;

    const newMtype =
      typeof query.mtype === "string" && mtypes.includes(query.mtype)
        ? query.mtype
        : mtypes[0] || "";

    const newEtypes = getUniqueValues("etype", { mtype: newMtype });
    const newEtype =
      typeof query.etype === "string" && newEtypes.includes(query.etype)
        ? query.etype
        : newEtypes[0] || "";

    const newMorphologies = getUniqueValues("morphology", {
      mtype: newMtype,
      etype: newEtype,
    });
    const newMorphology =
      typeof query.morphology === "string" &&
      newMorphologies.includes(query.morphology)
        ? query.morphology
        : newMorphologies[0] || "";

    setCurrentMtype(newMtype);
    setCurrentEtype(newEtype);
    setCurrentMorphology(newMorphology);
  }, [query, mtypes, router.isReady]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentMtype && currentEtype && currentMorphology) {
        try {
          const [traceResponse, factsheetResponse, morphologyResponse] =
            await Promise.all([
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/trace.json`
              ),
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/features_with_rheobase.json`
              ),
              fetch(
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/morphology.swc`
              ),
            ]);

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
  }, [currentMtype, currentEtype, currentMorphology]);

  const setParams = (params: {
    mtype?: string;
    etype?: string;
    morphology?: string;
  }) => {
    const newQuery = {
      ...router.query,
      ...params,
    };
    router.push({ query: newQuery, pathname: router.pathname }, undefined, {
      shallow: true,
    });
  };

  const setMtype = (mtype: string) => {
    const newEtypes = getUniqueValues("etype", { mtype });
    const newEtype = newEtypes[0] || "";
    const newMorphologies = getUniqueValues("morphology", {
      mtype,
      etype: newEtype,
    });
    const newMorphology = newMorphologies[0] || "";

    setParams({
      mtype,
      etype: newEtype,
      morphology: newMorphology,
    });
  };

  const setEtype = (etype: string) => {
    const newMorphologies = getUniqueValues("morphology", {
      mtype: currentMtype,
      etype,
    });
    const newMorphology = newMorphologies[0] || "";

    setParams({
      etype,
      morphology: newMorphology,
    });
  };

  const setMorphology = (morphology: string) => {
    setParams({
      morphology,
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
      title: "Morphology",
      key: "morphology",
      values: morphologies,
      setFn: setMorphology,
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
                    list={morphologies}
                    value={currentMorphology}
                    title={`Morphology ${
                      morphologies.length ? `(${morphologies.length})` : ""
                    }`}
                    color={colorName}
                    onSelect={setMorphology}
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
        <Collapsible id="morphologySection" className="mt-4" title="Morphology">
          <SwcViewer
            href={`data/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/morphology/${currentMorphology}.swc`}
          />
          <div className="mt-4">
            <DownloadModel
              theme={theme}
              resources={[
                `${dataPath}/2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/morphology/${currentMorphology}.swc`,
                `${dataPath}/2_reconstruction-data/neuron-models/README.md`,
                `${dataPath}/2_reconstruction-data/neuron-models/neuron_simulation.py`,
                `${dataPath}2_reconstruction-data/neuron-models-library/${currentMtype}/${currentEtype}/${currentMorphology}/electrophysiology.zip`,
              ]}
            />
          </div>
        </Collapsible>
        <Collapsible id="bPAPPSPSection" className="mt-4" title="bPAP & PSP">
          <PranavViewer
            url={`epsp-bpap/neuron_model_lib/${mapPranavFile(
              currentMtype,
              currentEtype,
              currentMorphology
            )}`}
          />
          <div className="graph"></div>
          {morphologyData && (
            <div className="mt-4">
              <DownloadButton
                onClick={() =>
                  downloadAsJson(
                    morphologyData,
                    `${currentMtype}-${currentEtype}-morphology.json`
                  )
                }
                theme={theme}
              >
                Morphology data
              </DownloadButton>
            </div>
          )}
        </Collapsible>

        <Collapsible id="traceSection" className="mt-4" title="Trace">
          <div className="graph">
            {traceData && <TraceGraph plotData={traceData} />}
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

function mapPranavFile(mType: string, eType: string, morphology: string) {
  const key = `${mType}/${eType}/${morphology}.swc`;
  const val = MAPPING[key];
  if (!val) {
    console.log(
      "🚀 [NeuronModelLibrary] mType, eType, morphology = ",
      mType,
      eType,
      morphology
    ); // @FIXME: Remove this line written on 2024-10-24 at 14:55
    console.error("No mapping found for ", key);
  }
  return val ?? "<Not found>";
}

const MAPPING = {
  "SP_PC/cACpyr/dend-oh140807_A0_idA_axon-mpg141017_a1-2_idC_-_Scale_x1.000_y1.100_z1.000_-_Clone_0.swc":
    "SP_PC/cACpyr/3",
  "SP_PC/cACpyr/dend-oh140807_A0_idA_axon-mpg141017_a1-2_idC_-_Clone_1.swc":
    "SP_PC/cACpyr/5",
  "SP_PC/cACpyr/dend-oh140807_A0_idG_axon-mpg141017_a1-2_idC_-_Scale_x1.000_y0.900_z1.000_-_Clone_0.swc":
    "SP_PC/cACpyr/2",
  "SP_PC/cACpyr/dend-mpg141216_A_idC_axon-mpg141017_a1-2_idC_-_Scale_x1.000_y0.850_z1.000_-_Clone_1.swc":
    "SP_PC/cACpyr/4",
  "SP_PC/cACpyr/dend-oh140807_A0_idH_axon-mpg141017_a1-2_idC_-_Clone_7.swc":
    "SP_PC/cACpyr/1",
  "SO_BS/bAC/011023HP2_-_Scale_x1.000_y1.100_z1.000_-_Clone_0.swc":
    "SO_BS/bAC/3",
  "SO_BS/bAC/011023HP2_-_Clone_0.swc": "SO_BS/bAC/2",
  "SO_BS/bAC/011023HP2_-_Scale_x1.000_y1.050_z1.000_-_Clone_0.swc":
    "SO_BS/bAC/4",
  "SO_BS/bAC/011023HP2.swc": "SO_BS/bAC/1",
  "SO_BS/cNAC/011023HP2_-_Scale_x1.000_y0.950_z1.000_-_Clone_0.swc":
    "SO_BS/cNAC/1",
  "SO_BS/cNAC/011023HP2_-_Clone_0.swc": "SO_BS/cNAC/4",
  "SP_AA/bAC/970911C_-_Scale_x1.000_y0.850_z1.000_-_Clone_0.swc": "SP_AA/bAC/1",
  "SP_AA/bAC/970911C_-_Clone_0.swc": "SP_AA/bAC/2",
  "SP_AA/bAC/970911C_-_Scale_x1.000_y0.950_z1.000_-_Clone_0.swc": "SP_AA/bAC/4",
  "SP_Ivy/bAC/010710HP2_-_Scale_x1.000_y1.100_z1.000_-_Clone_2.swc":
    "SP_Ivy/bAC/3",
  "SP_Ivy/bAC/010710HP2_-_Scale_x1.000_y1.050_z1.000_-_Clone_6.swc":
    "SP_Ivy/bAC/5",
  "SP_Ivy/bAC/010710HP2_-_Scale_x1.000_y1.100_z1.000_-_Clone_3.swc":
    "SP_Ivy/bAC/2",
  "SP_Ivy/bAC/970717D_-_Scale_x1.000_y0.850_z1.000_-_Clone_3.swc":
    "SP_Ivy/bAC/1",
  "SP_Ivy/cNAC/010710HP2_-_Scale_x1.000_y1.100_z1.000_-_Clone_3.swc":
    "SP_Ivy/cNAC/3",
  "SP_Ivy/cNAC/010710HP2_-_Scale_x1.000_y1.100_z1.000_-_Clone_5.swc":
    "SP_Ivy/cNAC/5",
  "SP_Ivy/cNAC/010710HP2_-_Scale_x1.000_y0.850_z1.000_-_Clone_6.swc":
    "SP_Ivy/cNAC/2",
  "SP_Ivy/cNAC/010710HP2_-_Clone_0.swc": "SP_Ivy/cNAC/4",
  "SP_Ivy/cNAC/010710HP2_-_Scale_x1.000_y0.950_z1.000_-_Clone_2.swc":
    "SP_Ivy/cNAC/1",
  "SP_BS/bAC/980513B_-_Scale_x1.000_y1.150_z1.000_-_Clone_1.swc": "SP_BS/bAC/3",
  "SP_BS/bAC/980513B_-_Scale_x1.000_y0.950_z1.000_-_Clone_0.swc": "SP_BS/bAC/1",
  "SP_BS/bAC/980513B_-_Scale_x1.000_y0.900_z1.000_-_Clone_1.swc": "SP_BS/bAC/2",
  "SP_BS/cNAC/980513B_-_Scale_x1.000_y0.950_z1.000_-_Clone_0.swc":
    "SP_BS/cNAC/1",
  "SO_BP/cNAC/980120A_-_Scale_x1.000_y0.950_z1.000_-_Clone_0.swc":
    "SO_BP/cNAC/3",
  "SO_BP/cNAC/980120A_-_Scale_x1.000_y0.850_z1.000.swc": "SO_BP/cNAC/5",
  "SO_BP/cNAC/980120A_-_Scale_x1.000_y0.950_z1.000.swc": "SO_BP/cNAC/2",
  "SO_BP/cNAC/980120A.swc": "SO_BP/cNAC/4",
  "SO_BP/cNAC/980120A_-_Scale_x1.000_y0.900_z1.000.swc": "SO_BP/cNAC/1",
  "SP_PVBC/bAC/060314AM2_-_Scale_x1.000_y1.050_z1.000.swc": "SP_PVBC/bAC/2",
  "SP_PVBC/bAC/060314AM2_-_Scale_x1.000_y1.050_z1.000_-_Clone_1.swc":
    "SP_PVBC/bAC/5",
  "SP_PVBC/bAC/060314AM2_-_Scale_x1.000_y0.850_z1.000_-_Clone_2.swc":
    "SP_PVBC/bAC/4",
  "SP_PVBC/bAC/970627BHP1_-_Scale_x1.000_y0.950_z1.000_-_Clone_2.swc":
    "SP_PVBC/bAC/1",
  "SP_PVBC/cNAC/970627BHP1_-_Clone_1.swc": "SP_PVBC/cNAC/3",
  "SP_PVBC/cNAC/990111HP2_-_Scale_x1.000_y0.900_z1.000_-_Clone_1.swc":
    "SP_PVBC/cNAC/5",
  "SP_PVBC/cNAC/060314AM2_-_Clone_0.swc": "SP_PVBC/cNAC/2",
  "SP_PVBC/cNAC/060314AM2_-_Clone_1.swc": "SP_PVBC/cNAC/4",
  "SP_PVBC/cNAC/060314AM2_-_Scale_x1.000_y0.900_z1.000_-_Clone_0.swc":
    "SP_PVBC/cNAC/1",
};
