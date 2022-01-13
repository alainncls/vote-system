import {Signer} from "ethers";

class ContractFactory {
    private etherSigner: Signer;

    constructor(etherSigner: Signer) {
        this.etherSigner = etherSigner
    }

}

export default ContractFactory
