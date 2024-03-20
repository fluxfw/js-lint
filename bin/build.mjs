#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, dirname, extname, join, relative } from "node:path";
import { cp, mkdir, symlink } from "node:fs/promises";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = await (await import("flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const dev_mode = (process.argv[2] ?? "prod") === "dev";

    const bin_folder = dirname(fileURLToPath(import.meta.url));

    const root_folder = join(bin_folder, "..");

    const node_modules_folder = join(root_folder, "node_modules");

    const build_folder = join(root_folder, "build");

    const build_root_folder = join(build_folder, "opt", basename(root_folder));

    const build_node_modules_folder = join(build_root_folder, "node_modules");

    const build_usr_local_bin_folder = join(build_folder, "usr", "local", "bin");

    const node_modules_file_filter = root_file => ([
        "42",
        "cjs",
        "js",
        "json",
        "mjs",
        "node"
    ].includes(extname(root_file).substring(1).toLowerCase()) && ![
        ".package-lock.json",
        "package-lock.json"
    ].includes(basename(root_file))) || basename(root_file).toLowerCase().includes("license");

    const bundler = await (await import("flux-build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("flux-build-utils/src/Minifier.mjs")).Minifier.new();

    if (existsSync(build_folder)) {
        throw new Error("Already built");
    }

    for (const folder of [
        build_root_folder,
        build_usr_local_bin_folder
    ]) {
        console.log(`Create folder ${folder}`);

        await mkdir(folder, {
            recursive: true
        });
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(bin_folder, "flux-js-lint.mjs"),
                join(build_root_folder, "flux-js-lint.mjs")
            ]
        ]) {
        await bundler.bundle(
            src,
            dest,
            [
                "eslint"
            ],
            async code => minifier.minifyCSS(
                code
            ),
            async code => minifier.minifyXML(
                code
            ),
            dev_mode
        );
    }

    if (!dev_mode) {
        await minifier.minifyFolder(
            build_folder
        );
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(node_modules_folder, "eslint"),
                join(build_node_modules_folder, "eslint")
            ],
            [
                join(node_modules_folder, "eslint-plugin-jsdoc"),
                join(build_node_modules_folder, "eslint-plugin-jsdoc")
            ],
            [
                join(node_modules_folder, "eslint-plugin-json"),
                join(build_node_modules_folder, "eslint-plugin-json")
            ]
        ]) {
        console.log(`Copy ${src} to ${dest}`);

        await cp(src, dest, {
            recursive: true
        });
    }

    await (await (await import("flux-build-utils/src/DeleteExcludedFiles.mjs")).DeleteExcludedFiles.new())
        .deleteExcludedFiles(
            build_node_modules_folder,
            node_modules_file_filter
        );
    await (await (await import("flux-build-utils/src/DeleteEmptyFoldersOrInvalidSymlinks.mjs")).DeleteEmptyFoldersOrInvalidSymlinks.new())
        .deleteEmptyFoldersOrInvalidSymlinks(
            build_node_modules_folder
        );

    for (const [
        src,
        dest
    ] of [
            [
                join(build_root_folder, "flux-js-lint.mjs"),
                join(build_usr_local_bin_folder, "flux-js-lint")
            ]
        ]) {
        console.log(`Create symlink ${src} to ${dest}`);

        await symlink(relative(dirname(dest), src), dest);
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
