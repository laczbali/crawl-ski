import { CrawlNode } from "./Models/CrawlNode.js";
import { Resort } from "./Models/Resort.js";
import jsdom = require('jsdom');

const { JSDOM } = jsdom;

export abstract class Crawler {

    private isDebug = false;

    public onProgress: (message: string, progress: number | null) => void = this.reportProgress;

    constructor(private crawlDelayMs: number = 1000, isDebug: boolean = false) {
        this.isDebug = isDebug;
    }

    public async doCrawl(): Promise<Resort[]> {
        this.onProgress('Starting crawler', null);

        var regions = await this.getRegions();
        if (this.isDebug) regions = regions.slice(0, 1);

        this.onProgress(`Found ${regions.length} regions`, null);

        var resortNodes: CrawlNode[] = [];
        for (var ix = 0; ix < regions.length; ix++) {
            var region = regions[ix];
            this.onProgress(`Finding resorts [${region.name}]`, (ix + 1) / regions.length);

            var regionResorts = await this.getResorts(region);
            if (this.isDebug) regionResorts = regionResorts.slice(0, 2);

            await new Promise(resolve => setTimeout(resolve, this.crawlDelayMs));
            resortNodes = resortNodes.concat(regionResorts);
        }
        this.onProgress(`Found ${resortNodes.length} resorts`, null);

        var resorts: Resort[] = [];
        for (var ix = 0; ix < resortNodes.length; ix++) {
            var resortNode = resortNodes[ix];
            this.onProgress(`Crawling resorts [${resortNode.name}]`, (ix + 1) / resortNodes.length);
            var resort = await this.getResortInfo(resortNode);
            await new Promise(resolve => setTimeout(resolve, this.crawlDelayMs));
            resorts.push(resort);
        }

        this.onProgress(`Crawling complete, found ${resorts.length} resorts in ${regions.length} regions`, null);
        return resorts;
    }

    /**
     * Returns the name of the crawler, used in output and such
     */
    public abstract readonly name: string;

    /**
     * Returns the list of regions
     * - eg1: France, Austria, ...
     * - eg2: North Alpes, High Tatra, ...
     */
    protected abstract getRegions(): Promise<CrawlNode[]>;

    /**
     * Returns the list of resorts for a given region
     * - eg: Les 2 Alpes, Les Orres, ...
     */
    protected abstract getResorts(region: CrawlNode): Promise<CrawlNode[]>;

    /**
     * Returns all the resort info
     */
    protected abstract getResortInfo(resort: CrawlNode): Promise<Resort>;

    /**
     * Base url for the website, makeRequest will append the relative url to this
     */
    protected abstract baseUrl: string;

    /***
     * Makes a request relative to baseUrl, returns the resulting document
     */
    protected async makeRequest(relativeUrl: string): Promise<Document> {
        if (relativeUrl.startsWith('/')) relativeUrl = relativeUrl.substring(1);
        if (this.baseUrl.endsWith('/')) this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
        var url = `${this.baseUrl}/${relativeUrl}`;

        var response = await fetch(url);
        var responseText = await response.text();
        return new JSDOM(responseText).window.document;
    }

    private reportProgress(message: string, progress: number | null = null) {
        var logMessage = `${message}${progress == null ? '' : `... (${(progress * 100).toFixed(0)}%)`}`;
        console.log(logMessage);
    }
}
