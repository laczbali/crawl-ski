import { Resort } from "./Models/Resort";

export interface ISiteCrawler {

    /**
     * Returns the list of regions
     * 
     * eg1: France, Austria, ...
     * 
     * eg2: North Alpes, High Tatra, ...
     */
    getRegions(): Node[];

    /**
     * Returns the list of resorts for a given region
     * 
     * eg: Les 2 Alpes, Les Orres, ...
     */
    getResorts(region: Node): Node[];

    /**
     * Returns all the resort info
     */
    getResortInfo(resort: Node): Resort;
}
