import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import {hexlify} from "ethers/lib/utils";
import RemoveOption from "../../src/service/RemoveOption";

describe('RemoveOption', () => {
    let contractFactory
    let removeOption

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        removeOption = new RemoveOption(contractFactory)
    })

    it('should remove an option from an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withElectionAndOptions(etherSigner, "Election_Name", "Election_Description")
        // When
        await removeOption.removeOption(electionAddress, 1)
        // Then
        expect(contractFactory.directory.electionsContracts[0].options).to.have.length(1)
    })
})
