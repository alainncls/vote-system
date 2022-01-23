import Option from "./Option";

class Election {
    private address: string;
    private owner: string;
    private name: string;
    private description: string;
    private options: Option[];
    private isActive: boolean;

    constructor(address: string, owner: string, name: string, description: string, options: Option[], isActive: boolean) {
        this.address = address
        this.owner = owner
        this.name = name
        this.description = description
        this.options = options
        this.isActive = isActive
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

    getName(): string {
        return this.name
    }

    getDescription(): string {
        return this.description
    }
}

export default Election
