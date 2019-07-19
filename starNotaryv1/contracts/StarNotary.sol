pragma solidity >=0.4.24;

contract StarNotary {

    string public starName;
    address public starOwner;

    event starClaimed(address owner);

    constructor() public {
        starName = "Awesome Udacity Star";
    }

    function claimStar() public {
        starOwner = msg.sender;
        emit starClaimed(msg.sender);
    }

    function changeName(string memory name) public returns (bool) {
        starName = name;
        return true;
    }

    function getStarName() public view returns (string memory) {
        return starName;
    }
}