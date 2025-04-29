// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title StakeSenseVault
 * @dev Main vault contract for StakeSense that manages user deposits and strategy allocations
 */
contract StakeSenseVault is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant STRATEGY_MANAGER_ROLE = keccak256("STRATEGY_MANAGER_ROLE");
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

    struct Strategy {
        address avsAddress;
        uint256 allocation; // in basis points (1% = 100)
        bool active;
    }

    struct UserInfo {
        uint256 totalDeposits;
        uint256 lastUpdateTimestamp;
        uint256[] strategyIndices;
    }

    // State variables
    Strategy[] public strategies;
    mapping(address => UserInfo) public userInfo;
    mapping(address => mapping(uint256 => uint256)) public userStrategyBalances;
    
    uint256 public totalDeposits;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_REBALANCE_INTERVAL = 1 hours;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event StrategyUpdated(uint256 indexed strategyId, uint256 newAllocation);
    event Rebalance(uint256 timestamp);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STRATEGY_MANAGER_ROLE, msg.sender);
        _grantRole(KEEPER_ROLE, msg.sender);
    }

    /**
     * @dev Deposit ETH into the vault
     */
    function deposit() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Must deposit some ETH");
        
        UserInfo storage user = userInfo[msg.sender];
        user.totalDeposits += msg.value;
        totalDeposits += msg.value;
        
        // Allocate according to current strategy
        _allocateDeposit(msg.sender, msg.value);
        
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw ETH from the vault
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        UserInfo storage user = userInfo[msg.sender];
        require(amount <= user.totalDeposits, "Insufficient balance");

        user.totalDeposits -= amount;
        totalDeposits -= amount;

        // Withdraw from strategies proportionally
        _withdrawFromStrategies(msg.sender, amount);

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev Update strategy allocations (only callable by strategy manager)
     * @param _strategies New strategy configurations
     */
    function setStrategy(Strategy[] calldata _strategies) external onlyRole(STRATEGY_MANAGER_ROLE) {
        require(_strategies.length > 0, "Must provide at least one strategy");
        
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < _strategies.length; i++) {
            totalAllocation += _strategies[i].allocation;
        }
        require(totalAllocation == BASIS_POINTS, "Allocations must sum to 100%");

        delete strategies;
        for (uint256 i = 0; i < _strategies.length; i++) {
            strategies.push(_strategies[i]);
            emit StrategyUpdated(i, _strategies[i].allocation);
        }
    }

    /**
     * @dev Rebalance the portfolio according to current strategy (only callable by keeper)
     */
    function rebalance() external onlyRole(KEEPER_ROLE) nonReentrant whenNotPaused {
        require(block.timestamp >= userInfo[msg.sender].lastUpdateTimestamp + MIN_REBALANCE_INTERVAL, 
                "Must wait between rebalances");
        
        // Implementation of rebalancing logic
        // This would involve withdrawing from strategies that are overallocated
        // and depositing into strategies that are underallocated
        
        userInfo[msg.sender].lastUpdateTimestamp = block.timestamp;
        emit Rebalance(block.timestamp);
    }

    /**
     * @dev Get current portfolio value and allocations
     * @return totalValue Total value in the vault
     * @return currentStrategies Current strategy allocations
     */
    function getPortfolioInfo() external view returns (
        uint256 totalValue,
        Strategy[] memory currentStrategies
    ) {
        return (totalDeposits, strategies);
    }

    /**
     * @dev Emergency withdrawal function (only callable by admin)
     */
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) whenPaused {
        uint256 amount = userInfo[msg.sender].totalDeposits;
        userInfo[msg.sender].totalDeposits = 0;
        totalDeposits -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Emergency withdrawal failed");

        emit EmergencyWithdraw(msg.sender, amount);
    }

    /**
     * @dev Internal function to allocate deposits according to strategy
     * @param user Address of the depositor
     * @param amount Amount to allocate
     */
    function _allocateDeposit(address user, uint256 amount) internal {
        UserInfo storage userData = userInfo[user];
        
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) {
                uint256 allocation = (amount * strategies[i].allocation) / BASIS_POINTS;
                userStrategyBalances[user][i] += allocation;
                userData.strategyIndices.push(i);
            }
        }
    }

    /**
     * @dev Internal function to withdraw from strategies
     * @param user Address of the withdrawer
     * @param amount Amount to withdraw
     */
    function _withdrawFromStrategies(address user, uint256 amount) internal {
        UserInfo storage userData = userInfo[user];
        
        for (uint256 i = 0; i < userData.strategyIndices.length; i++) {
            uint256 strategyIndex = userData.strategyIndices[i];
            uint256 strategyBalance = userStrategyBalances[user][strategyIndex];
            
            if (strategyBalance > 0) {
                uint256 withdrawalAmount = (amount * strategyBalance) / userData.totalDeposits;
                userStrategyBalances[user][strategyIndex] -= withdrawalAmount;
            }
        }
    }

    // Receive function to accept ETH
    receive() external payable {
        this.deposit{value: msg.value}();
    }
} 