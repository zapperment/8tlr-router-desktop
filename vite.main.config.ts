import { defineConfig } from "vite";
// import { viteStaticCopy } from 'vite-plugin-static-copy'
import copy from 'rollup-plugin-copy'


// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          src: 'node_modules/@julusian/midi/prebuilds/midi-darwin-arm64/node-napi-v7.node',
          dest: '.vite/build/prebuilds/midi-darwin-arm64'
        }
      ]
    })
  ],
  build: {
    commonjsOptions: {
      ignoreDynamicRequires: true
    },
  },
});
