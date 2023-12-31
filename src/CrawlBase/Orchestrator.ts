import path from "path";
import { Crawler } from "./Crawler.js";
import { CsvHandler } from "./CsvHandler.js";

export class Orchestrator {

    public static async doAll(outputDir: string, ...crawlers: Crawler[]): Promise<void> {

        var currentDateTime = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        var index = 1;

        for (var crawler of crawlers) {
            console.log(`${crawler.name} - Starting (${index}/${crawlers.length})`)
            var fullOutputDir = path.join(outputDir, currentDateTime, crawler.name);

            try {
                var resorts = await crawler.doCrawl();
                await CsvHandler.dumpResorts(resorts, fullOutputDir);
            }
            catch (e) {
                console.error(`${crawler.name} - Failed to crawl: ${e}`);
            }

            console.log(`${crawler.name} - Complete`)
            index++;
        }
    }

}