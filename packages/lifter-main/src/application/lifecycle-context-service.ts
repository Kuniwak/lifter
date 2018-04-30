import { AutoResponderFactory } from "../domains/proxy/auto-responder/lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "../domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ClientRequestFactory } from "../domains/proxy/client-request/lifecycle/client-request-factory";
import { ClientRequestRepository } from "../domains/proxy/client-request/lifecycle/client-request-repository";
import { LocalFileResponseFactory } from "../domains/proxy/local-file-response/lifecycle/local-file-response-factory";
import { ProjectEntity } from "../domains/proxy/project/project-entity";
import { RewriteRuleFactory } from "../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { NetworkInterfaceFactory } from "./settings/network-interface/lifecycle/network-interface-factory";
import { NetworksetupProxyFactory } from "./settings/networksetup-proxy/lifecycle/networksetup-proxy-factory";
import { ProxyBypassDomainFactory } from "./settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainRepository } from "./settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";
import { UserSettingsStorage } from "./settings/user-settings/user-settings-storage";

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public localFileResponseFactory = new LocalFileResponseFactory();
    public networkInterfaceFactory = new NetworkInterfaceFactory();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
    public networksetupProxyFactory = new NetworksetupProxyFactory();

    public autoResponderRepository: AutoResponderRepository;
    public autoResponderFactory: AutoResponderFactory;
    public proxyBypassDomainRepository: ProxyBypassDomainRepository;
    public rewriteRuleFactory: RewriteRuleFactory;
    public rewriteRuleRepository: RewriteRuleRepository;
    public userSettingsStorage: UserSettingsStorage;

    constructor(projectEntity: ProjectEntity) {
        this.autoResponderRepository = new AutoResponderRepository(projectEntity);
        this.proxyBypassDomainRepository = new ProxyBypassDomainRepository(projectEntity);
        this.autoResponderFactory = new AutoResponderFactory(projectEntity);
        this.rewriteRuleFactory = new RewriteRuleFactory(projectEntity);
        this.rewriteRuleRepository = new RewriteRuleRepository(projectEntity);
        this.userSettingsStorage = new UserSettingsStorage(projectEntity);
    }

    load() {
        return Promise.all([
            this.autoResponderRepository.load(),
            this.rewriteRuleFactory.load(),
            this.rewriteRuleRepository.load(),
            this.proxyBypassDomainRepository.load(),
            this.userSettingsStorage.load(),
            this.networksetupProxyFactory.load(),
        ]);
    }
}
