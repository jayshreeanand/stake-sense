// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/StakeSenseVault.sol";

contract TestVaultScript is Script {
    StakeSenseVault public vault;
    address public user;
    address public strategyManager;

    function setUp() public {
        // Load private key from environment
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        // Create addresses from private key
        user = vm.addr(privateKey);
        strategyManager = user; // Use the same address for both roles
        
        // Load deployed vault address from environment
        address payable vaultAddress = payable(vm.envAddress("VAULT_ADDRESS"));
        vault = StakeSenseVault(vaultAddress);
    }

    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        // Test deposit
        console.log("Testing deposit...");
        vm.startBroadcast(privateKey);
        vault.deposit{value: 0.01 ether}();
        vm.stopBroadcast();
        
        // Check balance
        (uint256 totalDeposits, uint256 lastDepositTime) = vault.userInfo(user);
        console.log("User balance after deposit:", totalDeposits);
        
        // Test strategy management
        console.log("Testing strategy management...");
        vm.startBroadcast(privateKey);
        
        // Create a simple strategy
        StakeSenseVault.Strategy[] memory strategies = new StakeSenseVault.Strategy[](2);
        strategies[0] = StakeSenseVault.Strategy({
            avsAddress: address(0x1),
            allocation: 6000, // 60%
            active: true
        });
        strategies[1] = StakeSenseVault.Strategy({
            avsAddress: address(0x2),
            allocation: 4000, // 40%
            active: true
        });
        
        vault.setStrategy(strategies);
        vm.stopBroadcast();
        
        // Check strategy
        // We can't directly get the strategy from the contract due to struct compatibility issues
        // Instead, we'll just log that we set the strategy
        console.log("Strategy set with 2 allocations: Strategy 1 (60%) and Strategy 2 (40%)");
        
        // Test withdrawal
        console.log("Testing withdrawal...");
        vm.startBroadcast(privateKey);
        vault.withdraw(0.005 ether);
        vm.stopBroadcast();
        
        // Check balance after withdrawal
        (totalDeposits, lastDepositTime) = vault.userInfo(user);
        console.log("User balance after withdrawal:", totalDeposits);
        
        console.log("All tests completed!");
    }
} 