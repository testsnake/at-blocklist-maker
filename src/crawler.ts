import ListManager from "./listManager.ts";
import { profile } from "./verificationHelper.ts";
import AtManagedAgent from "./atManagedAgent.ts";

const maxDistance = 2;
const maxLoop = 1500;

interface options {
    client?: AtManagedAgent;
    listManager: ListManager;
}

// Crawls through users via suggested, followers and following
export default class Crawler {
    static userCount: number = 0;
    private listManager: ListManager;
    private client: AtManagedAgent;
    private alreadyChecked: Set<string> = new Set<string>();

    constructor(options: options) {
        this.listManager = options.listManager;
        this.client = options.client || options.listManager.listAgent.client;
    }

    public async crawlSearchFromPhrase(starterPhrase: string) {
        const user = await this.client.agent.searchActors({q: `"${starterPhrase}"`});
        if (user.success) {
            // patient zero :)
            this.crawlLoop(user.data.actors[0])
        }

    }

    private async crawlLoop(profile: profile, loop: number = 0, distance: number = 0) {
        let currentDistance = distance + 1;
        const currentLoop = loop + 1;
        Crawler.userCount++;
        if (this.alreadyChecked.has(profile.did)) {
            return;
        }
        this.alreadyChecked.add(profile.did);

        if (this.listManager.inputUser(profile)) {
            currentDistance = 0;
        }
        if (currentDistance < maxDistance && currentLoop < maxLoop) {
            console.log(`User ${Crawler.userCount} - returned at loop ${loop} after ${distance} distance`);
            return;
        }

        const newUsers: profile[] = await this.findRelatedUsers(profile);

        newUsers.forEach((user) => {
            this.crawlLoop(user, currentLoop, distance);
        });
    }

    private async findRelatedUsers(profile: profile): Promise<profile[]> {
        const users: profile[] = [];

        // Suggested Users by Actor

        const suggested = await this.client.agent.app.bsky.graph.getSuggestedFollowsByActor({
            actor: profile.did,
        });

        if (suggested.success && !suggested.data.isFallback) {
            users.concat(suggested.data.suggestions);
        }

        users.concat(await this.crawlFollowing(profile));
        users.concat(await this.crawlFollowers(profile));

        return users;
    }

    private async crawlFollowing(profile: profile, totalLimit?: number, perPageLimit?: number): Promise<profile[]> {
        return await this.crawlProfiles(profile, totalLimit, perPageLimit, (params) =>
            this.client.agent.getFollows(params)
        );
    }

    private async crawlFollowers(profile: profile, totalLimit?: number, perPageLimit?: number): Promise<profile[]> {
        return await this.crawlProfiles(profile, totalLimit, perPageLimit, (params) =>
            this.client.agent.getFollowers(params)
        );
    }

    private async crawlProfiles(
        profile: profile,
        totalLimit: number = 200,
        perPageLimit: number = 50,
        fetchFunction: (params: {
            actor: string;
            limit: number;
            cursor?: string;
        }) => Promise<{ success: boolean; data: { cursor?: string; follows?: profile[]; followers?: profile[] } }>,
        cursor?: string,
        accumulated: profile[] = []
    ): Promise<profile[]> {
        if (accumulated.length >= totalLimit) {
            return accumulated.slice(0, totalLimit);
        }

        const response = await fetchFunction({ actor: profile.did, limit: perPageLimit, cursor: cursor });

        if (response.success) {
            const newProfiles = response.data.follows ?? response.data.followers ?? [];
            accumulated = accumulated.concat(newProfiles);

            if (!response.data.cursor || accumulated.length >= totalLimit) {
                return accumulated.slice(0, totalLimit);
            }

            return await this.crawlProfiles(
                profile,
                totalLimit,
                perPageLimit,
                fetchFunction,
                response.data.cursor,
                accumulated
            );
        } else {
            return accumulated;
        }
    }
}
