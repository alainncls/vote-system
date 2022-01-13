class Option {
    private name: string;
    private description: string;
    private votesCount: number;

    constructor(name: string, description: string, votesCount: number) {
        this.name = name
        this.description = description
        this.votesCount = votesCount
    }
}

export default Option
