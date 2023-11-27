import { Orchestrator } from "./CrawlBase/Orchestrator.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";
import { CrawlSielok } from "./CrawlSielok/CrawlSielok.js";

// TODO
// - logging and alerting
// - csv validation

var crawlDelayMs = 1000;
var isDebugMode = process.argv[2] === 'debug';
if (isDebugMode) {
    console.log('DEBUG mode enabled');
}

await Orchestrator.doAll(
    'output',
    new CrawlIgluski(crawlDelayMs, isDebugMode),
    new CrawlSielok(crawlDelayMs, isDebugMode)
);
