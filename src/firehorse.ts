import { Firehose } from "@atproto/sync";
import { IdResolver } from "@atproto/identity";



export default class Firehorse {
    private firehose;

    constructor() {
        const idResolver = new IdResolver();
        this.firehose = new Firehose({
            idResolver,
            service: "wss://bsky.network",
            handleEvent: async (evt) => {
                //this.log(JSON.stringify(evt));
                if (evt.event === "identity") {
                    
                } else if (evt.event === "account") {
                    
                } else if (evt.event === "create") {
                    this.log(JSON.stringify(evt));
                } else if (evt.event === "update") {
                    // ...
                } else if (evt.event === "delete") {
                    // ...
                }
            },
            onError: (err) => {
                console.error(err);
            },
            filterCollections: ["com.myexample.app"],
        });
    }


    log(str: string) {
        console.log(str);
    }

    public start() {
        this.firehose.start()
    }

    public destroy() {
        this.firehose.destroy();
    }
}
