'use strict';

/**
  Packages SVGs as ES modules for use with the inline strategy.
  Required options:
    makeAssetID

  Examples of input and output:
  Input node:
  ├── alarm.svg
  └── cat.svg

  Output node:
  inlined
  ├── alarm.js
  └── cat.js

  alarm.js can content:

  export default {
    content: '<path>', attrs: { viewBox: '' }
  }
*/
const path = require('path').posix;
const CachingWriter = require('broccoli-caching-writer');
const {
  readFile,
  svgDataFor,
  toPosixPath,
  saveToFile,
  relativePathFor,
} = require('./utils');

class InlinePacker extends CachingWriter {
  constructor(inputNode, opts) {
    super([inputNode], { name: 'InlinePacker' });
    this.options = opts;
  }

  build() {
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = path.join(toPosixPath(this.outputPath), 'inlined');
    let { makeAssetID } = this.options;

    let assetIds = [];

    this.listFiles().forEach(_filePath => {
      let filePath = toPosixPath(_filePath);
      let relativePath = relativePathFor(filePath, inputPath);
      let assetId = makeAssetID(relativePath);
      let modulePath = path.join(outputPath, `${assetId}.js`);
      let svgData = svgDataFor(readFile(filePath));

      assetIds.push(assetId);

      saveToFile(modulePath, `export default ${JSON.stringify(svgData)}`);
    });

    makeIndexFile(outputPath, assetIds);
  }
}

function makeIndexFile(outputPath, assetIds) {
  let modulePath = path.join(outputPath, `index.js`);

  let fileContent = `import { importSync } from '@embroider/macros';
  
export default {
${assetIds
  .map(
    assetId =>
      `  '${assetId}': () => importSync('ember-svg-jar/inlined/${assetId}').default`
  )
  .join(', \n')}
}`;

  saveToFile(modulePath, fileContent);
}

module.exports = InlinePacker;
