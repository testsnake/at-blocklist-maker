import { AppBskyActorDefs } from "@atproto/api";
import { ListIdentifiers } from "./config.types.ts";
import { regexEscape } from "./helpers.ts";

interface options {
    identifiers: ListIdentifiers;
}

export type profile = AppBskyActorDefs.ProfileViewDetailed | AppBskyActorDefs.ProfileView;
type rule = (profile: profile) => boolean;

export default class VerificationHelper {
    private readonly rules: rule[] = [];
    private requireAllRules: boolean = false;
    // A rule requires full profile view to verify
    // Does not force a full profile view, but
    // state is accessible via fullView()
    private ruleRequiresFullView: boolean = false;

    constructor(options: options) {
        this.init(options.identifiers);
    }

    private init(id: ListIdentifiers) {
        this.requireAllRules = id.requireAll ?? false;

        // true if userProfileHashtags or userProfileDescriptionRegex are longer than 1
        this.ruleRequiresFullView =
            [...(id.userProfileHashtags ?? []), ...(id.userProfileDescriptionRegex ?? [])].length > 0;

        for (const rule of id.userHandleDomain || []) {
            const regex = new RegExp(`${regexEscape(`.${rule}`)}$`, "i");
            this.rules.push((profile) => {
                return regex.test(profile.handle);
            });
        }

        for (const rule of id.userHandleRegex || []) {
            this.rules.push((profile) => {
                return rule.test(profile.handle);
            });
        }

        for (const rule of id.userProfileHashtags || []) {
            const regex = new RegExp(`(?:^|\\s)#${regexEscape(rule)}(?:\\s|$)`, "i");
            this.rules.push((profile) => {
                return regex.test(profile.description || "");
            });
        }

        for (const rule of id.userProfileDescriptionRegex || []) {
            this.rules.push((profile) => {
                return rule.test(profile.description || "");
            });
        }

        for (const rule of id.userDisplayNameRegex || []) {
            this.rules.push((profile) => {
                return rule.test(profile.displayName || "");
            });
        }

        if (id.userMutedBySelf) {
            this.rules.push((profile) => {
                return profile.viewer?.muted === true; // Unclear why this is _not_ a string unlike the rest
            });
        }

        if (id.userMutedBylist) {
            this.rules.push((profile) => {
                return profile.viewer?.mutedByList != undefined;
            });
        }

        if (id.userBlockedBySelf) {
            this.rules.push((profile) => {
                return profile.viewer?.blocking === 'true'; // Unclear _why_ this is a string, but it is
            });
        }

        if (id.userBlockedBylist) {
            this.rules.push((profile) => {
                return profile.viewer?.blockingByList != undefined;
            });
        }

        if (id.userFollowedBySelf) {
            this.rules.push((profile) => {
                return profile.viewer?.following === 'true'; // Unclear _why_ this is a string, but it is
            })
        }

        if (id.UserFollowingSelf) {
            this.rules.push((profile) => {
                return profile.viewer?.followedBy === 'true' // Unclear _why_ this is a string, but it is
            })
        }
    }

    // Returns true if a profile requires a 'detailed' view
    // to fully verify. Does not force it to be detailed.
    public fullView() {
        return this.ruleRequiresFullView;
    }

    public matchProfile(user: profile): boolean {
        if (this.rules.length === 0) return false;

        if (this.requireAllRules) {
            // Must match all rules
            return this.rules.every((rule) => rule(user));
        } else {
            // Match any rule
            return this.rules.some((rule) => rule(user));
        }
    }
}
