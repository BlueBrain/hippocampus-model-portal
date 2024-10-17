import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Filters from "@/layouts/Filters";
import StickyContainer from "@/components/StickyContainer";
import Title from "@/components/Title";
import InfoBox from "@/components/InfoBox";
import DataContainer from "@/components/DataContainer";
import Collapsible from "@/components/Collapsible";
import DistributionPlot from "@/components/DistributionPlot";
import DownloadButton from "@/components/DownloadButton";
import List from "@/components/List";
import VolumeSectionSelector3D from "@/components/VolumeSectionSelector3D";
import LaminarGraph from "@/components/LaminarGraph";

import { cellGroup, defaultSelection, volumeSections } from "@/constants";
import { Layer, QuickSelectorEntry, VolumeSection } from "@/types";
import { basePath } from "@/config";

import { downloadAsJson } from "@/utils";
import withPreselection from "@/hoc/with-preselection";
import { DualNeuronWithSynapsesView } from "@/components/dual-neuron-with-synapses/DualNeuronWithSynapsesView";

const MergedConnectionsView: React.FC = () => {
  const router = useRouter();
  const { volume_section, prelayer, postlayer } = router.query as Record<
    string,
    string
  >;

  const [quickSelection, setQuickSelection] = useState<Record<string, string>>({
    volume_section,
    prelayer,
    postlayer,
  });
  const [factsheetData, setFactsheetData] = useState<any>(null);
  const [availablePlots, setAvailablePlots] = useState<Record<string, boolean>>(
    {}
  );
  const [laminarData, setLaminarData] = useState<any>(null);

  const theme = 3;

  const setParams = (params: Record<string, string>): void => {
    const query = { ...router.query, ...params };
    router.push({ query }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (
      !router.query.prelayer &&
      !router.query.volume_section &&
      !router.query.postlayer
    ) {
      const query = defaultSelection.digitalReconstruction.connectionAnatomy;
      const { volume_section, prelayer, postlayer } = query;
      setQuickSelection({ volume_section, prelayer, postlayer });
      router.replace({ query }, undefined, { shallow: true });
    } else {
      setQuickSelection({ volume_section, prelayer, postlayer });
    }
  }, [router.query]);

  const setVolumeSectionQuery = (volume_section: VolumeSection) => {
    setQuickSelection((prev) => {
      const updatedSelection = { ...prev, volume_section };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPreLayerQuery = (prelayer: Layer) => {
    setQuickSelection((prev) => {
      const updatedSelection = { ...prev, prelayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const setPostLayerQuery = (postlayer: Layer) => {
    setQuickSelection((prev) => {
      const updatedSelection = { ...prev, postlayer };
      setParams(updatedSelection);
      return updatedSelection;
    });
  };

  const qsEntries: QuickSelectorEntry[] = [
    {
      title: "Volume section",
      key: "volume_section",
      values: volumeSections,
      setFn: setVolumeSectionQuery,
    },
    {
      title: "Pre-synaptic cell group",
      key: "prelayer",
      values: cellGroup,
      setFn: setPreLayerQuery,
    },
    {
      title: "Post-synaptic cell group",
      key: "postlayer",
      values: cellGroup,
      setFn: setPostLayerQuery,
    },
  ];

  useEffect(() => {
    if (
      quickSelection.volume_section &&
      quickSelection.prelayer &&
      quickSelection.postlayer
    ) {
      fetchFactsheetData();
      fetchLaminarData();
    }
  }, [quickSelection]);

  const fetchFactsheetData = async () => {
    try {
      const { volume_section, prelayer, postlayer } = quickSelection;
      const filePath = `${basePath}/data/3_digital-reconstruction/connection-anatomy/${volume_section}/${prelayer}-${postlayer}/distribution-plots.json`;
      const response = await fetch(filePath);
      const data = await response.json();

      if (data && Array.isArray(data.values)) {
        setFactsheetData(data.values);
        updateAvailablePlots(data.values);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching factsheet:", error);
    }
  };

  const fetchLaminarData = async () => {
    try {
      const { volume_section, prelayer, postlayer } = quickSelection;
      const filePath = `${basePath}/data/3_digital-reconstruction/connection-anatomy/${volume_section}/${prelayer}-${postlayer}/Connections.json`;
      const response = await fetch(filePath);
      const data = await response.json();

      const laminarDistribution = data.values.find(
        (plot: any) => plot.id === "laminar-distribution"
      );
      setLaminarData(laminarDistribution);
    } catch (error) {
      console.error("Error fetching laminar data:", error);
    }
  };

  const updateAvailablePlots = (plots: any[]) => {
    const plotIds = [
      "bouton-density",
      "sample-convergence-by-connection",
      "sample-convergence-by-synapse",
      "sample-divergence-by-connection",
      "sample-divergence-by-synapse",
      "connection-probability-vs-inter-somatic-distance",
    ];

    const availablePlots = plotIds.reduce((acc, id) => {
      acc[id] = plots.some((plot) => plot.id === id);
      return acc;
    }, {} as Record<string, boolean>);

    setAvailablePlots(availablePlots);
  };

  const getPlotDataById = (id: string) =>
    factsheetData?.find((plot: any) => plot.id === id);

  const renderPlot = (
    id: string,
    title: string,
    xAxis: string,
    yAxis: string,
    xAxisTickStep: number
  ) => {
    if (!availablePlots[id]) return null;

    const plotData = getPlotDataById(id);
    return (
      <Collapsible title={title} id={id} className="mt-4">
        <div className="graph">
          <DistributionPlot
            plotData={plotData}
            xAxis={xAxis}
            yAxis={yAxis}
            xAxisTickStep={xAxisTickStep}
          />
        </div>
        <div className="mt-4">
          <DownloadButton
            theme={theme}
            onClick={() =>
              downloadAsJson(
                plotData,
                `${id}-${quickSelection.volume_section}-${quickSelection.prelayer}-${quickSelection.postlayer}.json`
              )
            }
          >
            <span
              style={{ textTransform: "capitalize" }}
              className="collapsible-property small"
            >
              {quickSelection.volume_section}
            </span>
            {title}
            <span className="!mr-0 collapsible-property small ">
              {quickSelection.prelayer}
            </span>{" "}
            -{" "}
            <span className="!ml-0 collapsible-property small ">
              {quickSelection.postlayer}
            </span>
          </DownloadButton>
        </div>
      </Collapsible>
    );
  };

  return (
    <>
      <Filters
        theme={theme}
        hasData={!!quickSelection.prelayer && !!quickSelection.postlayer}
      >
        <div className="flex flex-col lg:flex-row w-full lg:items-center mt-40 lg:mt-0">
          <div className="w-full lg:w-1/2 md:w-full md:flex-none mb-8 md:mb-8 lg:pr-0">
            <StickyContainer>
              <Title
                title="Connection Anatomy"
                subtitle="Digital Reconstructions"
                theme={theme}
              />
              <div role="information">
                <InfoBox>
                  <p>
                    We combined{" "}
                    <Link
                      href="/experimental-data/connection-anatomy/"
                      className={`link theme-${theme}`}
                    >
                      literature data
                    </Link>{" "}
                    and predictions on{" "}
                    <Link
                      href="/reconstruction-data/connections/"
                      className={`link theme-${theme}`}
                    >
                      uncharacterized pathways
                    </Link>{" "}
                    to reconstruct the CA1 internal connection anatomy and
                    physiology. The resulting connectome consists of 821 M
                    synapses. For each circuit, each pathway is analyzed in
                    terms of number of synapses per connection, divergence,
                    convergence, connection probability, and synaptic
                    properties.
                  </p>
                </InfoBox>
              </div>
            </StickyContainer>
          </div>

          <div
            className="flex flex-col gap-8 mb-12 md:mb-0 mx-8 md:mx-0 lg:w-1/2 md:w-full flex-grow md:flex-none justify-center"
            style={{ maxWidth: "800px" }}
          >
            <div
              className={`selector__column selector__column--lg mt-3 theme-${theme}`}
              style={{ maxWidth: "auto" }}
            >
              <div className={`selector__head theme-${theme}`}>
                1. Select a volume section
              </div>
              <div className="selector__body">
                <VolumeSectionSelector3D
                  value={quickSelection.volume_section}
                  onSelect={setVolumeSectionQuery}
                  theme={theme}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow p-0 m-0">
              <div
                className={`selector__column theme-${theme} flex-1`}
                style={{ maxWidth: "auto" }}
              >
                <div className={`selector__head theme-${theme}`}>
                  2. Select a pre-synaptic cell group
                </div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={quickSelection.prelayer}
                    title="m-type"
                    onSelect={setPreLayerQuery}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`selector__column theme-${theme} flex-1`}>
                <div className={`selector__head theme-${theme}`}>
                  3. Select a post-synaptic cell group
                </div>
                <div className="selector__body">
                  <List
                    block
                    list={cellGroup}
                    value={quickSelection.postlayer}
                    title="m-type"
                    onSelect={setPostLayerQuery}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Filters>

      <DataContainer
        visible={
          !!quickSelection.volume_section &&
          !!quickSelection.prelayer &&
          !!quickSelection.postlayer
        }
        navItems={[
          {
            id: "bouton-density",
            label: "Bouton density of the presynaptic cells",
          },
          {
            id: "sample-convergence-by-connection",
            label: "Number of synapses per connection",
          },
          {
            id: "sample-convergence-by-synapse",
            label: "Convergence (synapses)",
          },
          {
            id: "sample-divergence-by-connection",
            label: "Divergence (connections)",
          },
          {
            id: "sample-divergence-by-synapse",
            label: "Divergence (synapses)",
          },
          {
            id: "laminar-distribution-synapses",
            label: "Laminar distribution of synapses",
          },
          {
            id: "connection-probability-vs-inter-somatic-distance",
            label: "Connection probability vs inter-somatic distance",
          },
        ]}
        quickSelectorEntries={qsEntries}
      >
        <DualNeuronWithSynapsesView
          pre={quickSelection.prelayer}
          post={quickSelection.postlayer}
        />
        {renderPlot(
          "bouton-density",
          "Bouton density of the presynaptic cells",
          "Bouton density (µm⁻¹)",
          "Count",
          0.1
        )}
        {renderPlot(
          "sample-convergence-by-connection",
          "Number of synapses per connection",
          "Synapse/connection",
          "Count",
          100
        )}
        {renderPlot(
          "sample-convergence-by-synapse",
          "Convergence (synapses)",
          "Synapses",
          "Count",
          1000
        )}
        <Collapsible
          title="Laminar distribution of synapses"
          id="laminar-distribution-synapses"
        >
          <LaminarGraph
            data={laminarData}
            title="Laminar Distribution of Synapses"
            yAxisLabel="Percentage of synapses"
          />
        </Collapsible>
        {renderPlot(
          "sample-divergence-by-connection",
          "Divergence (connections)",
          "Connections",
          "Count",
          500
        )}
        {renderPlot(
          "sample-divergence-by-synapse",
          "Divergence (synapses)",
          "Synapses",
          "Count",
          2000
        )}
        {renderPlot(
          "connection-probability-vs-inter-somatic-distance",
          "Connection probability vs inter-somatic distance",
          "Inter-somatic distance (µm)",
          "Connection probability",
          100
        )}
      </DataContainer>
    </>
  );
};

export default withPreselection(MergedConnectionsView, {
  key: "volume_section",
  defaultQuery: defaultSelection.digitalReconstruction.connectionAnatomy,
});
