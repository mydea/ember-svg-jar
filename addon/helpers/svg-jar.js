import { helper } from '@ember/component/helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';
import { deprecate } from '@ember/debug';

export function svgJar(assetId, svgAttrs) {
  deprecate(
    'The import of `svgJar` from the svg-jar helper is deprecated. You can import it from `ember-svg-jar/utils/make-svg` instead.',
    false,
    {
      id: 'ember-svg-jar.svgJar-import',
      until: '3.0.0',
      for: 'ember-svg-jar',
      since: '2.3.4',
    }
  );

  return makeSVG(assetId, svgAttrs);
}

export default helper(function svgJarHelper([assetId], svgAttrs) {
  return makeSVG(assetId, svgAttrs);
});
