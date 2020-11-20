const Color = artifacts.require("./Color.sol");
const { assert } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

contract("Color contract", accounts => {
  let colorContract;
  before(async () => {
    colorContract = await Color.new();
  });

  it("Deployment", async () => {
    let address = colorContract.address;
    console.log("address: ", address);
    assert.notEqual(address, "", "deploy contract success.");
  });

  it("minting - add token", async () => {
    await colorContract.mint("#ffffff");
    await colorContract.mint("#fffffe");

    let totalSupply = await colorContract.totalSupply();
    assert.equal(totalSupply.toString(), 2, "add token not success");
  });

  //cant add twice times
  // it's work
  // it("minting - add exist token", async () => {
  //   await colorContract.mint("#ffffff");
  //   await colorContract.mint("#ffffff").should.be.rejected;
  // });
});
