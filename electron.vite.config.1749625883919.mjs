// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
var publicDir = resolve("resources");
var envDir = resolve("build");
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    publicDir,
    envDir,
    envPrefix: "ELECTRON_",
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@store": resolve("src/renderer/src/store"),
        "@api": resolve("src/renderer/src/server/api"),
        "@assets": resolve("src/renderer/src/assets")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@assets/scssConfig.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    server: {
      open: true,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4000",
          changeOrigin: true
        }
      },
      cors: true
    }
  }
});
export {
  electron_vite_config_default as default
};
