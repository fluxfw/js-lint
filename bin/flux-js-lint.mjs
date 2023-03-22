#!/usr/bin/env node
import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    const root = join(dirname(fileURLToPath(import.meta.url)), "..");

    const eslint = new ESLint({
        cwd: root,
        errorOnUnmatchedPattern: false,
        extensions: [
            ".cjs",
            ".js",
            ".json",
            ".mjs"
        ],
        globInputPaths: false,
        overrideConfigFile: join(root, ".eslintrc.json"),
        useEslintrc: false
    });

    const result = (await eslint.loadFormatter()).format(await eslint.lintFiles(path));

    process.stdout.write(`${result}
`);

    if (result.length > 0) {
        await flux_shutdown_handler.shutdown(
            1
        );
    }
} catch (error) {
    console.error(error);

    if (flux_shutdown_handler !== null) {
        await flux_shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
