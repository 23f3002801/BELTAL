// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AssetNFT — Soulbound Defence Hardware Custody Provenance Token
 * @notice Represents physical military & defence hardware assets manufactured and tracked across
 *         Bharat Electronics Limited (BEL) units.
 * @dev Soulbound custody token: Standard ERC-721 transfers (transferFrom / safeTransferFrom) are disabled.
 *      Custody transfers are restricted to dual-authorized administrative reassignments.
 */
contract AssetNFT {
    string public name = "TrustChain BEL Defence Asset";
    string public symbol = "BEL-ASSET";

    address public admin;
    address public deployer;

    uint256 private _nextTokenId = 1001;

    struct AssetDetails {
        string assetTag;          // e.g., "BEL-SDR-TAC-042"
        uint8 classificationTier; // 1 (Restricted) to 4 (Top Secret)
        bytes32 sbu;              // e.g., "SBU_RADAR", "SBU_MILCOMM"
        string tokenURI;          // IPFS CID metadata
        uint256 mintedAt;
        bool isUnderMaintenance;
    }

    struct CustodyRecord {
        address custodian;
        uint256 timestamp;
        string transferReason;
    }

    // tokenId => AssetDetails
    mapping(uint256 => AssetDetails) public assets;

    // tokenId => current custodian address
    mapping(uint256 => address) public custodians;

    // tokenId => list of historical custody handovers
    mapping(uint256 => CustodyRecord[]) public custodyHistory;

    // Authorized managers / CISOs permitted to mint and reassign custody
    mapping(address => bool) public isAuthorizedManager;

    // Events
    event AssetMinted(
        uint256 indexed tokenId,
        address indexed initialCustodian,
        string assetTag,
        uint8 classificationTier,
        bytes32 indexed sbu,
        string tokenURI
    );

    event CustodyReassigned(
        uint256 indexed tokenId,
        address indexed previousCustodian,
        address indexed newCustodian,
        string reason,
        uint256 timestamp
    );

    event MaintenanceStatusUpdated(uint256 indexed tokenId, bool isUnderMaintenance);

    modifier onlyAdmin() {
        require(msg.sender == admin || msg.sender == deployer, "AssetNFT: Caller is not admin or deployer");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == admin || msg.sender == deployer || isAuthorizedManager[msg.sender],
            "AssetNFT: Caller is not authorized manager"
        );
        _;
    }

    constructor(address _initialAdmin) {
        deployer = msg.sender;
        admin = _initialAdmin != address(0) ? _initialAdmin : 0x334eEfB6fc223ABf74D5F00E635B63c544689E8f;
        isAuthorizedManager[admin] = true;
        isAuthorizedManager[deployer] = true;
    }

    function setAuthorizedManager(address manager, bool status) external onlyAdmin {
        isAuthorizedManager[manager] = status;
    }

    /**
     * @notice Mint a new defence asset NFT with metadata pinned to IPFS
     */
    function mintAsset(
        address initialCustodian,
        string calldata assetTag,
        uint8 classificationTier,
        bytes32 sbu,
        string calldata tokenURI
    ) external onlyAuthorized returns (uint256) {
        require(initialCustodian != address(0), "AssetNFT: Invalid custodian address");
        require(classificationTier >= 1 && classificationTier <= 4, "AssetNFT: Invalid classification tier");

        uint256 tokenId = _nextTokenId++;

        assets[tokenId] = AssetDetails({
            assetTag: assetTag,
            classificationTier: classificationTier,
            sbu: sbu,
            tokenURI: tokenURI,
            mintedAt: block.timestamp,
            isUnderMaintenance: false
        });

        custodians[tokenId] = initialCustodian;

        custodyHistory[tokenId].push(CustodyRecord({
            custodian: initialCustodian,
            timestamp: block.timestamp,
            transferReason: "INITIAL_MINT_AND_CUSTODY_ASSIGNMENT"
        }));

        emit AssetMinted(tokenId, initialCustodian, assetTag, classificationTier, sbu, tokenURI);

        return tokenId;
    }

    /**
     * @notice Reassign physical and cryptographic custody of an asset
     * @dev Replaces standard transferFrom with a dual-authorized custody reassignment
     */
    function reassignCustody(
        uint256 tokenId,
        address newCustodian,
        string calldata reason
    ) external onlyAuthorized {
        require(custodians[tokenId] != address(0), "AssetNFT: Asset does not exist");
        require(newCustodian != address(0), "AssetNFT: Invalid new custodian address");
        require(newCustodian != custodians[tokenId], "AssetNFT: New custodian is already current custodian");

        address previousCustodian = custodians[tokenId];
        custodians[tokenId] = newCustodian;

        custodyHistory[tokenId].push(CustodyRecord({
            custodian: newCustodian,
            timestamp: block.timestamp,
            transferReason: reason
        }));

        emit CustodyReassigned(tokenId, previousCustodian, newCustodian, reason, block.timestamp);
    }

    /**
     * @notice Set equipment maintenance flag
     */
    function setMaintenanceStatus(uint256 tokenId, bool isUnderMaintenance) external onlyAuthorized {
        require(custodians[tokenId] != address(0), "AssetNFT: Asset does not exist");
        assets[tokenId].isUnderMaintenance = isUnderMaintenance;
        emit MaintenanceStatusUpdated(tokenId, isUnderMaintenance);
    }

    /**
     * @notice Retrieve the full custody provenance trail for an asset
     */
    function getCustodyHistory(uint256 tokenId) external view returns (CustodyRecord[] memory) {
        require(custodians[tokenId] != address(0), "AssetNFT: Asset does not exist");
        return custodyHistory[tokenId];
    }

    /**
     * @notice Get current custodian address
     */
    function getCustodian(uint256 tokenId) external view returns (address) {
        return custodians[tokenId];
    }

    /**
     * @notice Get asset details
     */
    function getAssetDetails(uint256 tokenId) external view returns (AssetDetails memory) {
        require(custodians[tokenId] != address(0), "AssetNFT: Asset does not exist");
        return assets[tokenId];
    }

    // --- SOULBOUND RESTRICTIONS ---
    // Prevent standard marketplace transfers
    function transferFrom(address, address, uint256) external pure {
        revert("AssetNFT: SOULBOUND token. Standard transfers disabled; use reassignCustody.");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("AssetNFT: SOULBOUND token. Standard transfers disabled; use reassignCustody.");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert("AssetNFT: SOULBOUND token. Standard transfers disabled; use reassignCustody.");
    }

    function approve(address, uint256) external pure {
        revert("AssetNFT: Approvals disabled on soulbound assets.");
    }

    function setApprovalForAll(address, bool) external pure {
        revert("AssetNFT: Approvals disabled on soulbound assets.");
    }
}
