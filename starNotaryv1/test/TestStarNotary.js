const StarNotary = artifacts.require("StarNotary");

let accounts, owner;

contract("StarNotary", accts => {
  accounts = accts;
  owner = accounts[0];
});

describe("tests the StarNotary contract implementation and functions", () => {
  it("has the correct name for the contract", async () => {
    let instance = await StarNotary.deployed();
    let starName = await instance.starName.call();
    assert.equal(starName, "Awesome Udacity Star");
  });

  it("can be claimed", async () => {
    let instance = await StarNotary.deployed();
    await instance.claimStar({ from: owner });
    let starOwner = await instance.starOwner.call();
    assert.equal(starOwner, owner);
  });

  it("can change owners", async () => {
    let instance = await StarNotary.deployed();
    let secondUser = accounts[1];
    await instance.claimStar({ from: owner });
    let starOwner = await instance.starOwner.call();
    assert.equal(starOwner, owner);
    await instance.claimStar({ from: secondUser });
    let secondOwner = await instance.starOwner.call();
    assert.equal(secondOwner, secondUser);
  });

  it("can update the name of the star", async () => {
    let instance = await StarNotary.deployed();
    await instance.changeName("Dude");
    let starName = await instance.getStarName();
    assert.equal(starName, "Dude");
  });
});
