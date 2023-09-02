import { ISiteCrawler } from "../CrawlBase/ISiteCrawler";
import { Resort } from "../CrawlBase/Models/Resort";

/**
 * Crawler for https://www.igluski.com/
 */
export class CrawlIgluski implements ISiteCrawler {

    private readonly baseUrl = 'https://www.igluski.com/';

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
