import Crawler from "./src/crawler.ts";
import config from "./config.ts";
import ListAgent from "./src/listAgent.ts";
import ListManager from "./src/listManager.ts";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({
    input,
    output,
});

(async () => {
    rl.question("Enter the phrase to search: ", async (userInput) => {
        const listAgent = await ListAgent.create();
        const list = config.lists[0];

        const listManager = new ListManager({ listAgent, listFilter: list });
        const crawler = new Crawler({ listManager });

        await crawler.crawlSearchFromPhrase(userInput);

        // Keep the process alive
        setInterval(() => {
            // This empty callback ensures the process keeps running
        }, 1000);
    });
})();
