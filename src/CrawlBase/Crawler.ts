import { ISiteCrawler } from "./ISiteCrawler";

export class Crawler<CrawlerType extends ISiteCrawler> {

    private crawler: ISiteCrawler;

    constructor(c: new () => CrawlerType) {
        this.crawler = new c();
    }

    public start() {
    }

}
