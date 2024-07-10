#!/usr/bin/env node
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { ShutdownHandler } from "shutdown-handler/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
    const result = await (await (await import("@js-lint/lint/Lint.mjs")).Lint.new())
        .lint(
            await (await (await import("config/Config.mjs")).Config.new(
                await (await import("config/getValueProviders.mjs")).getValueProviders(
                    true
                )
            )).getConfig(
                "path",
                CONFIG_TYPE_STRING
            )
        );

    if (result !== null) {
        console.log(result);

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
