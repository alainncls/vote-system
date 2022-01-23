import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import RemoveElection from "../../src/service/RemoveElection";
import {hexlify} from "ethers/lib/utils";

describe('RemoveElection', () => {
    let contractFactory
    let removeElection

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        removeElection = new RemoveElection(contractFactory)
    })

    it('should remove an election from the list', async () => {
        // Given
        const etherSigner = hexlify(10)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_1", "Election_Description_1")
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name_2", "Election_Description_2")
        // When
        await removeElection.removeElection(0)
        // Then
        expect(contractFactory.directory.elections).to.have.length(1)
    })
})
