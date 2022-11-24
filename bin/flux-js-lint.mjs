#!/usr/bin/env node
import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path/posix";

let shutdown_handler = null;
try {
    shutdown_handler = await (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new()
        .getShutdownHandler();

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const eslint = new ESLint({
        cwd: join(__dirname, ".."),
        errorOnUnmatchedPattern: false,
        extensions: [
            ".cjs",
            ".js",
            ".json",
            ".mjs"
        ],
        globInputPaths: false,
        overrideConfigFile: join(__dirname, "..", ".eslintrc.json"),
        useEslintrc: false
    });

    const result = (await eslint.loadFormatter()).format(await eslint.lintFiles(process.cwd()));

    console.log(result);

    if (result.length > 0) {
        await shutdown_handler.shutdown(
            1
        );
    }
} catch (error) {
    console.error(error);

    if (shutdown_handler !== null) {
        await shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
