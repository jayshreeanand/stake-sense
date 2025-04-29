// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../src/StakeSenseVault.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StakeSenseVault vault = new StakeSenseVault();
        
        console.log("StakeSenseVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
} 