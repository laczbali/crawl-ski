import { Resort } from "./CrawlBase/Models/Resort.js";
import { CrawlIgluski } from "./CrawlIgluski/CrawlIgluski.js";
import * as fs from 'fs';

// get resort data
var resorts = await new CrawlIgluski().doCrawl();

// build output csv files
const outputDir = '.\\output';
if (!fs.existsSync(outputDir)) fs.mkdir(outputDir, (err) => { if (err) console.error(err); });

var resortsAsCsvData = resorts.map(x => x.getCsvValues()).reduce((acc, curr) => {
    for (var i = 0; i < acc.length; i++) {
        acc[i].push(...curr[i]);
    }
    return acc;
})
var headerData = Resort.getCsvHeaders();

headerData.forEach((sheetInfo, sheetIndex) => {
    var headerData = sheetInfo.headers.join(';');
    var sheetData = resortsAsCsvData[sheetIndex].map(x => x.join(';')).join('\n');
    var sheet = `${headerData}\n${sheetData}`;
    fs.writeFile(`${outputDir}\\${sheetInfo.name}.csv`, sheet, (err) => { if (err) console.error(err); });
});
