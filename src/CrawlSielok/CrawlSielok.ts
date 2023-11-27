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

        var mainPage = await this.makeRequest(resort.url);
        var mainDiv = mainPage.querySelector('.terepOldalOutWrap') as Element;

        // fill basic info
        resortInfo.name = mainDiv.querySelector('.siterepH1NamePart .siterepH1Label')?.textContent ?? '';
        resortInfo.url = this.baseUrl + (resort.url.startsWith('/') ? resort.url.substring(1) : resort.url);
        resortInfo.region = Array.from(mainDiv.querySelectorAll('#navbar .navbarItem a').values() ?? []).at(2)?.textContent ?? '';

        // fill slope stats
        var statRows = Array.from(mainDiv.querySelectorAll('.terepOldalDataPart .tedatable tbody tr').values() ?? []);
        var getStatVal = (tableRows: Element[], statName: string): number => {
            var row = tableRows.find(x => x.querySelector('td:nth-child(1)')?.textContent === statName);
            var value = row?.querySelector('td:nth-child(2)')?.textContent ?? '';
            if (value === '') return -1;

            var numberValue = value.match(/\d+/g)?.at(-1) ?? '';
            if (numberValue === '') return -1;
            return parseInt(numberValue);
        }

        resortInfo.altitudeM = getStatVal(statRows, 'Magasság');
        resortInfo.slopeLengthKm = getStatVal(statRows, 'Sípályák hossza');
        resortInfo.liftCount = getStatVal(statRows, 'Liftek száma');

        // fill snow stats
        var snowUrl = resort.url.replace('siterep', 'holap');
        var snowPage = await this.makeRequest(snowUrl);
        var snowMainDiv = snowPage.querySelector('.hlWrap1') as Element;
        var snowStatTables = Array.from(snowMainDiv.querySelectorAll('div .holBox1').values() ?? []);
        var snowStatRows = snowStatTables.flatMap(x => Array.from(x.querySelectorAll('.holRow').values() ?? []));
        var getSnowStatVal = (tableRows: Element[], statName: string): string => {
            var row = tableRows.find(x => x.querySelector('.holCol1')?.textContent?.includes(statName));
            return row?.querySelector('.holCol2')?.textContent?.trim() ?? '';
        }

        var lastSnowFallRaw = getSnowStatVal(snowStatRows, 'Utolsó havazás');
        if (lastSnowFallRaw !== '')
            resortInfo.snowActual.lastSnowfallDate = new Date(lastSnowFallRaw);

        var snowDepthTopRaw = getSnowStatVal(snowStatRows, 'Hó a hegyen');
        var snowDepthTopStr = snowDepthTopRaw.match(/\d+/)?.at(0) ?? '';
        if (snowDepthTopStr !== '')
            resortInfo.snowActual.snowDepthTopCm = parseInt(snowDepthTopStr);

        var snowDepthBottomRaw = getSnowStatVal(snowStatRows, 'Hó a völgyben');
        var snowDepthBottomStr = snowDepthBottomRaw.match(/\d+/)?.at(0) ?? '';
        if (snowDepthBottomStr !== '')
            resortInfo.snowActual.snowDepthBottomCm = parseInt(snowDepthBottomStr);

        var openLiftsRaw = getSnowStatVal(snowStatRows, 'Üzemelő liftek száma');
        var openLiftsStr = openLiftsRaw.match(/\d+/)?.at(0) ?? '';
        if (openLiftsStr !== '')
            resortInfo.snowActual.openLiftCount = parseInt(openLiftsStr);

        var openSlopesRaw = getSnowStatVal(snowStatRows, 'Üzemelő pályák hossza');
        var openSlopesStr = openSlopesRaw.match(/\d+/)?.at(0) ?? '';
        if (openSlopesStr !== '')
            resortInfo.snowActual.openSlopeKm = parseInt(openSlopesStr);

        return resortInfo;
    }

}