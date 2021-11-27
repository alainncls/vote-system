const Directory = artifacts.require('Directory');
const truffleAssert = require('truffle-assertions');

const FIRST_ELECTION = '0x852c7AAb5F679737c855e5340851C17e0dDcD7C2';
const SECOND_ELECTION = '0xEd277a007634f7ec775A0DD57868E8CA128D8509';

contract('Directory', function () {
    let directory;

    beforeEach('should setup the contract instance', async () => {
        directory = await Directory.new();
    });

    it('should be initialized without election', async () => {
        assert.equal(await directory.getElectionsNumber(), 0, 'At first, the directory should not contain any election');
    })

    it('should add elections and emit an event', async () => {
        let tx = await directory.addElection(FIRST_ELECTION);
        assert.equal(await directory.getElectionsNumber(), 1, 'After an election is added, the directory should contain 1 election');
        assert.equal(await directory.elections(0), FIRST_ELECTION, 'After an election is added, the directory should contain the address of this election');

        truffleAssert.eventEmitted(tx, 'ElectionAdded', (ev) => {
            return ev.electionAddress === FIRST_ELECTION;
        });

        tx = await directory.addElection(SECOND_ELECTION);
        assert.equal(await directory.getElectionsNumber(), 2, 'After a second election is added, the directory should contain 2 elections');
        assert.equal(await directory.elections(1), SECOND_ELECTION, 'After a second election is added, the directory should also contain the address of this election');

        truffleAssert.eventEmitted(tx, 'ElectionAdded', (ev) => {
            return ev.electionAddress === SECOND_ELECTION;
        });
    })

    it('should remove elections and emit an event', async () => {
        await directory.addElection(FIRST_ELECTION);
        await directory.addElection(SECOND_ELECTION);

        let tx = await directory.removeElection(0);
        assert.equal(await directory.getElectionsNumber(), 1, 'After a deletion, the directory should contain only 1 election');
        assert.equal(await directory.elections(0), SECOND_ELECTION, 'After a deletion, the directory should not contain the address of the deleted election');

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
        await directory.addElection(FIRST_ELECTION);

        await truffleAssert.reverts(directory.removeElection(1), 'Election index out of bound');
    })

})
