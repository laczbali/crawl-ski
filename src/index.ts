import { Orchestrator } from "./CrawlBase/Orchestrator.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";

var crawlDelayMs = 1000;
var isDebugMode = process.argv[2] === 'debug';

await Orchestrator.doAll(
    '.\\output',
    new CrawlIgluski(crawlDelayMs, isDebugMode)
);
