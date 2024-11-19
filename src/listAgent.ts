
import bsky from "@atproto/api";
import AtManagedAgent from "./atManagedAgent.ts";

interface ListAgentOptions {
    atAgent?: AtManagedAgent;
}

/**
 * Adds users to a defined list
 */
export default class ListAgent {
    public readonly client: AtManagedAgent;

    constructor(client: AtManagedAgent) {
        this.client = client;
    }

    static async create(options: ListAgentOptions = {}) {
        const client = options.atAgent || await AtManagedAgent.getInstance();
        return new ListAgent(client);
    }

    public async addUserToList(userDID: string, list: string) {
        await this.client.loginStatus;
        const record: bsky.ComAtprotoRepoCreateRecord.InputSchema = {
            collection: `${this.client.server}.graph.listitem`,
            record: {
                $type: `${this.client.server}.graph.listitem`,
                createdAt: new Date().toISOString(),
                list: `at://${this.client.agent.did}/${this.client.server}.graph.list/${list}`,
                subject: userDID,
            },
            repo: this.client.agent.did || "",
        };
        await Deno.writeTextFile("users.log", userDID + "\n", { append: true });
        await Deno.writeTextFile("usersRequest.log", JSON.stringify(record) + "\n", { append: true });
        const res = await this.client.agent.com.atproto.repo.createRecord(record);
        await Deno.writeTextFile("usersRes.log", JSON.stringify(res) + "\n", { append: true });
        if (!res.success || res.data.validationStatus !== "valid") {
            console.error("------ Error adding user");
            console.error("------ Data");
            console.error(res.data);
            console.error("------ Headers");
            console.error(res.headers);
            console.error("------ Input");
            console.error(record);
            throw new Error("Invalid");
        }
        return res;
    }

    // TODO: get RKEY and use it to remove user from list
    // public async RemoveUserFromList(userDID: string, list: string) {
    //     await this.loginStatus;
    //     const record: bsky.ComAtprotoRepoDeleteRecord.InputSchema {

    //     }
    // }
}
