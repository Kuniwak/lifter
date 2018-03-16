import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { ipc } from "../../lib/ipc";
import { ApplicationMainStateJSON } from "../../main/window-manager";
import { ContextMenuService } from "./context-menu/context-menu-service";
import { windowManager } from "./libs/get-window-manager";

export class Application {
    public contextMenuService: ContextMenuService;

    constructor() {
        this.contextMenuService = new ContextMenuService();
    }

    load() {
        this.contextMenuService.bind();
    }

    getCurrentState(): ApplicationMainStateJSON {
        let json = windowManager.sharedData.fetch("mainApps");
        windowManager.sharedData.set("mainApps", <any>{});
        return json;
    }

    async addDropFiles(files: File[]): Promise<AutoResponderEntityJSON[]> {
        let paths = files.map(file => (<any>file).path);
        return await ipc.publish("addAutoResponderEntities", paths);
    }

    async selectDialogEntry(fileNames: string[]): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("addAutoResponderEntities", fileNames);
    }

    async fetchAutoResponderEntities(): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("fetchAutoResponderEntities");
    }

    async deleteAutoResponderEntities(autoResponderEntities: AutoResponderEntityJSON[]): Promise<void> {
        await ipc.publish("deleteAutoResponderEntities", autoResponderEntities.map(entity => entity.id));
    }

    changeCertificateStatus(): Promise<CertificateStatus> {
        return ipc.publish("changeCertificateStatus");
    }

    changeProxySettingStatus(): Promise<ProxySettingStatus> {
        return ipc.publish("changeProxySettingStatus");
    }

    changeProxyCommandGrantStatus(): Promise<ProxyCommandGrantStatus> {
        return ipc.publish("changeProxyCommandGrantStatus");
    }

    changeNoAutoEnableProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoAutoEnableProxySetting");
    }

    changeNoPacFileProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoPacFileProxySetting");
    }

    async getProxyBypassDomains(): Promise<ProxyBypassDomainEntityJSON[]> {
        return ipc.publish("getProxyBypassDomains");
    }

    async saveProxyBypassDomains(domains: ProxyBypassDomainEntityJSON[]): Promise<void> {
        return ipc.publish("saveProxyBypassDomains", domains);
    }

    async getRewriteRules(): Promise<RewriteRuleEntityJSON[]> {
        return ipc.publish("getRewriteRules");
    }

    async saveRewriteRules(rules: RewriteRuleEntityJSON[]): Promise<void> {
        return ipc.publish("saveRewriteRules", rules);
    }

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntityJSON: ClientRequestEntityJSON) => void) {
        ipc.subscribe("addClientRequestEntity", (_, clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(clientRequestEntityJSON);
        });
    }

    setOnFileDropEvent(global: Window, dragenter: () => void, dragleave: () => void, drop: (files: File[]) => void) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragenter", dragenter);
        global.addEventListener("dragleave", event => {
            if (event.clientX && event.clientY && event.offsetX && event.offsetY) {
                return;
            }
            dragleave();
        });
        global.addEventListener("drop", event => {
            event.preventDefault();
            if (!event.dataTransfer || !event.dataTransfer.files.length) {
                dragleave();
                return;
            }
            drop(Array.from(event.dataTransfer.files));
            dragleave();
        });
    }
}
