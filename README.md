# Vote System

[![Build](https://github.com/alainncls/vote-system/actions/workflows/pipeline.yml/badge.svg)](https://github.com/alainncls/vote-system/actions/workflows/pipeline.yml)
[![Coverage Status](https://coveralls.io/repos/github/alainncls/vote-system/badge.svg?branch=github-actions)](https://coveralls.io/github/alainncls/vote-system?branch=github-actions)

This project aims to provide a DApp sample.  
It allows the user to create "elections", add vote options to these elections and vote on these options.  

It's composed of 2 main folders:
1. `blockchain` contains everything regarding smart contracts and their deployment
2. `webapp` contains the web application  that accesses those smart contracts

## Smart Contracts

These commands are run in the `blockchain` folder

### First use

Install dependencies: `npm install`

### Compile and test the contracts

1. Compile contracts: `truffle compile`
2. Test contracts: `truffle test`
3. Generate contracts code coverage: `truffle run coverage`

### Deploy the contracts on Ganache

1. Download and install [Ganache](https://www.trufflesuite.com/ganache)
2. Launch Ganache (recommendation: create a workspace associated to this project `truffle-config.js` file)
3. Deploy the contracts: `truffle migrate`

## Web Application

These commands are run in the `webapp` folder

### First use

Install dependencies: `npm install`

// TODO: this part is a WIP