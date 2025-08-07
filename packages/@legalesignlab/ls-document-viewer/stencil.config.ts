import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'ls-document-viewer',
  outputTargets: [
      reactOutputTarget({
      // Relative path to where the React components will be generated
      outDir: '../ls-document-viewer-react/lib/components/stencil-generated/',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "shell",
  },
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  }
};
