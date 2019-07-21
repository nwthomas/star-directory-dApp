pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

  struct Star {
    string name;
  }

  mapping (uint => Star) public tokenIdToStarInfo;
  mapping (uint => uint) public starsForSale;

  function createStar(string memory _name, uint _tokenId) public {
    Star memory newStar = Star(_name);
    tokenIdToStarInfo[_tokenId] = newStar;
    _mint(msg.sender, _tokenId);
  }

  function putStarUpForSale(uint _tokenId, uint _price) public returns (bool) {
    // require(ownerOf(_tokenId) == msg.sender, "You don't have the ability to sell that star.");
    // require(_price >= 0, "Please include a price for the star.");
    starsForSale[_tokenId] = _price;
    return true;
  }

  // Function that allows you to convert an address into a payable address
  function _make_payable(address x) internal pure returns (address payable) {
    return address(uint160(x));
  }

  function buyStar(uint256 _tokenId) public  payable {
        // require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        // require(msg.value > starCost, "You need to have enough Ether");
        _transferFrom(ownerAddress, msg.sender, _tokenId);
        address payable ownerAddressPayable = _make_payable(ownerAddress);
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }
}