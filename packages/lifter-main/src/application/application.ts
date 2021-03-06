import { injectable } from "inversify";
import {
    AutoResponderService,
    getAutoResponder,
} from "../domains/proxy/auto-responder/auto-responder-service";
import {
    ClientRequestService,
    getClientRequestService,
} from "../domains/proxy/client-request/client-request-service";
import {
    getRewriteRules,
    RewriteRuleService,
} from "../domains/proxy/rewrite-rule/rewrite-rule-service";
import { ProxyService } from "./proxy/proxy-service";
import {
    CertificateService,
    getCertificateService,
} from "./settings/certificate/certificate-service";
import {
    getProxyBypassDomains,
    ProxyBypassDomainService,
} from "./settings/proxy-bypass-domain/proxy-bypass-domain-service";
import {
    getProxyCommandGrantService,
    ProxyCommandGrantService,
} from "./settings/proxy-command-grant/proxy-command-grant-service";
import {
    getProxySettingService,
    ProxySettingService,
} from "./settings/proxy-setting/proxy-setting-service";
import {
    getUserSetting,
    UserSettingsService,
} from "./settings/user-settings/user-settings-service";

@injectable()
export class Application {
    constructor(
        private userSettingsService: UserSettingsService,
        private proxySettingService: ProxySettingService,
        private proxyService: ProxyService,
        private autoResponderService: AutoResponderService,
        private certificateService: CertificateService,
        private proxyCommandGrantService: ProxyCommandGrantService,
        private clientRequestService: ClientRequestService,
        private proxyBypassDomainService: ProxyBypassDomainService,
        private rewriteRuleService: RewriteRuleService,
    ) {}

    async startup() {
        await this.userSettingsService.isAutoEnableProxy({
            Some: () => this.proxySettingService.startup(),
            None: () => Promise.resolve(),
        });
        await this.proxyService.listen();
    }

    async shutdown(): Promise<void> {
        await this.proxySettingService.shutdown();
        await this.proxyService.shutdown();
    }

    getAutoResponder(): getAutoResponder {
        return this.autoResponderService.getAutoResponder();
    }

    getCertificateService(): getCertificateService {
        return this.certificateService.getCertificateService();
    }

    getProxyCommandGrantService(): getProxyCommandGrantService {
        return this.proxyCommandGrantService.getProxyCommandGrantService();
    }

    getClientRequestService(): getClientRequestService {
        return this.clientRequestService.getClientRequestService();
    }

    getProxyBypassDomains(): getProxyBypassDomains {
        return this.proxyBypassDomainService.getProxyBypassDomains();
    }

    getRewriteRules(): getRewriteRules {
        return this.rewriteRuleService.getRewriteRules();
    }

    getUserSetting(): getUserSetting {
        return this.userSettingsService.getUserSetting();
    }

    getProxySettingService(): getProxySettingService {
        return this.proxySettingService.getProxySettingService();
    }
}
