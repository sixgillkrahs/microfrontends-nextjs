/** @type {import('next').NextConfig} */
const NextFederationPlugin = require("@module-federation/nextjs-mf");
const fs = require("fs");
const path = require("path");

function loadJsonFromFolder(folderPath) {
  const absolutePath = path.resolve(__dirname, folderPath);
  const files = fs.readdirSync(absolutePath);
  const mergedJson = {};

  files.forEach((file) => {
    const filePath = path.join(absolutePath, file);
    const jsonData = require(filePath);
    Object.assign(mergedJson, jsonData);
  });

  return mergedJson;
}

const templateJson = loadJsonFromFolder("./src/exposes");

module.exports = {
  webpack(config, options) {
    const { webpack } = options;
    Object.assign(config.experiments, { topLevelAwait: true });
    if (!options.isServer) {
      //config.cache=false
      config.plugins.push(
        new NextFederationPlugin({
          name: "remote",

          filename: "static/chunks/remoteEntry.js",
          exposes: {
            ...templateJson,
          },
          shared: {},
        })
      );
    }

    return config;
  },
};
