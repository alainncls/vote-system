import Option from "./Option";

class Election {
    private address: string;
    private owner: string;
    private name: string;
    private description: string;
    private options: Option[];

    constructor(address: string, owner: string, name: string, description: string, options: Option[]) {
        this.address = address
        this.owner = owner
        this.name = name
        this.description = description
        this.options = options
    }

    addOption(option: Option): void {
        this.options.push(option)
    }

    getOptions(): Option[] {
        return this.options
    }

    getOwner(): string {
        return this.owner
    }
}

export default Election
