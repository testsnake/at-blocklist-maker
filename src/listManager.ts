import { ListFilter } from "./config.types.ts";
import ListAgent from "./listAgent.ts";
import VerificationHelper, { profile } from "./verificationHelper.ts";

interface options {
    listAgent: ListAgent;
    listFilter: ListFilter;
}

export default class ListManager {
    private listAgent: ListAgent;
    private listId: string;

    private includedRules: VerificationHelper[] = [];
    private excludedRules: VerificationHelper[] = [];

    constructor(options: options) {
        this.listAgent = options.listAgent;
        this.listId = options.listFilter.listId;
        this.init(options.listFilter);
    }

    private init(filter: ListFilter) {
        filter.includedUsers?.forEach((filter) => {
            this.includedRules.push(new VerificationHelper({ identifiers: filter }));
        });

        filter.excludedUsers?.forEach((filter) => {
            this.excludedRules.push(new VerificationHelper({ identifiers: filter }));
        });
    }

    private static check(rules: VerificationHelper[], profile: profile) {
        return rules.some((verify) => verify.matchProfile(profile));
    }

    inputUser(profile: profile): boolean {
        if (ListManager.check(this.excludedRules, profile)) {
            return false;
        } else if (ListManager.check(this.includedRules, profile)) {
            this.listAgent.addUserToList(profile.did, this.listId);
            console.log(`Adding user ${profile.displayName} (@${profile.handle}) to list`);
            return true;
        }
        return false;
    }
}
