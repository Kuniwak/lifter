import {Entity} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./proxy-setting-devices";
import {execGrantNetworkCommand, IOResult, execSuNetworkCommand, execNetworkCommand} from "../../libs/exec-command";
import {PROXY_PORT, NETWORK_HOST_NAME} from "../settings";

export class ProxySettingEntity extends Entity<ProxySettingIdentity> {
    constructor(
        identity: ProxySettingIdentity,
        private _devices: ProxySettingDevices,
        public isGranted: boolean,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get devices() {
        return this._devices.value;
    }

    grantProxy() {
        return execGrantNetworkCommand().then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                throw new Error(stderr);
            }
            return true;
        })
    }

    enableProxy() {
        return Promise.all([
            this.execAllDevices((device) => execSuNetworkCommand([`-setwebproxy "${device}" ${NETWORK_HOST_NAME} ${PROXY_PORT}`])),
            this.execAllDevices((device) => execSuNetworkCommand([`-setsecurewebproxy "${device}" ${NETWORK_HOST_NAME} ${PROXY_PORT}`])),
        ]).then((results: boolean[]) => {
            return results.find((result) => !result) === undefined;
        });
    }

    hasProxy() {
        return Promise.all(this.devices.map((device) => {
            return Promise.all([
                execNetworkCommand([`-getwebproxy "${device}"`]),
                execNetworkCommand([`-getsecurewebproxy "${device}"`]),
            ]).then((results: IOResult[]) => {
                return undefined === results.find(({stdout, stderr}: IOResult) => {
                    let result: any = stdout.split(/\r?\n/).reduce((base: any, cur: string) => {
                        let [key, val] = cur.split(/\s*:\s*/);
                        base[key.toLowerCase()] = val;
                        return base;
                    }, {});
                    if (result['enabled'] !== 'Yes') {
                        return true;
                    }
                    if (result['server'] !== NETWORK_HOST_NAME) {
                        return true;
                    }
                    if (result['port'] !== String(PROXY_PORT)) {
                        return true;
                    }
                    return false;
                });
            });
        })).then((results) => {
            return results.find((result) => !result) === undefined;
        });
    }

    disableProxy() {
        return Promise.all([
            this.execAllDevices((device) => execSuNetworkCommand([`-setwebproxystate "${device}" off`])),
            this.execAllDevices((device) => execSuNetworkCommand([`-setsecurewebproxystate "${device}" off`])),
        ]).then((results: boolean[]) => {
            return results.find((result) => !result) === undefined;
        });
    }

    private execAllDevices(exec: (device: string) => Promise<IOResult>) {
        return Promise.all(this.devices.map(exec)).then((results: IOResult[]) => {
            return !results.filter((result) => result.stdout || result.stderr).length;
        });
    }
}