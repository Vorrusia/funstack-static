import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream as NodeWebReadableStream } from "node:stream/web";
import { pathToFileURL } from "node:url";
import type { ViteBuilder, MinimalPluginContextWithoutEnvironment } from "vite";
import { rscPayloadPath } from "./rscPath";
import { getModulePathFor } from "../rsc/rscModule";
import { processRscComponents } from "./rscProcessor";

export async function buildApp(
  builder: ViteBuilder,
  context: MinimalPluginContextWithoutEnvironment,
) {
  const { config } = builder;
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, "index.js");
  const entry: typeof import("../rsc/entry") = await import(
    pathToFileURL(entryPath).href
  );

  // render rsc and html
  const baseDir = config.environments.client.build.outDir;
  const { html, appRsc, deferRegistry } = await entry.build();
  await writeFileStream(path.join(baseDir, "index.html"), html, context);

  // Process RSC components with content-based hashes for deterministic file names
  const { components, appRscContent } = await processRscComponents(
    deferRegistry.loadAll(),
    appRsc,
    context,
  );

  // Write the processed RSC payload
  await writeFileNormal(
    path.join(baseDir, rscPayloadPath.replace(/^\//, "")),
    appRscContent,
    context,
  );

  // Write processed components with hash-based IDs
  for (const { finalId, finalContent } of components) {
    const filePath = path.join(
      baseDir,
      getModulePathFor(finalId).replace(/^\//, ""),
    );
    await writeFileNormal(filePath, finalContent, context);
  }
}

async function writeFileStream(
  filePath: string,
  stream: ReadableStream,
  context: MinimalPluginContextWithoutEnvironment,
) {
  await mkdir(path.dirname(filePath), { recursive: true });
  context.info(`[funstack] Writing ${filePath}`);
  await writeFile(filePath, Readable.fromWeb(stream as NodeWebReadableStream));
}

async function writeFileNormal(
  filePath: string,
  data: string,
  context: MinimalPluginContextWithoutEnvironment,
) {
  await mkdir(path.dirname(filePath), { recursive: true });
  context.info(`[funstack] Writing ${filePath}`);
  await writeFile(filePath, data);
}
