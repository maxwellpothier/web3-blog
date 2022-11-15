const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Blog", () => {
	const deployBlogFixture = async () => {
		const [owner, otherAddress] = await ethers.getSigners();
		const HelloWorld = await ethers.getContractFactory("Blog");
		const helloWorld = await HelloWorld.deploy("First Blog");
		
		return {helloWorld, owner, otherAddress};
	}

	describe("Deployment", () => {
		it("deploys the contract", async () => {
			const {helloWorld} = await loadFixture(deployBlogFixture);

			const expectedName = "First Blog";
			const actualName = await helloWorld.name();

			assert(expectedName === actualName, "Names do not match");
		});
	});
});