const Color = artifacts.require('Color');

module.exports = async function(deployer) {
	await deployer.deploy(Color);
};
