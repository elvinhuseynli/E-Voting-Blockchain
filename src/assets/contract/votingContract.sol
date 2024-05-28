// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public admin;

    struct Issue {
        string description;
        bool isOpen;
        uint yesCount;
        uint noCount;
        uint closeTimestamp;
        mapping(address => bool) hasVoted;
    }

    mapping(uint => Issue) public issues;
    uint public issueCount;

    event IssueOpened(uint issueId, string description, uint closeTimestamp);
    event Voted(uint issueId, address voter, bool voteYes);
    event IssueClosed(uint issueId, string description, uint yesCount, uint noCount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier issueIsOpen(uint issueId) {
        require(issues[issueId].isOpen, "This issue is not open for voting");
        _;
    }

    modifier hasNotVoted(uint issueId) {
        require(!issues[issueId].hasVoted[msg.sender], "You have already voted on this issue");
        _;
    }

    modifier checkIssueClosure(uint issueId) {
        if (block.timestamp >= issues[issueId].closeTimestamp && issues[issueId].isOpen) {
            issues[issueId].isOpen = false;
            emit IssueClosed(issueId, issues[issueId].description, issues[issueId].yesCount, issues[issueId].noCount);
        }
        _;
    }

    function openIssue(string memory _description) public onlyAdmin {
        issueCount += 1;
        Issue storage newIssue = issues[issueCount];
        newIssue.description = _description;
        newIssue.isOpen = true;
        newIssue.yesCount = 0;
        newIssue.noCount = 0;
        newIssue.closeTimestamp = block.timestamp + 10 days;

        emit IssueOpened(issueCount, _description, newIssue.closeTimestamp);
    }

    function vote(uint issueId, bool voteYes) public issueIsOpen(issueId) hasNotVoted(issueId) checkIssueClosure(issueId) {
        Issue storage issue = issues[issueId];

        issue.hasVoted[msg.sender] = true;

        if (voteYes) {
            issue.yesCount += 1;
        } else {
            issue.noCount += 1;
        }

        emit Voted(issueId, msg.sender, voteYes);
    }

    function closeIssue(uint issueId) public onlyAdmin issueIsOpen(issueId) {
        Issue storage issue = issues[issueId];
        issue.isOpen = false;

        emit IssueClosed(issueId, issue.description, issue.yesCount, issue.noCount);
    }

    function getIssue(uint issueId) public view returns (string memory description, bool isOpen, uint yesCount, uint noCount, uint closeTimestamp) {
        Issue storage issue = issues[issueId];
        return (issue.description, issue.isOpen, issue.yesCount, issue.noCount, issue.closeTimestamp);
    }
}
