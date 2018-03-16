import * as Ipc from "./ipc";

export const ipc = Ipc.ipc;

export interface ElectronIpcMap extends Ipc.ElectronIpcMap {}

export const APPLICATION_NAME = "Lifter Proxy";

export type CertificateStatus = "missing" | "installed";

export type ProxySettingStatus = "On" | "Off";

export type ProxyCommandGrantStatus = "On" | "Off";

export type RewriteRuleActionType = "UPDATE" | "DELETE";

export type AutoResponderType = "File" | "Directory" | "Glob";

export interface AutoResponderEntityJSON {
    id: number;
    type: AutoResponderType;
    pattern: string;
    path: string;
    projectId: number;
}

export interface ClientRequestEntityJSON {
    id: number;
    href: string;
}

export interface ProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}

export interface RewriteRuleModifierEntityJSON {
    id: number;
    header: string;
}

export interface RewriteRuleUpdateModifierEntityJSON extends RewriteRuleModifierEntityJSON {
    value: string;
}

export interface RewriteRuleDeleteModifierEntityJSON extends RewriteRuleModifierEntityJSON {}

export interface CreateRewriteRuleModifierEntityJSON {
    header: string;
}

export interface CreateRewriteRuleUpdateModifierEntityJSON extends CreateRewriteRuleModifierEntityJSON {
    value: string;
}

export interface CreateRewriteRuleDeleteModifierEntityJSON extends CreateRewriteRuleModifierEntityJSON {}

export type RewriteRuleModifierMapJSON = {
    "UPDATE": RewriteRuleUpdateModifierEntityJSON[];
    "DELETE": RewriteRuleDeleteModifierEntityJSON[];
};

export interface RewriteRuleEntityJSON {
    id: number;
    url: string;
    modifier: RewriteRuleModifierMapJSON;
}
