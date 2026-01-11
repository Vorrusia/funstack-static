import { isRunnableDevEnvironment, type Plugin } from "vite";
import { readFile } from "node:fs/promises";
import { toNodeHandler } from "srvx/node";
import path from "node:path";

export const serverPlugin = (): Plugin => {
  let resolvedOutDir = "__uninitialized__";
  return {
    name: "@funstack/static:server",
    configResolved(config) {
      resolvedOutDir = path.resolve(
        config.root,
        config.environments.client.build.outDir,
      );
    },
    configureServer(server) {
      const rscEnv = server.environments.rsc;
      if (!isRunnableDevEnvironment(rscEnv)) {
        throw new Error("The rsc environment is not runnable");
      }
      const rscInput = rscEnv.config.build.rollupOptions?.input;
      const source =
        rscInput !== undefined &&
        typeof rscInput !== "string" &&
        !Array.isArray(rscInput)
          ? rscInput.index
          : undefined;
      if (source === undefined) {
        throw new Error("Cannot determine RSC entry point");
      }

      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.headers.accept?.includes("text/html")) {
            next();
            return;
          }
          try {
            const resolved = await rscEnv.pluginContainer.resolveId(source);
            if (!resolved) {
              throw new Error(`Cannot resolve RSC entry: ${source}`);
            }
            const rscEntry = await rscEnv.runner.import<
              typeof import("./rsc/entry")
            >(resolved.id);
            const fetchHandler = toNodeHandler(rscEntry.default);

            await fetchHandler(req as any, res as any);
          } catch (error) {
            next(error);
          }
        });
      };
    },
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          try {
            if (req.headers.accept?.includes("text/html")) {
              const html = await readFile(
                path.join(resolvedOutDir, "index.html"),
                "utf-8",
              );
              res.end(html);
              return;
            }
          } catch (error) {
            next(error);
            return;
          }
          next();
        });
      };
    },
  };
};
