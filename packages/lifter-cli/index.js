const { createApplication } = require("@lifter/lifter-main");
const inquirer = require("inquirer");

let application = createApplication(`${__dirname}/repositories`, __dirname);

(async () => {
    await application.load();
    await application.startup();

    let answer = await inquirer.prompt({
        type: "list",
        name: "method",
        message: "call method",
        choices: [
            {
                name: "application.getCertificateService().fetchCurrentStatus()",
                value: application.getCertificateService().fetchCurrentStatus,
            },
            {
                name: "application.getCertificateService().changeCertificateStatus()",
                value: application.getCertificateService().changeCertificateStatus,
            },
            {
                name: "application.getNetworksetupProxyService().fetchProxyCommandGrantStatus()",
                value: application.getNetworksetupProxyService().fetchProxyCommandGrantStatus,
            },
            {
                name: "application.getNetworksetupProxyService().changeProxyCommandGrantStatus()",
                value: application.getNetworksetupProxyService().changeProxyCommandGrantStatus,
            },
            {
                name: "application.getUserSetting().getNoAutoEnableProxy()",
                value: application.getUserSetting().getNoAutoEnableProxy,
            },
            {
                name: "application.getUserSetting().changeNoPacFileProxy()",
                value: application.getUserSetting().changeNoPacFileProxy,
            },
            {
                name: "application.getUserSetting().getNoPacFileProxy()",
                value: application.getUserSetting().getNoPacFileProxy,
            },
            {
                name: "application.getUserSetting().changeNoAutoEnableProxy()",
                value: application.getUserSetting().changeNoAutoEnableProxy,
            },
            {
                name: "application.getProxySettingService().fetch()",
                value: application.getProxySettingService().fetch,
            },
            {
                name: "application.getProxySettingService().change()",
                value: application.getProxySettingService().change,
            },
        ],
    });
    let result = await answer.method();
    console.log(result);

    await application.shutdown();

    process.exit(0);
})();
