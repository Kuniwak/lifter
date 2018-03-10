import { RewriteRuleActionType, RewriteRuleModifierMapJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";
import { RewriteRuleModifierEntity } from "../rewrite-rule-modifier/rewrite-rule-modifier-entity";

export class RewriteRuleModifierMap extends BaseValueObject<{ [key in RewriteRuleActionType]: RewriteRuleModifierEntity[] }> {
    get json(): RewriteRuleModifierMapJSON {
        return Object.keys(this.value).reduce((base, cur) => {
            base[cur] = this.value[cur].map((modifier) => modifier.json);
            return base;
        }, <RewriteRuleModifierMapJSON>{})
    }

    addModifier(action: RewriteRuleActionType, modifier: RewriteRuleModifierEntity): void {
        this.value[action] = this.value[action] || [];
        this.value[action].push(modifier);
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        return this.value["UPDATE"]
            .concat(this.value["DELETE"])
            .reduce((header, modifier) => modifier.applyHeader(header), header)
            ;
    }
}
