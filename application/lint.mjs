#!/usr/bin/env node
import { CONFIG_TYPE_STRING } from "config/src/CONFIG_TYPE.mjs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
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
        overrideConfig: (await import("./Config/.eslintrc.json", { with: { type: "json" } })).default,
        useEslintrc: false
    });

    const result = (await eslint.loadFormatter()).format(await eslint.lintFiles(await (await (await import("config/src/Config.mjs")).Config.new(
        await (await import("config/src/getValueProviders.mjs")).getValueProviders(
            true
        )
    )).getConfig(
        "path",
        CONFIG_TYPE_STRING
    )));

    console.log(result);

    if (result.length > 0) {
        await shutdown_handler.shutdown(
            1
        );
    }
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
