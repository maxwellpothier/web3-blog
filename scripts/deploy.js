const hre = require("hardhat");
const fs = require("fs");

const sleep = async (ms) => {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, ms);
	});
};

const main = async () => {
	const Blog = await hre.ethers.getContractFactory("Blog");
	const blog = await Blog.deploy("My Blog");

	await blog.deployed();

	console.log(`Blog contract deployed to ${blog.address}`);

	fs.writeFileSync("./config.js", `
export const contractAddress = "${blog.address}"
export const ownerAddress = "${blog.signer.address}"
	`)

	await sleep(45 * 1000);

	await hre.run("verify:verify", {
		address: blog.address,
		constructorArguments: ["My blog"],
	});
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
