/// <reference path="../../typings/global.d.ts" />

import { ApplicationMainStateJSON } from "@lifter/lifter-common";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueI18n from 'vue-i18n';
import Vuex from "vuex";
import { ContextMenuService } from "../domains/context-menu/context-menu-service";

import { Application } from "./application/application";
import { render } from "./components";
import { getLocale, messages } from "./messages";
import { getStore } from "./store";

export interface UIState extends ApplicationMainStateJSON {
    selectedTabIndex: number;
    viewSettingModalPageState: boolean;
    isAutoResponderFileDropPage: boolean;
    contextMenuService: ContextMenuService;
}

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");

Vue.use(Vuex);
Vue.use(VueI18n);

let i18n = new VueI18n({
    locale: getLocale(navigator),
    messages,
});

Vue.use(Element, {
    i18n: i18n.t.bind(i18n),
});

let application = new Application();
application.load();
let store = getStore(application);

render(store, i18n);
