import Option from "./Option";

class Election {
    private address: string;
    private owner: string;
    private name: string;
    private description: string;
    private options: Option[];

    constructor(address: string, owner: string, name: string, description: string) {
        this.address = address
        this.owner = owner
        this.name = name
        this.description = description
        this.options = []
    }

    addOption(option: Option): void {
        this.options.push(option)
    }

    getOptions(): Option[] {
        return this.options
    }
}

export default Election
