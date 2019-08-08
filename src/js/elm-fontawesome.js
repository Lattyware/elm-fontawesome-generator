"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "make-promises-safe";
import "source-map-support/register";
import { exec as exec_internal } from "child_process";
import * as fs from "fs-extra";
import { promisify } from "util";
import { attributes } from "./template/attributes";
import { styles } from "./template/styles";
import * as elm from "./template/elm";
import { icons } from "./template/icons";

const version = "4.0.0";

const exec = promisify(exec_internal);

const srcElm = "src/elm/";
const dist = "dist/";
const distSrc = `${dist}src/`;

const module = (name, write) => {
  const path = ["FontAwesome", ...name];
  return {
    path,
    write: () => write(path)
  };
};

const staticModule = name =>
  module(name, async path => {
    const fileName = elm.moduleFileName(path);
    await fs.copy(`${srcElm}${fileName}`, `${distSrc}${fileName}`);
  });

const templateModule = (name, template) =>
  module(name, async path => {
    const fileName = elm.moduleFileName(path);
    const contents = await template(path);
    await fs.outputFile(`${distSrc}${fileName}`, contents);
    await exec(`elm-format src/${fileName} --yes`, { cwd: dist });
  });

const styleSuffix = prefix => `?style=${styleSuffixName(prefix)}`;

function styleSuffixName(prefix) {
  switch (prefix) {
    case "fas":
      return "solid";
    case "far":
      return "regular";
    case "fal":
      return "light";
    case "fab":
      return "brands";
    case "fad":
      return "duotone";
    default:
      throw new Error(`Unknown FontAwesome pack: "${prefix}".`);
  }
}

function iconDefinition(iconDef) {
  const [width, height, _ligatures, _unicode, dOrPaths] = iconDef.icon;
  const name = iconDef.iconName;
  const prefix = iconDef.prefix;
  const link = `${name}${styleSuffix(prefix)}`;

  const paths = typeof dOrPaths === "string" ? [dOrPaths] : dOrPaths;

  return {
    name,
    id: elm.identifier(name),
    link,
    prefix,
    width,
    height,
    paths
  };
}

const packModule = pack =>
  templateModule([pack.name], async path => {
    const imported = await import(pack.pkg);
    const iconDefs = Object.values(imported[pack.pack]);
    return icons(path, {
      name: pack.name,
      icons: iconDefs.map(iconDefinition)
    });
  });

const coreModules = {
  internal: [staticModule(["Transforms", "Internal"])],
  exported: [
    staticModule(["Icon"]),
    templateModule(["Attributes"], attributes),
    templateModule(["Styles"], styles),
    staticModule(["Layering"]),
    staticModule(["Transforms"])
  ]
};

export async function build(packs) {
  await fs.remove(dist);

  const exported = Array.from(coreModules.exported);
  exported.push(...packs.map(packModule));

  const modules = [...exported, ...coreModules.internal];

  // We need to have the elm.json in place so we can run elm-format on the modules.
  await fs.outputFile(
    `${dist}elm.json`,
    elm.packageDefinition(version, exported.map(m => m.path))
  );

  await Promise.all(modules.map(module => module.write()));
}
