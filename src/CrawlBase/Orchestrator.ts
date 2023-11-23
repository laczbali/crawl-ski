import path from "path";
import { Crawler } from "./Crawler.js";
import { CsvHandler } from "./CsvHandler.js";

export class Orchestrator {

    public static async doAll(outputDir: string, ...crawlers: Crawler[]): Promise<void> {

        var currentDateTime = new Date().toISOString().replace(/:/g, '-').split('.')[0];

        for (var crawler of crawlers) {
            console.log(`Starting crawler - ${crawler.name}`)

            var fullOutputDir = path.join(outputDir, currentDateTime, crawler.name);

            var resorts = await crawler.doCrawl();
            await CsvHandler.dumpResorts(resorts, fullOutputDir);

            console.log(`Stopped crawler - ${crawler.name}`)
        }
    }

}