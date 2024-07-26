#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { Lint } from "@js-lint/lint/Lint/Lint.mjs";

const result = await (await Lint.new())
    .lint(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    );

if (result !== null) {
    console.log(result);

    process.exit(1);
}
