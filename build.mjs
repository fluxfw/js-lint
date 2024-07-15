#!/usr/bin/env node
import { Bundler } from "bundler/Bundler.mjs";
import { Config } from "config/Config.mjs";
import { DeleteEmptyFoldersOrInvalidSymlinks } from "@js-lint/build/DeleteEmptyFoldersOrInvalidSymlinks.mjs";
import { DeleteExcludedFiles } from "@js-lint/build/DeleteExcludedFiles.mjs";
import { existsSync } from "node:fs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { Minifier } from "bundler/Minifier.mjs";
import { basename, dirname, extname, join, relative } from "node:path";
import { CONFIG_TYPE_BOOLEAN, CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { cp, mkdir, rm, symlink } from "node:fs/promises";

const config = await Config.new(
    await getValueProviders(
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

const bundler = await Bundler.new();
const minifier = await Minifier.new();

if (existsSync(build_folder)) {
    throw new Error("Already built!");
}

for (const [
    src,
    dest
] of [
        [
            "./application/lint.mjs",
            join(build_lib_folder, "lint.mjs")
        ]
    ]) {
    await bundler.bundle(
        src,
        dest,
        async path => [
            "eslint"
        ].some(exclude_module => exclude_module === path || path.startsWith(`${exclude_module}/`)) ? false : null,
        minify,
        async code => minifier.minifyESMJavaScript(
            code
        ),
        null,
        null,
        null,
        null,
        null,
        dev
    );
}

for (const [
    src,
    dest
] of [
        [
            join(dirname(await bundler.resolve(
                "eslint"
            )), "..", ".."),
            join(build_node_modules_folder)
        ]
    ]) {
    console.log(`Copy ${src} to ${dest}`);

    await cp(src, dest, {
        recursive: true
    });
}

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

for (const src of [
    join(build_node_modules_folder, "@js-lint"),
    join(build_node_modules_folder, "bundler"),
    join(build_node_modules_folder, "config"),
    join(build_node_modules_folder, "uglify-js")
]) {
    if (!existsSync(src)) {
        continue;
    }

    console.log(`Delete ${src}`);

    await rm(src, {
        recursive: true
    });
}

await (await DeleteExcludedFiles.new())
    .deleteExcludedFiles(
        build_node_modules_folder,
        root_file => ([
            "cjs",
            "js",
            "json",
            "mjs"
        ].includes(extname(root_file).substring(1).toLowerCase()) && ![
            ".package-lock.json",
            "package-lock.json"
        ].includes(basename(root_file))) || basename(root_file).toLowerCase().includes("license")
    );
await (await DeleteEmptyFoldersOrInvalidSymlinks.new())
    .deleteEmptyFoldersOrInvalidSymlinks(
        build_node_modules_folder
    );
