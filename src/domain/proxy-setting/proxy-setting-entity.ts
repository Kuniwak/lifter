import {Entity} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./proxy-setting-devices";
import {execGrantNetworkCommand, IOResult, execSuNetworkCommand} from "../../libs/execCommand";
import {PROXY_PORT} from "../settings";

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
        return Promise.all(this.devices.map((device) => {
            return execSuNetworkCommand([`-setwebproxy "${device}" localhost ${PROXY_PORT}`]);
        }));
    }

    disableProxy() {
        return Promise.all(this.devices.map((device) => {
            return execSuNetworkCommand([`-setwebproxystate "${device}" off`]);
        }));
    }
}