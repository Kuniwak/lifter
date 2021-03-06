import { AutoResponderType } from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../test/mocks/get-test-container";
import { AutoResponderDirectoryEntity } from "../auto-responder-directory/auto-responder-directory-entity";
import { AutoResponderFileEntity } from "../auto-responder-file/auto-responder-file-entity";
import { AutoResponderGlobEntity } from "../auto-responder-glob/auto-responder-glob-entity";
import { AutoResponderFactory } from "./auto-responder-factory";

describe("AutoResponderFactory", () => {
    let autoResponderFactory: AutoResponderFactory;

    beforeEach(async () => {
        autoResponderFactory = (await getTestContainer()).get(
            AutoResponderFactory,
        );
    });

    describe("create", () => {
        [
            {
                type: "File",
                instance: AutoResponderFileEntity,
            },
            {
                type: "Directory",
                instance: AutoResponderDirectoryEntity,
            },
            {
                type: "Glob",
                instance: AutoResponderGlobEntity,
            },
        ].forEach((param: { type: AutoResponderType; instance: any }) => {
            it(param.type, () => {
                let autoResponderFileEntity = autoResponderFactory.create(
                    param.type,
                    "auto-responder-factory.spec.ts",
                    "./auto-responder-factory.spec.ts",
                );
                assert(autoResponderFileEntity instanceof param.instance);
            });
        });
    });
});
