// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

contract Directory {

    address[] public elections;

    event ElectionAdded(address indexed electionAddress);
    event ElectionRemoved();

    function addElection(address _electionAddress) public {
        elections.push(_electionAddress);
        emit ElectionAdded(_electionAddress);
    }

    function removeElection(uint _index) public electionExists(_index) {
        for (uint i = _index; i < elections.length - 1; i++) {
            elections[i] = elections[i + 1];
        }
        elections.pop();
        emit ElectionRemoved();
    }

    function getElectionsNumber() public view returns (uint){
        return elections.length;
    }

    modifier electionExists(uint _index) {
        require(_index < elections.length, "Election index out of bound");
        _;
    }
}
