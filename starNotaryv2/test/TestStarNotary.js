const StarNotary = artifacts.require("StarNotary");

let accounts, owner;

contract("StarNotary", accts => {
  accounts = accts;
  owner = accounts[0];
});

it("can Create a Star", async () => {
  let tokenId = 1;
  let instance = await StarNotary.deployed();
  await instance.createStar("Awesome Star!", tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Awesome Star!");
});

it("can put the star up for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = owner;
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar("Test Star 2", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice);
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it("can let an address buy a star if it is for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[0];
  let user2 = accounts[1];
  let starId = 3;
  let starPrice = web3.utils.toWei(".01", "ether");
  let value = web3.utils.toWei(".05", "ether");
  await instance.createStar("Test Star 3", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  await instance.buyStar(starId, { from: user2, value });
  assert.equal(await instance.ownerOf(starId), user2);
});

it("lets user1 get the funds after the sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value: balance });
  let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
  let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
  let value2 = Number(balanceOfUser1AfterTransaction);
  assert.equal(value1, value2);
});

it("lets user1 get the funds after the sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[8];
  let user2 = accounts[9];
  let starId = 4;
  let starPrice = web3.utils.toWei(".01", "ether");
  let value = web3.utils.toWei(".05", "ether");
  await instance.createStar("Test Star 4", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let user1BalancePriorToSale = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value });
  let user1BalanceAfterSale = await web3.eth.getBalance(user1);
  assert.equal(
    Number(user1BalanceAfterSale) - Number(starPrice),
    Number(user1BalancePriorToSale)
  );
});
