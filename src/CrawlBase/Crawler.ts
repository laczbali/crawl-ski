import { ISiteCrawler } from "./ISiteCrawler.js";
import { CrawlNode } from "./Models/CrawlNode.js";
import { Resort } from "./Models/Resort.js";

export class Crawler<CrawlerType extends ISiteCrawler> {

    private crawler: ISiteCrawler;

    public onProgress: (message: string, progress: number | null) => void = this.reportProgress;

    constructor(c: new () => CrawlerType) {
        this.crawler = new c();
    }

    public async doCrawl(): Promise<Resort[]> {
        this.onProgress('Starting crawler', null);

        var regions = await this.crawler.getRegions();
        this.onProgress(`Found ${regions.length} regions`, null);

        var resortNodes: CrawlNode[] = [];
        for (var ix = 0; ix < regions.length; ix++) {
            var region = regions[ix];
            this.onProgress(`Finding resorts [${region.name}]`, (ix + 1) / regions.length);
            var regionResorts = await this.crawler.getResorts(region);
            resortNodes = resortNodes.concat(regionResorts);
        }
        this.onProgress(`Found ${resortNodes.length} resorts`, null);

        var resorts: Resort[] = [];
        for (var ix = 0; ix < resortNodes.length; ix++) {
            var resortNode = resortNodes[ix];
            this.onProgress(`Crawling resorts [${resortNode.name}]`, (ix + 1) / resortNodes.length);
            var resort = await this.crawler.getResortInfo(resortNode);
            resorts.push(resort);
        }

        this.onProgress(`Crawling complete, found ${resorts.length} resorts in ${regions.length} regions`, null);
        return resorts;
    }

    private reportProgress(message: string, progress: number | null = null) {
        var logMessage = `${message}${progress == null ? '' : `... (${(progress * 100).toFixed(0)}%)`}`;
        console.log(logMessage);
    }
}
