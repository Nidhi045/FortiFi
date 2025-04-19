// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DisposableCardLocker
 * @dev Enforces single-use virtual cards with blockchain-level guarantees
 */
contract DisposableCardLocker is ReentrancyGuard {
    // Structure to store card usage details
    struct CardUsage {
        address user;
        uint256 timestamp;
        uint256 amount;
        string merchant;
    }

    // Mapping of card hashes to usage status
    mapping(bytes32 => CardUsage) private _usedCards;
    
    // Event emitted when a card is used
    event CardUsed(
        bytes32 indexed cardHash,
        address indexed user,
        uint256 amount,
        string merchant,
        uint256 timestamp
    );

    // Event emitted when a card is locked
    event CardLocked(
        bytes32 indexed cardHash,
        address indexed locker,
        uint256 timestamp
    );

    /**
     * @dev Validate and record card usage
     * @param cardHash SHA3-256 hash of card details
     * @param amount Transaction amount in smallest currency unit
     * @param merchant Merchant identifier
     */
    function useCard(
        bytes32 cardHash,
        uint256 amount,
        string calldata merchant
    ) external nonReentrant {
        require(!isCardUsed(cardHash), "Card already used");
        require(amount > 0, "Invalid amount");

        _usedCards[cardHash] = CardUsage({
            user: msg.sender,
            timestamp: block.timestamp,
            amount: amount,
            merchant: merchant
        });

        emit CardUsed(
            cardHash,
            msg.sender,
            amount,
            merchant,
            block.timestamp
        );
    }

    /**
     * @dev Check if a card has been used
     * @param cardHash SHA3-256 hash of card details
     * @return True if card has been used
     */
    function isCardUsed(bytes32 cardHash) public view returns (bool) {
        return _usedCards[cardHash].timestamp > 0;
    }

    /**
     * @dev Get card usage details
     * @param cardHash SHA3-256 hash of card details
     * @return usageDetails Tuple of (user, timestamp, amount, merchant)
     */
    function getCardUsage(bytes32 cardHash)
        external
        view
        returns (
            address,
            uint256,
            uint256,
            string memory
        )
    {
        CardUsage memory usage = _usedCards[cardHash];
        return (usage.user, usage.timestamp, usage.amount, usage.merchant);
    }

    /**
     * @dev Pre-lock a card before generation (optional)
     * @param cardHash SHA3-256 hash of card details
     */
    function lockCard(bytes32 cardHash) external {
        require(!isCardUsed(cardHash), "Card already used");
        emit CardLocked(cardHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Calculate card hash from details
     * @param cardNumber Last 4 digits for verification
     * @param cvv Card verification value
     * @param expiry Expiry date in UNIX timestamp
     * @param salt Application-specific salt
     * @return cardHash bytes32 SHA3-256 hash
     */
    function calculateCardHash(
        string calldata cardNumber,
        string calldata cvv,
        uint256 expiry,
        bytes32 salt
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(cardNumber, cvv, expiry, salt));
    }
}

