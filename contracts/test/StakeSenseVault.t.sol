// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/StakeSenseVault.sol";

contract StakeSenseVaultTest is Test {
    StakeSenseVault public vault;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public strategyManager = makeAddr("strategyManager");

    function setUp() public {
        vault = new StakeSenseVault();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        
        // Grant strategy manager role
        vault.grantRole(vault.STRATEGY_MANAGER_ROLE(), strategyManager);
    }

    function testDeposit() public {
        vm.startPrank(alice);
        vault.deposit{value: 1 ether}();
        vm.stopPrank();

        (uint256 totalValue, ) = vault.getPortfolioInfo();
        assertEq(totalValue, 1 ether);
    }

    function testWithdraw() public {
        // First deposit
        vm.startPrank(alice);
        vault.deposit{value: 1 ether}();
        
        // Then withdraw
        vault.withdraw(0.5 ether);
        vm.stopPrank();

        (uint256 totalValue, ) = vault.getPortfolioInfo();
        assertEq(totalValue, 0.5 ether);
    }

    function testSetStrategy() public {
        StakeSenseVault.Strategy[] memory strategies = new StakeSenseVault.Strategy[](2);
        strategies[0] = StakeSenseVault.Strategy({
            avsAddress: makeAddr("avs1"),
            allocation: 6000, // 60%
            active: true
        });
        strategies[1] = StakeSenseVault.Strategy({
            avsAddress: makeAddr("avs2"),
            allocation: 4000, // 40%
            active: true
        });

        vm.startPrank(strategyManager);
        vault.setStrategy(strategies);
        vm.stopPrank();

        (, StakeSenseVault.Strategy[] memory currentStrategies) = vault.getPortfolioInfo();
        assertEq(currentStrategies.length, 2);
        assertEq(currentStrategies[0].allocation, 6000);
        assertEq(currentStrategies[1].allocation, 4000);
    }

    function testFailSetStrategyNonManager() public {
        StakeSenseVault.Strategy[] memory strategies = new StakeSenseVault.Strategy[](1);
        strategies[0] = StakeSenseVault.Strategy({
            avsAddress: makeAddr("avs1"),
            allocation: 10000,
            active: true
        });

        vm.startPrank(alice);
        vault.setStrategy(strategies); // Should fail
        vm.stopPrank();
    }

    function testFailWithdrawInsufficientBalance() public {
        vm.startPrank(alice);
        vault.withdraw(1 ether); // Should fail - no balance
        vm.stopPrank();
    }

    function testEmergencyWithdraw() public {
        // First deposit
        vm.startPrank(alice);
        vault.deposit{value: 1 ether}();
        vm.stopPrank();

        // Pause the contract
        vm.startPrank(vault.DEFAULT_ADMIN_ROLE());
        vault.pause();
        
        // Emergency withdraw
        vault.emergencyWithdraw();
        vm.stopPrank();

        (uint256 totalValue, ) = vault.getPortfolioInfo();
        assertEq(totalValue, 0);
    }
} 