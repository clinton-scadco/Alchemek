import * as esbuild from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";

import * as path from "path";

const __dirname = path.dirname("./");

let [envArg] = process.argv
    .filter((x, i) => i > 1)
    .map((x) => /--mode=(\w+)/.exec(x))
    .filter((x) => x)
    .map((x) => x[1]);

let [watchArgs] = process.argv
    .filter((x, i) => i > 1)
    .map((x) => /--watch=(\w+)/.exec(x))
    .filter((x) => x)
    .map((x) => x[1]);

let watch = watchArgs === "true";

let env = envArg || process.env.NODE_ENV || "production";

const ENVIRONMENTS = {
    development: {},
    production: {},
};

import * as servor from "servor";

if (watch) {
    servor.default({
        root: "www",
        module: false,
        static: false,
        reload: false,
        inject: "",
        credentials: null,
        port: 15050,
    });
}

const context = await esbuild.context({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outdir: "www/js",
    plugins: [
        sassPlugin({
            type: "style",
            loadPaths: [path.resolve(__dirname, "node_modules")],
        }),
    ],
    sourcemap: true,
    define: ENVIRONMENTS[env],
    legalComments: "linked",
});

await context.rebuild();

if (watch) {
    await context.watch();
} else {
    await context.dispose();
}
