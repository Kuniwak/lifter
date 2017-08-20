import {ProxySettingRepository} from "../../domain/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    constructor(
        private proxySettingRepository: ProxySettingRepository,
    ) {}

    getCurrentStatus(): Promise<ProxySettingStatus> {
        let proxySettingEntity: ProxySettingEntity = this.proxySettingRepository.getProxySetting();
        return proxySettingEntity.getCurrentStatus();
    }

    getNewStatus(): Promise<ProxySettingStatus> {
        let proxySettingEntity: ProxySettingEntity = this.proxySettingRepository.getProxySetting();
        return proxySettingEntity.getNewStatus();
    }
}