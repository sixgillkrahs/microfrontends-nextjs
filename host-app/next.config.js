/** @type {import('next').NextConfig} */

const NextFederationPlugin = require("@module-federation/nextjs-mf");

const withTM = require("next-transpile-modules")(["custom-ui-antd"]);

module.exports = withTM({
  webpack(config, options) {
    const { webpack } = options;
    Object.assign(config.experiments, { topLevelAwait: true });
    if (!options.isServer) {
      //config.cache=false
      config.plugins.push(
        new NextFederationPlugin({
          name: "host",
          remotes: {
            remote: `remote@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
            audit: `audit@http://localhost:3002/_next/static/chunks/remoteEntry.js`,
          },
          exposes: {
            "./query": "./src/shared/query.ts",
          },
          filename: "static/chunks/remoteEntry.js",

          shared: {
            "@tanstack/react-query": {
              singleton: true,
              requiredVersion: false,
              eager: true,
            },
          },
        })
      );
    }

    return config;
  },
});
