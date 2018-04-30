import { Application } from "../../src/application/application";
import { LifecycleContextService } from "../../src/application/lifecycle-context-service";
import { ServiceContext } from "../../src/application/service-context";
import { SslCertificatePath } from "../../src/libs/ssl-certificate-path";
import { ProjectFactory } from "../../src/domains/proxy/project/lifecycle/project-factory";
import { ProjectEntity } from "../../src/domains/proxy/project/project-entity";
import { TEST_REPOSITORY_BASE_DIR_PATH, TEST_USER_DATA_PATH } from "../settings";

export function createProjectEntity(): ProjectEntity {
    let projectFactory = new ProjectFactory();
    return projectFactory.create(TEST_REPOSITORY_BASE_DIR_PATH);
}

export async function createLifecycleContextService(): Promise<LifecycleContextService> {
    let lifecycleContextService = new LifecycleContextService(createProjectEntity());
    await lifecycleContextService.load();
    return lifecycleContextService;
}

export class TestApplication extends Application {
    getLifecycleContextService(): LifecycleContextService {
        return this.lifecycleContextService;
    }
    getServiceContext(): ServiceContext {
        return this.serviceContext;
    }
}

export async function createApplication(): Promise<TestApplication> {
    let projectEntity = createProjectEntity();
    let sslCertificatePath = new SslCertificatePath(TEST_USER_DATA_PATH);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    let serviceContext = new ServiceContext(sslCertificatePath, lifecycleContextService);
    await serviceContext.load();
    let application = new TestApplication(lifecycleContextService, serviceContext);
    await application.load();
    return application;
}
