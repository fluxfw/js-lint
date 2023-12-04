#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { basename, dirname, extname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const mode = process.argv[2] ?? null;
    if (![
        "prod",
        "dev"
    ].includes(mode)) {
        throw new Error("Please pass prod or dev");
    }
    const dev_mode = mode === "dev";

    const bin_folder = dirname(fileURLToPath(import.meta.url));
    const root_folder = join(bin_folder, "..");
    const libs_folder = join(root_folder, "..");

    const general_file_filter = root_file => ![
        "md",
        "sh"
    ].includes(extname(root_file).substring(1).toLowerCase()) && (!root_file.startsWith("node_modules/") ? !basename(root_file).toLowerCase().includes("template") : true);

    if (!dev_mode) {
        const {
            Bundler
        } = await import("../../flux-pwa-generator/src/Bundler.mjs");
        const {
            DeleteEmptyFoldersOrInvalidSymlinks
        } = await import("../../flux-pwa-generator/src/DeleteEmptyFoldersOrInvalidSymlinks.mjs");
        const {
            DeleteExcludedFiles
        } = await import("../../flux-pwa-generator/src/DeleteExcludedFiles.mjs");
        const {
            Minifier
        } = await import("../../flux-pwa-generator/src/Minifier.mjs");

        const bin_names = [
            "flux-js-lint"
        ];

        const bundler = Bundler.new();
        for (const bin_name of bin_names) {
            const bin_path = join(bin_folder, `${bin_name}.mjs`);

            await bundler.bundle(
                bin_path,
                bin_path,
                null,
                null,
                dev_mode
            );
        }

        await DeleteExcludedFiles.new()
            .deleteExcludedFiles(
                libs_folder,
                root_file => bin_names.some(bin_name => root_file === `flux-js-lint/bin/${bin_name}.mjs`) || [
                    "node_modules/eslint/",
                    "node_modules/eslint-plugin-jsdoc/",
                    "node_modules/eslint-plugin-json/"
                ].some(_root_file => root_file.startsWith(_root_file) ? general_file_filter(
                    root_file
                ) : false)
            );

        await DeleteEmptyFoldersOrInvalidSymlinks.new()
            .deleteEmptyFoldersOrInvalidSymlinks(
                libs_folder
            );

        await Minifier.new()
            .minifFolder(
                root_folder
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
