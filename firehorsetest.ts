import Firehorse from "./src/firehorse.ts";

console.log("running");
const firehorse = new Firehorse();

setTimeout(() => {
    console.log("starting");
    firehorse.start();
    setTimeout(() => {
        firehorse.destroy();
    }, 0.5*60*1000)
}, 0.01*60*1000)
