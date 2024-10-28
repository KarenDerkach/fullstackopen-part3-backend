import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


export default [
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },  // Habilitar el entorno de Node.js
      ecmaVersion: 2021,  // Permitir código moderno de ES2021, incluyendo módulos y CommonJS
      sourceType: "script"  // `script` para CommonJS, puedes cambiar a "module" si necesitas ES Modules
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    ignores: ["dist"]
  }
];