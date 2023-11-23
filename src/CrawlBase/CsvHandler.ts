import { mkdirp } from "mkdirp";
import { Resort } from "./Models/Resort.js";
import * as fs from 'fs';

export class CsvHandler {
    public static async dumpResorts(resorts: Resort[], outputDir: string): Promise<void> {

        await mkdirp(outputDir);

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
    }
}
