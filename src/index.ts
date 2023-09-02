import { Crawler } from "./CrawlBase/Crawler";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski";

var crawler = new Crawler(CrawlIgluski);
crawler.start();
