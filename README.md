# at-list-manager

Tool is WIP
<!-- 
Deno tool to automatically add users to a list on Bluesky.
## Setup

Clone this repository

install [Deno](https://deno.com/) if you haven't already

Fill out the `config.ts` and `.env` files 

All possible config options can be found in `./src/config.schema.ts`

`config.ts`
```ts
import type { userConfigInterface } from "./src/config.schema.ts";

const config: userConfigInterface = {
    lists: [
        {
            // Blocklist
            listId: "2",
            blockedUsers: [
                {
                    userHandleDomain: ["example.com"],
                    userProfileHashtags: ["ILoveBeingRudeToUsers"],
                },
            ],
            excludedUsers: [
                {
                    userDisplayNameRegex: [/[\s\[\]\(\)]*\bparody\b[\s\[\]\(\)]*/i],
                },
            ],
        },
    ],
};

export default config;
```
`.env`
```env
AT-SERVER="https://bluesky.app"
AT-SERVER-RDNC="app.bluesky"
AT-IDENTIFIER="user@example.com"
AT-APP-PASSWORD="xxxx-xxxx-xxxx-xxxx"
```

Run `deno main.ts` in a terminal
```fish
deno main.ts
```
-->