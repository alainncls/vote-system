import {html} from 'lit-html'
import page from 'page'
import Noty from "noty";

// bind app
const layout = (header, content, footer) => html`
    <div class="">
        <div class="header">${header}</div>
        <div class="container">${content}</div>
        <div class="footer">${footer}</div>
    </div>`

const header = () => html`
    <header class="navbar">
        <section class="navbar-center">
            <a href="/" class="btn btn-link sitename">Vote System</a>
            <a href="/" class="btn btn-link">All Elections</a>
            <a href="/new" class="btn btn-link">Create Election</a>
        </section>
    </header>`

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

const viewElections = (elections) => {
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
    const rows = elections.map(
        election =>
            html`
                <tr>
                    <td><a href="/${election.address}">${election.name}</a></td>
                    <td>${election.description}</td>
                    <td>${election.owner}</td>
                    <td>${election.options.length}</td>
                </tr>`
    )
    return html` <h1>Choose your election</h1>
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Options number</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>`
}

const viewCreateElection = (addElection) => {
    // form submission handler
    const submitHandler = {
        async handleEvent(e) {
            e.preventDefault()
            // get submitted data
            const creationForm = document.getElementById(
                'creation-election-form'
            )
            const name = creationForm.querySelector('#election-name').value
            const description = creationForm.querySelector('#election-description').value

            // create
            await addElection.addElection(name, description)

            // redirect to homepage
            page('/')
            return
        },
    }

    return html` <h1>Election creation</h1>
    <form id="creation-election-form">
        <div class="form-group">
            <label class="form-label" for="election-name">Election name</label>
            <input name="name" class="form-input" type="text" id="election-name" placeholder="Name"/>
        </div>

        <div class="form-group">
            <label class="form-label" for="election-description">Election description</label>
            <input name="name" class="form-input" type="text" id="election-description" placeholder="Description"/>
        </div>

        <button class="btn btn-primary" id="create-submit" @click=${submitHandler}>Create election</button>
    </form>`
}

const viewDisplayElection = (election, castVote, hasVoted) => {
    if (election.options.length === 0) {
        return html` <h1>Options for election "${election.name}"</h1>
        <div class="nocontent">
            <p>There isn't any vote option for this election</p>
        </div>`
    }

    const castVoteEventCallback = () => {
        new Noty({
            theme: 'light',
            type: 'success',
            layout: 'topRight',
            text: 'Your vote is confirmed',
            buttons: [
                Noty.button('See vote results', 'btn btn-link', () => {
                    page('/' + election.address)
                })
            ]
        }).show()
    }

    const voteHandler = {
        async handleEvent(e) {
            e.preventDefault()
            const voteBtn = e.target
            const optionId = voteBtn.dataset.optionId
            castVote.castVote(
                election.address,
                optionId,
                castVoteEventCallback
            )
            e.currentTarget.style.visibility = 'hidden';
        },
    }

    const rows = election.options.map((option, index) => {
        const voteBtn = !hasVoted ? html`
                    <button type="submit" class="btn vote" data-optionId="${index}" @click=${voteHandler}> Vote</button> `
            : ''

        return html`
            <tr>
                <td>${index}</td>
                <td>${option.name}</td>
                <td>${option.description}</td>
                <td>${option.votesCount}</td>
                <td>${voteBtn}</td>
            </tr>`
    })

    const alreadyVoted = hasVoted
        ? html`
                <div class="info">You've already cast your vote</div>`
        : ''

    return html`<h1>Options in election "${election.name}"</h1>
    <h2>${election.description}</h2>
    ${alreadyVoted}
    <table class="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Option name</th>
            <th>Option description</th>
            <th>Votes number</th>
            <th>Vote</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>`
}

export {
    layout,
    header,
    footer,
    viewLoading,
    viewNotFound,
    viewElections,
    viewCreateElection,
    viewDisplayElection,
}
