#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { FluxShutdownHandler } from "flux-shutdown-handler/src/FluxShutdownHandler.mjs";
import { basename, dirname, extname, join, relative } from "node:path";
import { cp, mkdir, symlink } from "node:fs/promises";

const flux_shutdown_handler = await FluxShutdownHandler.new();

try {
    const dev = (process.argv[2] ?? "prod") === "dev";

    const src_bin_folder = dirname(fileURLToPath(import.meta.url));
    const src_root_folder = join(src_bin_folder, "..");
    const src_node_modules_folder = join(src_root_folder, "node_modules");

    const build_folder = join(src_root_folder, "build");
    const build_usr_folder = join(build_folder, "usr", "local");
    const build_bin_folder = join(build_usr_folder, "bin");
    const build_lib_folder = join(build_usr_folder, "lib", basename(src_root_folder));
    const build_node_modules_folder = join(build_lib_folder, "node_modules");

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    const bundler = await (await import("flux-build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("flux-build-utils/src/Minifier.mjs")).Minifier.new();
    for (const [
        src,
        dest
    ] of [
            [
                join(src_bin_folder, "flux-js-lint.mjs"),
                join(build_lib_folder, "flux-js-lint.mjs")
            ]
        ]) {
        await bundler.bundle(
            src,
            dest,
            async path => [
                "eslint"
            ].some(exclude_module => exclude_module === path || path.startsWith(`${exclude_module}/`)) ? false : null,
            async code => minifier.minifyCSS(
                code
            ),
            async code => minifier.minifyXML(
                code
            ),
            dev
        );
    }

    if (!dev) {
        await minifier.minifyFolder(
            build_folder
        );
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(src_node_modules_folder, "eslint"),
                join(build_node_modules_folder, "eslint")
            ],
            [
                join(src_node_modules_folder, "eslint-plugin-jsdoc"),
                join(build_node_modules_folder, "eslint-plugin-jsdoc")
            ],
            [
                join(src_node_modules_folder, "eslint-plugin-json"),
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
            root_file => ([
                "42",
                "cjs",
                "js",
                "json",
                "mjs",
                "node"
            ].includes(extname(root_file).substring(1).toLowerCase()) && ![
                ".package-lock.json",
                "package-lock.json"
            ].includes(basename(root_file))) || basename(root_file).toLowerCase().includes("license")
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
                join(build_lib_folder, "flux-js-lint.mjs"),
                join(build_bin_folder, "flux-js-lint")
            ]
        ]) {
        console.log(`Create symlink ${src} to ${dest}`);

        const dest_folder = dirname(dest);

        await mkdir(dest_folder, {
            recursive: true
        });

        await symlink(relative(dest_folder, src), dest);
    }
} catch (error) {
    console.error(error);

    await flux_shutdown_handler.shutdown(
        1
    );
}
