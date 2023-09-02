export class Node {
    name: string;
    url: string;

    constructor(name: string, url: string, children: Node[]) {
        this.name = name;
        this.url = url;
    }
}