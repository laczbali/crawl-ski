import { Crawler } from "../CrawlBase/Crawler.js";
import { CrawlNode } from "../CrawlBase/Models/CrawlNode.js";
import { Resort } from "../CrawlBase/Models/Resort.js";

export class CrawlSielok extends Crawler {

    public name: string = "Sielok";
    protected baseUrl: string = "https://sielok.hu/";

    protected async getRegions(): Promise<CrawlNode[]> {
        return [new CrawlNode('All', 'sitereplista/rendhohegycsokk')];
    }

    protected async getResorts(region: CrawlNode): Promise<CrawlNode[]> {
        var data = await this.makeRequest(region.url);
        var resortTable = data.querySelector('table')?.querySelector('tbody');
        var resortRows = Array.from(resortTable?.querySelectorAll('tr').values() ?? []);

        var resorts = resortRows.map(x => {
            var name = x.querySelector('td:nth-child(2)')?.textContent ?? 'N/A';
            var url = x.querySelector('td:nth-child(2) a')?.getAttribute('href') ?? '';
            return new CrawlNode(name, url);
        });

        return resorts.filter(x => x.url !== '');
    }

    protected async getResortInfo(resort: CrawlNode): Promise<Resort> {
        var resortInfo = new Resort();

        // fill basic info
        var mainPage = await this.makeRequest(resort.url);
        resortInfo.url = this.baseUrl + (resort.url.startsWith('/') ? resort.url.substring(1) : resort.url);


        return resortInfo;
    }

}