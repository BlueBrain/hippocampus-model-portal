import nodeFS from "node:fs";
import nodePath from "node:path";
import { decode } from "@msgpack/msgpack";

const [, scriptName, ...files] = process.argv;

/**
 * @returns {never}
 */
function usage() {
  console.log();
  console.log(
    `Usage:  node ${nodePath.basename(scriptName)} SLM_PPA-SO_OLM.msgpack`
  );
  console.log();
  process.exit(1);
}

if (!Array.isArray(files) || files.length === 0) usage();

function walk(obj, indent = 0) {
  if (Array.isArray(obj) || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    let val = obj[key];
    if (Array.isArray(val)) val = "[...]";
    if (typeof val !== "object") {
      console.error(`${"  ".repeat(indent)}${key}: ${val}`);
    } else {
      console.error(`${"  ".repeat(indent)}${key}:`);
      if (typeof val === "object") walk(obj[key], indent + 1);
    }
  }
}

for (const file of files) {
  try {
    if (!nodeFS.existsSync(file)) throw Error("File not found!");

    const data = nodeFS.readFileSync(file);
    const json = decode(data);
    console.error("=".repeat(file.length));
    console.error(file);
    console.error("=".repeat(file.length));
    console.log(JSON.stringify(json, null, "  "));
    console.error();
    walk(json);
  } catch (ex) {
    console.error(`Error with file ${file}:`);
    console.error(ex);
  }
}
