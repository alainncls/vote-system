// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

contract Election {

    address public owner;
    string public name;
    string public description;
    address[] public voters;
    bool public isActive;
    Option[] public options;

    struct Option {
        string name;
        string description;
        uint votesCount;
    }

    event OptionAdded(address indexed electionAddress, string electionName, string optionName);
    event OptionRemoved(address indexed electionAddress, string electionName);
    event VoteCasted(address indexed electionAddress, string electionName, string optionName);

    constructor(address _owner, string memory _name, string memory _description) {
        owner = _owner;
        name = _name;
        description = _description;
        isActive = true;
    }

    function addOption(string memory _name, string memory _description) public {
        options.push(Option(_name, _description, 0));
        emit  OptionAdded(address(this), name, _name);
    }

    function removeOption(uint _index) public optionExists(_index) {
        for (uint i = _index; i < options.length - 1; i++) {
            options[i] = options[i + 1];
        }
        options.pop();
        emit  OptionRemoved(address(this), name);
    }

    function castVote(uint _index) public hasNotVoted optionExists(_index) {
        options[_index].votesCount++;
        voters.push(msg.sender);
        emit VoteCasted(address(this), name, options[_index].name);
    }

    function getOptionsNumber() public view returns (uint){
        return options.length;
    }

    function getVotersNumber() public view returns (uint){
        return voters.length;
    }

    modifier hasNotVoted() {
        bool hasVoted = false;
        if (voters.length > 0) {
            for (uint i = 0; i < voters.length; i++) {
                if (voters[i] == msg.sender) {
                    hasVoted = true;
                    break;
                }
            }
        }
        require(!hasVoted, "This user has already casted his vote");
        _;
    }

    modifier optionExists(uint _index) {
        require(_index < options.length, "Option index out of bound");
        _;
    }
}
