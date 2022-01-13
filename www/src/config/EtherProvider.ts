import { ethers, Signer } from 'ethers'

declare global {
    interface Window { ethereum: any; }
}

class EtherProvider {

    private etherSigner: Signer;

    constructor() {
        let provider
        // use web3 instance, already provided by MetaMask
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        window.ethereum.on('accountsChanged', function () {
            window.location.reload()
        });
        this.etherSigner = provider.getSigner()
    }

    getSigner() {
        return this.etherSigner
    }

    getAccount() {
        return this.etherSigner.getAddress()
    }
}

export default EtherProvider
