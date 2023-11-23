import { Orchestrator } from "./CrawlBase/Orchestrator.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";

await Orchestrator.doAll(
    '.\\output',
    new CrawlIgluski()
);
