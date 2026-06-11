import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'ls-document-viewer',
  globalStyle: 'src/global/global.scss',
  plugins: [
    sass({
      injectGlobalPaths: ['src/global/_tokens.scss', 'src/global/_scrollbar.scss'],
    }),
  ],
  outputTargets: [
    reactOutputTarget({
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
};
