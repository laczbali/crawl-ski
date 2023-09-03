import { CrawlNode } from "./Models/CrawlNode.js";
import { Resort } from "./Models/Resort.js";

export interface ISiteCrawler {

    /**
     * Returns the list of regions
     * 
     * eg1: France, Austria, ...
     * 
     * eg2: North Alpes, High Tatra, ...
     */
    getRegions(): Promise<CrawlNode[]>;

    /**
     * Returns the list of resorts for a given region
     * 
     * eg: Les 2 Alpes, Les Orres, ...
     */
    getResorts(region: CrawlNode): Promise<CrawlNode[]>;

    /**
     * Returns all the resort info
     */
    getResortInfo(resort: CrawlNode): Promise<Resort>;
}
