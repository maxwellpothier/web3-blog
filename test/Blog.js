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

			await helloWorld.updateName("Updated name");
			const expectedSecondName = "Updated name";
			const actualSecondName = await helloWorld.name();

			assert(expectedSecondName === actualSecondName, "Update name failed");
		});
		it("successfully transfers ownership", async () => {
			const {helloWorld, owner, otherAddress} = await loadFixture(deployBlogFixture);

			const currOwner = await helloWorld.owner();
			assert(currOwner === owner.address);

			await helloWorld.transferOwnership(otherAddress.address);
			assert(await helloWorld.owner() === otherAddress.address);
		});
		it("fails to transfer ownership", async () => {
			const {helloWorld, otherAddress} = await loadFixture(deployBlogFixture);

			await expect(helloWorld.connect(otherAddress).transferOwnership(otherAddress.address)).to.be.reverted;
		});
	});

	describe("Creates a post", () => {
		it("successfully creates a post", async () => {
			const {helloWorld} = await loadFixture(deployBlogFixture);

			await expect(helloWorld.createPost("My first post", "1234")).to.emit(helloWorld, "PostCreated");

			const post = await helloWorld.fetchPost("1234");

			assert(post.title === "My first post");
		});
	});

	describe("Updates existing psot", () => {
		it("successfully updates post", async () => {
			const {helloWorld} = await loadFixture(deployBlogFixture);

			await helloWorld.createPost("first post", "1234");
			await helloWorld.createPost("second post", "5678");

			await expect(helloWorld.updatePost(2, "updated second post", "5678", false)).to.emit(helloWorld, "PostUpdated");

			const updatedPost = await helloWorld.fetchPost("5678");

			assert(updatedPost.title === "updated second post");
		});
	});
});