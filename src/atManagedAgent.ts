import { serviceLinkToServerDeclaration } from "./helpers.ts";
import atproto from "@atproto/api";

export interface AgentOptions {
    /** Service, e.g. https://bsky.app */
    service?: string;
    /**
     * Server in Reverse DNS format, e.g app.bsky
     *
     * Default parses service value
     */
    server?: string;
    /** Identifier, usually email address */
    identifier?: string;
    password?: string;
}

/**
 * Manages agent connections
 */
export default class AtManagedAgent {
    static instances: AtManagedAgent[];
    public readonly agent;
    public readonly server;
    public readonly loginStatus;

    constructor(options: AgentOptions = {}) {
        const service = options.service || Deno.env.get("AT-SERVER") || "";
        this.agent = new atproto.AtpAgent({
            service: service,
        });
        this.server = options.server || Deno.env.get("AT-SERVER-RDNC") || serviceLinkToServerDeclaration(service) || "";
        this.loginStatus = this.login(
            options.identifier || Deno.env.get("AT-IDENTIFIER") || "",
            options.password || Deno.env.get("AT-APP-PASSWORD") || ""
        );
    }

    private async login(identifier: string, password: string) {
        // TODO: Find an easy way to do OAUTH login
        const login = await this.agent.login({
            identifier: identifier,
            password: password,
        });

        AtManagedAgent.instances.forEach((otherAgent) => {
            if (otherAgent.agent.assertDid === this.agent.assertDid) {
                console.warn(
                    "[Warning] Multiple agents are logged into the same account. Consider using a single agent with multiple lists."
                );
            }
        });
        AtManagedAgent.instances.push(this);

        return login;
    }

    /**
     * Retrives its own profile in order to prove
     * it is successfully connected to the server
     * @returns If successful
     */
    public async getStatus(): Promise<boolean> {
        try {
            const profileRes = await this.agent.getProfile({
                actor: this.agent.assertDid,
            });
            if (profileRes.success) {
                return true;
            } else {
                throw new Error("Unable to connect", {
                    cause: profileRes,
                });
            }
        } catch {
            console.error("Unable to connect instance");
            return false;
        }
    }

    /**
     * Gets an active instance
     * Should only be used if only 1 logged in account
     * is expected.
     */
    static async getInstance() {
        for (const instance of AtManagedAgent.instances) {
            if (await instance.getStatus()) {
                return instance;
            }
        }

        // No valid instance found, make new one with env vars
        const newAgent = new AtManagedAgent();
        await newAgent.loginStatus;
        if (await newAgent.getStatus()) {
            return newAgent;
        }

        throw new Error("Unable to create an agent that can connect to server");
    }
}
