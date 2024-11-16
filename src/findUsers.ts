import bsky from "npm:@atproto/api";
import type { ListFilter } from "./config.types.ts";

export default class FindUsers {
    private readonly agent: bsky.Agent;
    private readonly filter: ListFilter;

    constructor(agent: bsky.Agent, filter: ListFilter) {
        this.agent = agent;
        this.filter = filter;
    }

    public run() {
        this.filter?.includedUsers?.forEach(filterList => {
            
        });
    }

    




}