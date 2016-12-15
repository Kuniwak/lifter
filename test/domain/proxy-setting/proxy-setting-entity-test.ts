import "mocha";
import {
    MockingProxySettingFile,
    RestoreProxySettingFile,
    RestoreChildProcess,
    MockingChildProcess,
    LIST_NETWORK_SERVICE_ORDER_RESULT, IFCONFIG_RESULT
} from "../../mock/exec";
import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";
import {PROXY_SETTING_COMMAND, NETWORK_SETUP_COMMAND} from "../../../src/domain/settings";

const assert = require('assert');

describe('ProxySettingEntity', () => {
    let proxySettingEntity: ProxySettingEntity;
    beforeEach(() => {
        proxySettingEntity = ProxySettingFactory.create(
            LIST_NETWORK_SERVICE_ORDER_RESULT,
            IFCONFIG_RESULT,
            <any>{uid: 0},
        );
    });
    afterEach(() => {
        RestoreProxySettingFile();
        RestoreChildProcess();
    });
    it('grantProxy', () => {
        MockingProxySettingFile(500);
        return proxySettingEntity.grantProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('enableProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -set(secure)?webproxy`))) {
                callback(undefined, '', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.enableProxy().then(() => {
            assert(true);
        });
    });
    it('enableProxy failed', () => {
        let count = 0;
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -set(secure)?webproxy`))) {
                callback(undefined, '', count++ ? '' : 'error');
                return true;
            }
            return false;
        });
        return proxySettingEntity.enableProxy().then(() => {
            assert(true);
        });
    });
    it('hasProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -get(secure)?webproxy`))) {
                callback(undefined, 'Enabled: Yes\nServer: localhost\nPort: 8888\nAuthenticated Proxy Enabled: 0\n', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('hasProxy failed', () => {
        let count = 0;
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -get(secure)?webproxy`))) {
                callback(undefined, `Enabled: ${count++ ? 'Yes' : 'No'}\nServer: localhost\nPort: 8888\nAuthenticated Proxy Enabled: 0\n`, '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(!result);
        });
    });
    it('disableProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -set(secure)?webproxystate`))) {
                callback(undefined, '', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.disableProxy().then(() => {
            assert(true);
        });
    });
});