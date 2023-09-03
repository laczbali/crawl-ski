import { Crawler } from "./CrawlBase/Crawler.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";


var resorts = await new Crawler(CrawlIgluski).doCrawl();
