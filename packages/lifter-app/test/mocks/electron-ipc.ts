import * as mockRequire from "mock-require";
import * as sinon from "sinon";

let sandbox = sinon.createSandbox();

mockRequire(
    "electron-ipc",
    sandbox.stub({
        subscribe: () => undefined,
        publish: () => Promise.resolve(""),
        addWindow: () => undefined,
        removeWindow: () => undefined,
    }),
);

afterEach(() => {
    sandbox.resetHistory();
});
