import { ISiteCrawler } from "../CrawlBase/ISiteCrawler";
import { Resort } from "../CrawlBase/Models/Resort";

/**
 * Crawler for https://www.igluski.com/ski-resorts
 */
export class CrawlIgluski implements ISiteCrawler {

    getRegions(): Node[] {
        throw new Error("Method not implemented.");
    }

    getResorts(region: Node): Node[] {
        throw new Error("Method not implemented.");
    }

    getResortInfo(resort: Node): Resort {
        throw new Error("Method not implemented.");
    }

}
