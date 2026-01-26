import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store/store";

import { createI18n } from "vue-i18n";
import { languages } from "./assets/languages/languages.js";
const messages = Object.assign(languages);
const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./assets/style/globalVars.scss";
import "./assets/style/main.scss";
import "./assets/style/uiComponents.scss";

// Hard-disable all network primitives in the renderer.
if (typeof window !== "undefined") {
  window.fetch = function () {
    return Promise.reject(new Error("Network access is disabled."));
  };
  if (window.XMLHttpRequest) {
    window.XMLHttpRequest = function () {
      throw new Error("Network access is disabled.");
    };
  }
  if (window.WebSocket) {
    window.WebSocket = function () {
      throw new Error("Network access is disabled.");
    };
  }
  if (navigator && navigator.sendBeacon) {
    navigator.sendBeacon = function () {
      return false;
    };
  }
}


const app = createApp(App);

app.use(store);
app.use(i18n);
app.mount("#app");
