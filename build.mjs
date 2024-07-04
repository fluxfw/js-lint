#!/usr/bin/env node
import { existsSync } from "node:fs";
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";
import { basename, dirname, extname, join, relative } from "node:path";
import { CONFIG_TYPE_BOOLEAN, CONFIG_TYPE_STRING } from "config/src/CONFIG_TYPE.mjs";
import { cp, mkdir, symlink } from "node:fs/promises";

const shutdown_handler = await ShutdownHandler.new();

try {
    const config = await (await import("config/src/Config.mjs")).Config.new(
        await (await import("config/src/getValueProviders.mjs")).getValueProviders(
            true
        )
    );

    const dev = await config.getConfig(
        "dev",
        CONFIG_TYPE_BOOLEAN,
        false
    );
    const minify = await config.getConfig(
        "minify",
        CONFIG_TYPE_BOOLEAN,
        !dev
    );

    const application_folder = join(import.meta.dirname, "application");
    const node_modules_folder = join(import.meta.dirname, "node_modules");

    const application_id = await config.getConfig(
        "application-id",
        CONFIG_TYPE_STRING,
        async () => `${basename(import.meta.dirname)}${dev ? "-dev" : ""}`
    );

    const build_folder = await config.getConfig(
        "folder",
        CONFIG_TYPE_STRING,
        async () => join(import.meta.dirname, "build")
    );
    const build_usr_folder = join(build_folder, "usr", "local");
    const build_bin_folder = join(build_usr_folder, "bin");
    const build_lib_folder = join(build_usr_folder, "lib", application_id);
    const build_node_modules_folder = join(build_lib_folder, "node_modules");

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    const bundler = await (await import("build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("build-utils/src/Minifier.mjs")).Minifier.new();
    for (const [
        src,
        dest
    ] of [
            [
                join(application_folder, "lint.mjs"),
                join(build_lib_folder, "lint.mjs")
            ]
        ]) {
        await bundler.bundle(
            src,
            dest,
            async path => [
                "eslint"
            ].some(exclude_module => exclude_module === path || path.startsWith(`${exclude_module}/`)) ? false : null,
            null,
            null,
            null,
            null,
            dev
        );
    }

    if (minify) {
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

    await (await (await import("./application/Build/DeleteExcludedFiles.mjs")).DeleteExcludedFiles.new())
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
    await (await (await import("./application/Build/DeleteEmptyFoldersOrInvalidSymlinks.mjs")).DeleteEmptyFoldersOrInvalidSymlinks.new())
        .deleteEmptyFoldersOrInvalidSymlinks(
            build_node_modules_folder
        );

    for (const [
        src,
        dest
    ] of [
            [
                join(build_lib_folder, "lint.mjs"),
                join(build_bin_folder, application_id)
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

    await shutdown_handler.shutdown(
        1
    );
}
