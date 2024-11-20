import { saveAs } from "file-saver";

import { nexus, hippocampus } from "../config";

interface ParsedNexusUrl {
  deployment: string;
  entityType: string;
  org: string;
  project: string;
  schema: string;
  id: string;
}

const nexusEntities = [
  "orgs",
  "projects",
  "acls",
  "views",
  "resources",
  "files",
];

const nexusUrlR = new RegExp(
  [
    "^",
    "(https?://.+)", // nexus deployment
    "/",
    `(${nexusEntities.join("|")})`, // entity type
    "/",
    "([^/]+)", // org
    "/",
    "([^/]+)", // proj
    "/?",
    "([^/]+)?", // schema [optional]
    "/?",
    "([^/]+)?", // id [optional]
    "/?",
    "$",
  ].join("")
);

/**
 * @author pgetta
 * With given Nexus URL (might be self/project/id url), return it's:
 * * deployment URL
 * * entity type
 * * org label
 * * project label
 * * id
 *
 * @param nexusUrl
 */
export const parseUrl = (nexusUrl: string): ParsedNexusUrl => {
  if (!nexusUrl) throw new Error("selfUrl should be defined");

  const mulEntityTypeR = new RegExp(`(${nexusEntities.join("|")})`, "g");
  const mulEntityTypeMatch = nexusUrl.match(mulEntityTypeR);
  if (mulEntityTypeMatch && mulEntityTypeMatch.length > 1) {
    throw new Error(
      "Url contains multiple entity types which is not supported"
    );
  }

  const matches = nexusUrl.match(nexusUrlR);
  if (!matches || matches.length <= 5) {
    throw new Error("Error while parsing selfUrl");
  }

  return {
    deployment: matches[1],
    entityType: matches[2].slice(0, -1),
    org: matches[3],
    project: matches[4],
    schema: matches[5],
    id: matches[6],
  };
};

type composeNexusUrlArg = {
  id: string;
  type: "resource" | "file";
  org?: string;
  project?: string;
};

export const composeNexusUrl: (composeNexusUrlArg) => string = ({
  id,
  type = "file",
  org = hippocampus.org,
  project = hippocampus.project,
}) => {
  if (!id) {
    throw new Error("id should be defined");
  }

  return `${nexus.url}/${type}s/${org}/${project}/${encodeURIComponent(id)}`;
};

export function downloadAsJson(data, name) {
  const dataBlob = new Blob([JSON.stringify(data)]);
  saveAs(dataBlob, name);
}

export function downloadFile(url: string, fileName: string) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => console.error("Error downloading file:", error));
}

export function entryToArray(entry) {
  if (!entry) return [];

  return Array.isArray(entry) ? entry : [entry];
}

export function getCompareByFn(compareProp) {
  return (obj1, obj2) => (obj1[compareProp] > obj2[compareProp] ? 1 : -1);
}

export function classNames(...classes: unknown[]): string {
  return classes.filter((name) => typeof name === "string").join(" ");
}
