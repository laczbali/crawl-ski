import { Crawler } from "../CrawlBase/Crawler.js";
import { CrawlNode } from "../CrawlBase/Models/CrawlNode.js";
import { PriceInfo, Resort, SnowHistory } from "../CrawlBase/Models/Resort.js";

/**
 * Crawler for https://www.igluski.com/
 */
export class CrawlIgluski extends Crawler {

    public override readonly name = 'IgluSki';
    protected override baseUrl = 'https://www.igluski.com/';

    protected override async getRegions(): Promise<CrawlNode[]> {
        var data = await this.makeRequest('ski-resorts');
        var headers = Array.from(data.querySelectorAll('h3').values());

        var getRegionLinks = (headerText: string): Element[] => {
            var header = headers.find(x => x.textContent === headerText);
            return Array.from(header?.parentElement?.querySelectorAll('ul li a').values() ?? []);
        }

        var regionElems: Element[] = [];
        regionElems.push(...getRegionLinks('POPULAR COUNTRIES'));
        regionElems.push(...getRegionLinks('REST OF THE WORLD'));

        var regions = regionElems.map(x => {
            var name = x.textContent ?? 'N/A';
            var url = x.getAttribute('href') ?? '';

            return new CrawlNode(name, url);
        });

        return regions.filter(x => x.url !== '');
    }

    protected override async getResorts(region: CrawlNode): Promise<CrawlNode[]> {
        var data = await this.makeRequest(region.url);
        var headers = Array.from(data.querySelectorAll('h3').values());
        var header = headers.find(x => x.textContent?.toLowerCase().includes('resorts'));
        var parent = header?.parentElement?.parentElement;
        var resortElems = Array.from(parent?.querySelectorAll('ul li a').values() ?? []);

        var resorts = resortElems.map(x => {
            var name = x.textContent ?? 'N/A';
            var url = x.getAttribute('href') ?? '';

            return new CrawlNode(name, url);
        });

        return resorts.filter(x => x.url !== '');
    }

    protected override async getResortInfo(resort: CrawlNode): Promise<Resort> {
        var resortInfo = new Resort();

        // fill basic info
        var mainPage = await this.makeRequest(resort.url);
        resortInfo.url = this.baseUrl + (resort.url.startsWith('/') ? resort.url.substring(1) : resort.url);
        var pageTitle = mainPage.querySelector('h1')?.textContent ?? '';
        resortInfo.name = pageTitle.split(',').at(0)?.trim() ?? '';
        resortInfo.region = pageTitle.split(',').at(1)?.trim() ?? '';

        // fill slope stats
        var statsTableRows = Array.from(mainPage.querySelector('.resort-statistics__table')?.querySelectorAll('table tbody tr').values() ?? []);
        var getStatValue = (tableRows: Element[], statName: string): number => {
            var targetRow = tableRows.find(x => x.querySelector('.resort-statistics__row-title')?.textContent?.toLowerCase() === statName.toLowerCase());
            var rawValue = targetRow?.querySelector('.resort-statistics__row-value')?.textContent?.trim() ?? '';

            var numberText = rawValue.match(/\d+/)?.at(0) ?? '';
            if (numberText === '') return -1;
            return parseInt(numberText);
        }
        resortInfo.altitudeM = getStatValue(statsTableRows, 'Resort Altitude');
        resortInfo.highestLiftAltitudeM = getStatValue(statsTableRows, 'Highest Lift');
        resortInfo.slopeLengthKm = getStatValue(statsTableRows, 'Total Piste');
        resortInfo.longestRunKm = getStatValue(statsTableRows, 'Longest Run');
        resortInfo.liftCount = getStatValue(statsTableRows, 'Total Lifts');

        // fill price stats
        var priceStatHeader = Array.from(mainPage.querySelectorAll('h2').values() ?? []).find(x => x.textContent?.toLowerCase().includes('ski pass prices'));
        var priceStatTable = priceStatHeader?.nextElementSibling?.nextElementSibling?.querySelector('table') ?? null;
        if (priceStatTable !== null) {
            var headerRowCells = Array.from(priceStatTable.querySelectorAll('thead tr th').values() ?? []);
            var adultCellIndex = headerRowCells.findIndex(x => x.textContent?.toLowerCase().includes('adult'));
            if (adultCellIndex === -1) adultCellIndex = 0;

            var priceStatRows = Array.from(priceStatTable.querySelectorAll('tbody tr').values() ?? []);
            resortInfo.priceStats = priceStatRows.map(row => {
                var cells = Array.from(row.querySelectorAll('td')?.values() ?? []);
                var daysRawValue = cells.at(0)?.textContent?.trim() ?? '';
                var priceRawValue = cells.at(adultCellIndex)?.textContent?.trim() ?? '';

                var priceNumericStr = priceRawValue.match(/\d+/)?.at(0) ?? '';
                var priceCurrency = priceRawValue.match(/[^\d]+/)?.at(0) ?? '';

                var priceInfo = new PriceInfo();
                priceInfo.numberOfDays = parseInt(daysRawValue);
                priceInfo.price = priceNumericStr === '' ? -1 : parseInt(priceNumericStr);
                priceInfo.currency = priceCurrency;

                return priceInfo;
            });
        }

        // fill snow stats
        var snowStatLink = Array.from(mainPage.querySelectorAll('a').values() ?? []).find(x => x.textContent?.toLowerCase().includes('snow history'))?.getAttribute('href') ?? '';
        if (snowStatLink !== '') {
            var snowStatPage = await this.makeRequest(snowStatLink);
            var snowTable = snowStatPage.querySelector('.snow-reports__table table');

            var yearRanges = Array.from(snowTable?.querySelectorAll('thead tr th').values() ?? []).map(x => x.textContent ?? '').filter(x => x !== '');
            var months = Array.from(snowTable?.querySelectorAll('tr td:first-of-type').values() ?? []).map(x => x.textContent ?? '').filter(x => x !== '');
            var valuePairs = Array.from(snowTable?.querySelectorAll('tr td:not(:first-of-type)').values() ?? []).map(x => x.textContent ?? '').filter(x => x !== '');

            resortInfo.snowHistory = valuePairs.map((x, ix) => {
                var yearIndex = ix % yearRanges.length;
                var monthIndex = Math.floor(ix / yearRanges.length);

                if (x.trim() === '-') x = '';
                var lowDepthRaw = x.split('/').at(0)?.trim();
                var highDepthRaw = x.split('/').at(1)?.trim();
                var lowDepthNumStr = lowDepthRaw?.match(/\d+/)?.at(0) ?? '';
                var highDepthNumStr = highDepthRaw?.match(/\d+/)?.at(0) ?? '';

                var snowInfo = new SnowHistory();
                snowInfo.yearRange = yearRanges[yearIndex];
                snowInfo.month = months[monthIndex];
                snowInfo.lowSlopeSnowDepthCm = lowDepthNumStr === '' ? -1 : parseInt(lowDepthNumStr);
                snowInfo.highSlopeSnowDepthCm = highDepthNumStr === '' ? -1 : parseInt(highDepthNumStr);

                return snowInfo;
            });
        }

        return resortInfo;
    }

}
