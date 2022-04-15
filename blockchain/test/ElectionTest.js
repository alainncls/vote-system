const Election = artifacts.require('Election');
const truffleAssert = require('truffle-assertions');

contract('Election', function (accounts) {
    const [firstAccount, secondAccount] = accounts;
    let election;
    const futureDateInSecs = Math.floor(new Date().getTime() / 1000) + (24 * 3600);
    const pastDateInSecs = Math.floor(new Date().getTime() / 1000) - (24 * 3600);

    beforeEach('should setup the contract instance', async () => {
        election = await Election.new(firstAccount, 'ElectionService name', 'ElectionService description', futureDateInSecs);
    });

    it('should initialize the empty election', async () => {
        assert.equal(await election.owner(), firstAccount, 'ElectionService owner should be its deployer');
        assert.equal(await election.name(), 'ElectionService name', 'ElectionService name should be saved');
        assert.equal(await election.description(), 'ElectionService description', 'ElectionService description should be saved');
        assert.equal(await election.endDate(), futureDateInSecs, 'Election end date" should be saved');
        assert.equal(await election.getVotersNumber(), 0, 'At first, the election should not contain any voter');
        assert.equal(await election.isActive(), true, 'ElectionService should be active');
        assert.equal(await election.getOptionsNumber(), 0, 'At first, the election should not contain any option');
    })

    it('should add options and emit en event', async () => {
        let tx = await election.addOption('Option 1', 'Description 1');
        assert.equal(await election.getOptionsNumber(), 1, 'After an option is added, the election should contain 1 option');
        const option1 = await election.options(0);
        assert.equal(option1.name, 'Option 1', 'After an option is added, the election should contain this option\'s name');
        assert.equal(option1.description, 'Description 1', 'After an option is added, the election should contain this option\'s description');
        assert.equal(option1.votesCount, 0, 'After an option is added, the election should contain this option\'s votes number');

        truffleAssert.eventEmitted(tx, 'OptionAdded', (ev) => {
            return ev.electionAddress === election.address && ev.electionName === 'ElectionService name' && ev.optionName === 'Option 1';
        });

        tx = await election.addOption('Option 2', 'Description 2');
        assert.equal(await election.getOptionsNumber(), 2, 'After a second option is added, the election should contain 2 options');
        const option2 = await election.options(1);
        assert.equal(option2.name, 'Option 2', 'After an option is added, the election should contain this option\'s name');
        assert.equal(option2.description, 'Description 2', 'After an option is added, the election should contain this option\'s description');
        assert.equal(option2.votesCount, 0, 'After an option is added, the election should contain this option\'s votes number');

        truffleAssert.eventEmitted(tx, 'OptionAdded', (ev) => {
            return ev.electionAddress === election.address && ev.electionName === 'ElectionService name' && ev.optionName === 'Option 2';
        });
    })

    it('should remove options and emit an event', async () => {
        await election.addOption('Option 1', 'Description 1');
        await election.addOption('Option 2', 'Description 2');

        let tx = await election.removeOption(0);
        assert.equal(await election.getOptionsNumber(), 1, 'After a deletion, the election should contain only 1 option');
        const optionLeft = await election.options(0);
        assert.equal(optionLeft.name, 'Option 2', 'After an option is added, the election should contain this option\'s name');
        assert.equal(optionLeft.description, 'Description 2', 'After an option is added, the election should contain this option\'s description');
        assert.equal(optionLeft.votesCount, 0, 'After an option is added, the election should contain this option\'s votes number');

        truffleAssert.eventEmitted(tx, 'OptionRemoved', (ev) => {
            return ev.electionAddress === election.address && ev.electionName === 'ElectionService name';
        });

        tx = await election.removeOption(0);
        assert.equal(await election.getOptionsNumber(), 0, 'After another deletion, the election should not contain option anymore');

        truffleAssert.eventEmitted(tx, 'OptionRemoved', (ev) => {
            return ev.electionAddress === election.address && ev.electionName === 'ElectionService name';
        });
    })

    it('should cast vote and emit an event', async () => {
        await election.addOption('Option 1', 'Description 1');
        await election.addOption('Option 2', 'Description 2');

        const tx = await election.castVote(1);
        const option1 = await election.options(0);
        assert.equal(option1.votesCount, 0, 'After a vote is casted on option 2, option 1 should still have a votes count of 0');
        const option2 = await election.options(1);
        assert.equal(option2.votesCount, 1, 'After a vote is casted on option 2, it should have a votes count of 1');

        truffleAssert.eventEmitted(tx, 'VoteCasted', (ev) => {
            return ev.electionAddress === election.address && ev.electionName === 'ElectionService name' && ev.optionName === 'Option 2';
        });

        assert.equal(await election.getVotersNumber(), 1, 'After a vote is casted, voters number should increase');
        assert.equal(await election.voters(0), firstAccount, 'After a vote is casted, voter\'s address should be saved');
    })

    it('should fail if trying to remove a non-existing option', async () => {
        await election.addOption('Option 1', 'Description 1');

        await truffleAssert.reverts(election.removeOption(1), 'Option index out of bound');
    })

    it('should fail if trying to cast a vote on a non-existing option', async () => {
        await election.addOption('Option 1', 'Description 1');

        await truffleAssert.reverts(election.castVote(1), 'Option index out of bound');
    })

    it('should fail if trying to vote twice', async () => {
        await election.addOption('Option 1', 'Description 1');
        await election.addOption('Option 2', 'Description 2');

        await election.castVote(0);
        assert.equal(await election.getVotersNumber(), 1, 'After a vote is casted, voters number should increase');
        assert.equal(await election.voters(0), firstAccount, 'After a vote is casted, voter\'s address should be saved');

        await truffleAssert.reverts(election.castVote(1), 'This user has already casted his vote');
    })

    it('should fail if trying to vote on an inactive election', async () => {
        await election.addOption('Option 1', 'Description 1');
        await election.deactivate();

        await truffleAssert.reverts(election.castVote(0), 'This election isn\'t active');
    })

    it('should fail if trying to vote after the election\'s end date', async () => {
        election = await Election.new(firstAccount, 'ElectionService name', 'ElectionService description', pastDateInSecs);

        await truffleAssert.reverts(election.castVote(0), 'This election has ended');
    })

    it('should fail if non-owner tries to add an option', async () => {
        await truffleAssert.reverts(election.addOption('Option 1', 'Description 1', {from: secondAccount}), 'Only owner can do this');
    })

    it('should fail if non-owner tries to remove an option', async () => {
        await election.addOption('Option 1', 'Description 1');
        await truffleAssert.reverts(election.removeOption(0, {from: secondAccount}), 'Only owner can do this');
    })

    it('should deactivate/activate an election, with events emitted', async () => {
        const deactivationTx = await election.deactivate();

        assert.equal(await election.isActive(), false, 'ElectionService should be inactive');
        truffleAssert.eventEmitted(deactivationTx, 'Deactivated', () => {
            return true;
        });

        const activationTx = await election.activate();

        assert.equal(await election.isActive(), true, 'ElectionService should be active');
        truffleAssert.eventEmitted(activationTx, 'Activated', () => {
            return true;
        });
    })

    it('should fail if non-owner tries to deactivate an election', async () => {
        await truffleAssert.reverts(election.deactivate({from: secondAccount}), 'Only owner can do this');
    })

    it('should fail if non-owner tries to activate an election', async () => {
        await election.deactivate({from: firstAccount})
        await truffleAssert.reverts(election.activate({from: secondAccount}), 'Only owner can do this');
    })
})