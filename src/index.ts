import { Crawler } from "./CrawlBase/Crawler.js";
import { Resort } from "./CrawlBase/Models/Resort.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";
import * as fs from 'fs';

// get resort data
var resorts = await new Crawler(CrawlIgluski).doCrawl();

// build output csv files
const outputDir = '.\\output';
if (!fs.existsSync(outputDir)) fs.mkdir(outputDir, (err) => { if (err) console.error(err); });

var resortCsvData = resorts.flatMap(x => x.getCsvValues());
var headerData = Resort.getCsvHeaders();

headerData.forEach((sheetInfo, sheetIndex) => {
    var headerData = sheetInfo.headers.join(';');
    var sheetData = resortCsvData[sheetIndex].map(x => x.join(';')).join('\n');
    var sheet = `${headerData}\n${sheetData}`;
    fs.writeFile(`${outputDir}\\${sheetInfo.name}.csv`, sheet, (err) => { if (err) console.error(err); });
});
