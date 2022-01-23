import {expect} from 'chai'
import InMemoryContractFactory from "../InMemoryContractFactory";
import {hexlify} from "ethers/lib/utils";
import AddOptions from "../../src/service/AddOptions";
import Option from "../../src/model/Option"

describe('AddOptions', () => {
    let contractFactory
    let addOptions

    beforeEach(() => {
        contractFactory = new InMemoryContractFactory()
        addOptions = new AddOptions(contractFactory)
    })

    it('should add options to an election', async () => {
        // Given
        const etherSigner = hexlify(10)
        const electionAddress = hexlify(contractFactory.directory.elections.length)
        contractFactory.directory.withActiveElection(etherSigner, "Election_Name", "Election_Description")
        const optionsToAdd = [new Option("Option_1", "Description_1", 0), new Option("Option_2", "Description_2", 0)]
        // When
        await addOptions.addOptions(electionAddress, optionsToAdd)
        // Then
        expect(contractFactory.directory.electionsContracts[0].options).to.have.length(optionsToAdd.length)
    })
})
