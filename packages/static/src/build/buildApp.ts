import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream as NodeWebReadableStream } from "node:stream/web";
import { pathToFileURL } from "node:url";
import type { ViteBuilder } from "vite";
import { rscPayloadPath } from "./rscPath";

export async function buildApp(builder: ViteBuilder) {
  const { config } = builder;
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, "index.js");
  const entry: typeof import("../rsc/entry") = await import(
    pathToFileURL(entryPath).href
  );

  // render rsc and html
  const baseDir = config.environments.client.build.outDir;
  const { html, appRsc } = await entry.build();
  await writeFileStream(path.join(baseDir, "index.html"), html);
  await writeFileStream(
    path.join(baseDir, rscPayloadPath.replace(/^\//, "")),
    appRsc,
  );
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Readable.fromWeb(stream as NodeWebReadableStream));
}
