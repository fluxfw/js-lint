#!/usr/bin/env node
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FluxShutdownHandler } from "flux-shutdown-handler/src/FluxShutdownHandler.mjs";

const flux_shutdown_handler = await FluxShutdownHandler.new();

try {
    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path!");
    }

    const eslint = new (await import("eslint")).ESLint({
        cwd: dirname(fileURLToPath(import.meta.url)),
        errorOnUnmatchedPattern: false,
        extensions: [
            ".cjs",
            ".js",
            ".json",
            ".mjs"
        ],
        globInputPaths: false,
        overrideConfig: (await import("../.eslintrc.json", { with: { type: "json" } })).default,
        useEslintrc: false
    });

    const result = (await eslint.loadFormatter()).format(await eslint.lintFiles(path));

    console.log(result);

    if (result.length > 0) {
        await flux_shutdown_handler.shutdown(
            1
        );
    }
} catch (error) {
    console.error(error);

    await flux_shutdown_handler.shutdown(
        1
    );
}
