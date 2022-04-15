const Directory = artifacts.require('Directory');
const truffleAssert = require('truffle-assertions');

const FIRST_ELECTION_NAME = 'Election_1'
const SECOND_ELECTION_NAME = 'Election_2'
const FIRST_ELECTION_DESCRIPTION = 'Description_1'
const SECOND_ELECTION_DESCRIPTION = 'Description_2'

contract('Directory', function () {
    let directory;
    const futureDateInSecs = Math.floor(new Date().getTime() / 1000) + (24 * 3600);

    beforeEach('should setup the contract instance', async () => {
        directory = await Directory.new();
    });

    it('should be initialized without election', async () => {
        assert.equal(await directory.getElectionsNumber(), 0, 'At first, the directory should not contain any election');
    })

    it('should add elections and emit an event', async () => {
        let tx = await directory.addElection(FIRST_ELECTION_NAME, FIRST_ELECTION_DESCRIPTION, futureDateInSecs);
        assert.equal(await directory.getElectionsNumber(), 1, 'After an election is added, the directory should contain 1 election');
        assert.isNotNull(await directory.elections(0), 'After an election is added, the directory should contain the address of this election');

        truffleAssert.eventEmitted(tx, 'ElectionAdded', (ev) => {
            return ev.electionName === FIRST_ELECTION_NAME;
        });

        tx = await directory.addElection(SECOND_ELECTION_NAME, SECOND_ELECTION_DESCRIPTION, futureDateInSecs);
        assert.equal(await directory.getElectionsNumber(), 2, 'After a second election is added, the directory should contain 2 elections');
        assert.isNotNull(await directory.elections(1), 'After a second election is added, the directory should also contain the address of this election');

        truffleAssert.eventEmitted(tx, 'ElectionAdded', (ev) => {
            return ev.electionName === SECOND_ELECTION_NAME;
        });
    })

    it('should remove elections and emit an event', async () => {
        await directory.addElection(FIRST_ELECTION_NAME, FIRST_ELECTION_DESCRIPTION, futureDateInSecs);
        await directory.addElection(SECOND_ELECTION_NAME, SECOND_ELECTION_DESCRIPTION, futureDateInSecs);

        let tx = await directory.removeElection(0);
        assert.equal(await directory.getElectionsNumber(), 1, 'After a deletion, the directory should contain only 1 election');
        assert.isNotNull(await directory.elections(0), 'After a deletion, the directory should only contain the address of the remaining election');

        truffleAssert.eventEmitted(tx, 'ElectionRemoved', () => {
            return true;
        });

        tx = await directory.removeElection(0);
        assert.equal(await directory.getElectionsNumber(), 0, 'After another deletion, the directory should not contain election anymore');

        truffleAssert.eventEmitted(tx, 'ElectionRemoved', () => {
            return true;
        })
    })

    it('should fail if trying to remove a non-existing election', async () => {
        await directory.addElection(FIRST_ELECTION_NAME, FIRST_ELECTION_DESCRIPTION, futureDateInSecs);

        await truffleAssert.reverts(directory.removeElection(1), 'Election index out of bound');
    })

})
