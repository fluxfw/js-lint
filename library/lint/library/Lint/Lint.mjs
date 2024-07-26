export class Lint {
    /**
     * @returns {Promise<Lint>}
     */
    static async new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} path
     * @returns {Promise<string | null>}
     */
    async lint(path) {
        const eslint = new (await import("eslint")).ESLint({
            cwd: import.meta.dirname,
            errorOnUnmatchedPattern: false,
            extensions: [
                ".cjs",
                ".js",
                ".json",
                ".mjs"
            ],
            globInputPaths: false,
            overrideConfig: (await import("../Config/.eslintrc.json", { with: { type: "json" } })).default,
            useEslintrc: false
        });

        const result = await eslint.lintFiles(path);

        if (result.length === 0) {
            return null;
        }

        return (await eslint.loadFormatter()).format(result);
    }
}
