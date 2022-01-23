import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import {hexlify} from "ethers/lib/utils";
import Deactivate from "../../src/service/Deactivate";

describe('Deactivate', () => {
    let contractFactory
    let deactivate

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        deactivate = new Deactivate(contractFactory)
    })

    it('should deactivate an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name", "Election_Description")
        // When
        await deactivate.deactivate(electionAddress)
        // Then
        expect(contractFactory.directory.electionsContracts[0].isActive).to.be.false
    })
})
