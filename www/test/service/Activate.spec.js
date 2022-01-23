import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import {hexlify} from "ethers/lib/utils";
import Activate from "../../src/service/Activate";

describe('Activate', () => {
    let contractFactory
    let activate

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        activate = new Activate(contractFactory)
    })

    it('should activate an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withInactiveElection(etherSigner, "Election_Name", "Election_Description")
        // When
        await activate.activate(electionAddress)
        // Then
        expect(contractFactory.directory.electionsContracts[0].isActive).to.be.true
    })
})
