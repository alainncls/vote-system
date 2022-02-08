import {html} from 'lit-html'
import page from 'page'
import Noty from 'noty'

// bind app
const layout = (head, content, foot) => html`
    <div class="">
        <div class="header">${head}</div>
        <div class="container">${content}</div>
        <div class="footer">${foot}</div>
    </div>`

const header = (userAddress) => {
    const isConnected = userAddress ? 'online' : 'busy';

    return html`
        <header class="navbar">
            <section class="navbar-center">
                <a href="/" class="btn btn-link sitename">Vote System</a>
                <a href="/" class="btn btn-link">All Elections</a>
                <a href="/new" class="btn btn-link">Create Election</a>
            </section>
            <section class="navbar-right">
                <div class="tooltip tooltip-left" data-tooltip="${userAddress}">
                    <figure class="avatar avatar-l" data-initial="0x">
                        <i class="avatar-presence ${isConnected}"></i>
                    </figure>
                </div>
            </section>
        </header>`
}
const footer = () => html`
    <footer class="text-center">
        <div>
            Vote System built and designed with
            <span class="text-error">♥</span> by <a href="https://alainnicolas.fr" target="_blank">Alain Nicolas</a>
        </div>
    </footer>`

// views
const viewLoading = () => html`
    <div class="loading loading-lg"></div>`

const viewNotFound = () => html`
    <div>Not found !</div>`

const viewElections = (elections, account, directoryService) => {
    if (elections.length === 0) {
        return html`<h1>List of elections</h1>
        <div class="nocontent">
            <p>There isn't any election yet!</p>
            <p>
                <a href="/new" class="btn btn-primary">
                    Create your first election
                </a>
            </p>
        </div>`
    }

    const deletionHandler = {
        async handleEvent(e) {
            e.preventDefault()
            const removeBtn = e.target
            const electionId = Number(removeBtn.dataset.electionid)
            await directoryService.removeElectionFromIndex(electionId)
        },
    }

    const rows = elections.map((election, index) => {
        const removeBtn = election.owner === account ? html`
            <button type="submit" class="btn" data-electionid="${index}" @click=${deletionHandler}>Delete
            </button>` : html`Only owner can delete`
        return html`
            <tr>
                <td><a href="/${election.address}">${election.name}</a></td>
                <td>${election.description}</td>
                <td>${election.owner}</td>
                <td>${election.options.length}</td>
                <td>${removeBtn}</td>
            </tr>`
    })

    return html` <h1>Choose your election</h1>
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Options number</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>`
}

const viewCreateElection = (directory) => {
    // form submission handler
    const submitHandler = {
        async handleEvent(e) {
            e.preventDefault()
            // get submitted data
            const creationForm = document.getElementById('creation-election-form')
            const name = creationForm.querySelector('#election-name').value
            const description = creationForm.querySelector('#election-description').value

            // create
            await directory.addElection(name, description)

            // redirect to homepage
            page('/')
        },
    }

    return html` <h1>Election creation</h1>
    <form id="creation-election-form">

        <div class="form-group form-horizontal option">
            <label class="form-label form-inline" for="election-name"><input name="name" class="form-input form-inline"
                                                                             type="text" id="election-name"
                                                                             placeholder="Name"/></label>
            <label class="form-label form-inline" for="election-description"><input name="description"
                                                                                    class="form-input form-inline"
                                                                                    type="text"
                                                                                    id="election-description"
                                                                                    placeholder="Description"/></label>
            <button class="btn btn-primary form-inline" id="create-submit" @click=${submitHandler}>Create election
            </button>
        </div>

    </form>`
}

const viewDisplayElection = (election, electionService, hasVoted, isOwner, directoryService) => {
    // clone option fields
    const addOptionHandler = {
        handleEvent(e) {
            e.preventDefault()
            const creationForm = document.getElementById('add-options-form')
            const options = creationForm.querySelector('.options')
            const inputs = creationForm.querySelector('.option')
            const clones = inputs.cloneNode(true)
            const newInputs = clones.querySelectorAll('input')
            for (const input of newInputs) {
                input.value = ''
            }
            options.append(clones)
        },
    }

    const submitNewOptionHandler = {
        async handleEvent(e) {
            e.preventDefault()
            // get submitted data
            const form = document.getElementById('add-options-form')
            const optionsNames = form.querySelectorAll('[name="options"]')
            const optionsDescription = form.querySelectorAll('[name="description"]')
            const optionsToAdd = [];
            for (let i = 0; i < optionsNames.length; i++) {
                optionsToAdd[i] = {name: optionsNames[i].value, description: optionsDescription[i].value}
            }
            // add options
            await electionService.addOptions(election.address, optionsToAdd)
        },
    }

    const castVoteEventCallback = () => {
        new Noty({theme: 'light', type: 'success', layout: 'topRight', text: 'Your vote is confirmed'}).show()
    }

    const voteHandler = {
        async handleEvent(e) {
            e.preventDefault()
            const voteBtn = e.target
            const optionId = voteBtn.dataset.optionid
            await electionService.castVote(election.address, optionId, castVoteEventCallback)
            page('/' + election.address)
        },
    }

    const activationHandler = {
        async handleEvent(e) {
            e.preventDefault()
            await electionService.activate(election.address)
        },
    }

    const deactivationHandler = {
        async handleEvent(e) {
            e.preventDefault()
            await electionService.deactivate(election.address)
        },
    }

    const deletionHandler = {
        async handleEvent(e) {
            e.preventDefault()
            await directoryService.removeElectionFromAddress(election.address)
        },
    }

    const removeOptionHandler = {
        async handleEvent(e) {
            e.preventDefault()
            const removeBtn = e.target
            const optionId = removeBtn.dataset.optionid
            await electionService.removeOption(election.address, optionId)
        },
    }

    const rows = election.options.map((option, index) => {
        const isActive = election.isActive ? html`
            <button type="submit" class="btn" data-optionid="${index}" @click=${voteHandler}>Vote
            </button>` : html`Election is inactive`
        const voteBtn = !hasVoted ? html`
            ${isActive}` : html`Vote already cast`
        const removeBtn = isOwner ? html`
            <button type="submit" class="btn" data-optionid="${index}" @click=${removeOptionHandler}>Delete
            </button>` : html`Only owner can delete`

        return html`
            <tr>
                <td>${index}</td>
                <td>${option.name}</td>
                <td>${option.description}</td>
                <td>${option.votesCount}</td>
                <td>${voteBtn}</td>
                <td>${removeBtn}</td>
            </tr>`
    })

    const ownership = isOwner ? html`<p>✅ You are the owner of this election</p>` : html`<p>${election.owner} is the
        owner of this election</p>`

    const alreadyVoted = hasVoted ? html`<p><span class="text-error">⚠️</span> You've already cast your vote
    </p>` : html`<p>✅ You can vote on this election</p>`

    const hasOptions = !election.options || election.options.length === 0 ? html`<p>🚨 There isn't any vote option for
        this election</p>` : ''

    const manageOptions = isOwner ? html`
        <form id="add-options-form">
            <div class="options">
                <div class="form-group form-horizontal option">
                    <label class="form-label form-inline" for="option"><input name="options"
                                                                              class="form-input form-inline" type="text"
                                                                              id="option" placeholder="Name"/></label>
                    <label class="form-label form-inline" for="description"><input name="description"
                                                                                   class="form-input form-inline"
                                                                                   type="text" id="description"
                                                                                   placeholder="Description"/></label>
                </div>
            </div>
            <button class="btn btn-sm" id="add-option" @click=${addOptionHandler}><i class="icon icon-plus"></i>Add more
                options
            </button>
            <button class="btn btn-primary" @click=${submitNewOptionHandler}>Add these options to the election</button>
        </form>` : html`<p><span class="text-error">⚠️</span> Only owner can add options</p>`

    const activationToggle = election.isActive ? html`
        <button class="btn btn-error mgmt-button" @click=${deactivationHandler}>Deactivate this election
        </button>` : html`
        <button class="btn btn-success mgmt-button" @click=${activationHandler}>Activate this election</button>`

    const deleteElection = html`
        <button class="btn btn-error mgmt-button" @click=${deletionHandler}>Delete this election</button>`

    const manageElection = isOwner ? html`${activationToggle} ${deleteElection}` : html`<p><span
            class="text-error">⚠️</span> Only owner can manage this election</p>`

    return html`<h1>Options in election "${election.name}"</h1>
    <h2>${election.description}</h2>
    ${ownership}
    ${hasOptions}
    ${alreadyVoted}

    <table class="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Option name</th>
            <th>Option description</th>
            <th>Votes number</th>
            <th>Vote</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>

    <hr>

    <h3>Add options to this election</h3>
    ${manageOptions}

    <h3>Manage this election</h3>
    ${manageElection}
    `
}

export {
    layout, header, footer, viewLoading, viewNotFound, viewElections, viewCreateElection, viewDisplayElection,
}
