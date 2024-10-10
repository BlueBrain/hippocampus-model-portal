import React from "react";
import ESData from "@/components/ESData";
import NexusPlugin from "@/components/NexusPlugin";
import { useNexusContext } from "@bbp/react-nexus";
import { morphologyDataQuery } from "@/queries/es";

export type InstanceViewerProps = {
  theme?: number;
  currentMtype: string | string[] | undefined;
  currentInstance: string | string[] | undefined;
};

const InstanceViewer: React.FC<InstanceViewerProps> = ({
  theme,
  currentMtype,
  currentInstance,
}) => {
  const nexus = useNexusContext();

  console.log("🚀 [InstanceViewer] nexus = ", nexus); // @FIXME: Remove this line written on 2024-10-04 at 15:57

  // Function to ensure we have a string value
  const ensureString = (value: string | string[] | undefined): string => {
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value) && value.length > 0) {
      return ensureString(value[0]);
    }
    return "";
  };

  // Ensure we have string values for the query
  const mtypeString = ensureString(currentMtype);
  const instanceString = ensureString(currentInstance);

  // Only render if we have valid strings for both mtype and instance
  if (!mtypeString || !instanceString) {
    return <div>Invalid mtype or instance</div>;
  }

  return (
    <ESData query={morphologyDataQuery(mtypeString, instanceString)}>
      {(esDocuments) => {
        if (!esDocuments || !esDocuments.length) return null;
        const esDocument = esDocuments[0]._source;
        return (
          <>
            <div className="neuron-viewer-container">
              <NexusPlugin
                className=""
                name="neuron-morphology"
                resource={esDocument}
                nexusClient={nexus}
              />
            </div>
            <div className="flex gap-4">{/* Buttons */}</div>
          </>
        );
      }}
    </ESData>
  );
};

export default InstanceViewer;
