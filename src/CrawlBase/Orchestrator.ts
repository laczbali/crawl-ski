import path from "path";
import { Crawler } from "./Crawler.js";
import { CsvHandler } from "./CsvHandler.js";

export class Orchestrator {

    public static async doAll(outputDir: string, ...crawlers: Crawler[]): Promise<void> {
        for (var crawler of crawlers) {

            var fullOutputDir = path.join(outputDir, crawler.name);

            var resorts = await crawler.doCrawl();
            await CsvHandler.dumpResorts(resorts, fullOutputDir);

        }
    }

}