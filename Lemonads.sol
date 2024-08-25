// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Lemonads {
    struct AdParcel {
        uint256 bid; // Current highest bid for the ad parcel
        uint256 minBid; // Minimum bid required for the ad parcel
        address owner; // Owner of the ad parcel
        address renter; // Current renter of the ad parcel
        string traitsHash; // IPFS hash for parcel metadata (width, fonts..)
        string contentHash; // IPFS hash for content
        string websiteInfoHash; // IPFS hash for website information
        bool active; // Is this parcel still active
    }

    uint public constant MIN_CLICK_AMOUNT_COVERED = 10;

    // Mapping to store ad parcels by their ID
    mapping(uint256 => AdParcel) private adParcels;

    // Mapping from owner to array of owned parcel IDs
    mapping(address => uint256[]) private ownerParcels;

    // Mapping from renter to array of rented parcel IDs
    mapping(address => uint256[]) private renterParcels;

    // Mapping to store locked funds for each renter
    mapping(address => uint256) private renterFunds;

    // Global array to store all parcel IDs
    uint256[] private allParcels;

    error Lemonads__ParcelNotFound();
    error Lemonads__UnsufficientFundsLocked();
    error Lemonads__NotZero();
    error Lemonads__TransferFailed();
    error Lemonads__BidLowerThanCurrent();
    error Lemonads__NotParcelOwner();

    // Events
    event AdParcelCreated(
        uint256 indexed parcelId,
        address indexed owner,
        uint256 minBid
    );
    event MinBidUpdated(uint256 indexed parcelId, uint256 newMinBid);
    event AdParcelRented(
        uint256 indexed parcelId,
        address indexed renter,
        uint256 bid
    );
    event FundsAdded(address indexed renter, uint256 amount);
    event FundsWithdrawn(address indexed renter, uint256 amount);

    modifier onlyAdParcelOwner(uint256 _parcelId) {
        _ensureAdParcelOwnership(_parcelId);
        _;
    }

    // Function to create a new ad parcel
    function createAdParcel(
        uint256 _parcelId,
        uint256 _minBid,
        string calldata _traitsHash,
        string calldata _websiteInfoHash
    ) external {
        adParcels[_parcelId] = AdParcel({
            bid: 0,
            minBid: _minBid,
            owner: msg.sender,
            renter: address(0),
            active: true,
            metadataHash: _traitsHash,
            websiteInfoHash: _websiteInfoHash,
            contentHash: ""
        });

        ownerParcels[msg.sender].push(_parcelId);
        allParcels.push(_parcelId);

        emit AdParcelCreated(_parcelId, msg.sender, _minBid);
    }

    // Function to place a bid and rent an ad parcel
    function rentAdParcel(
        uint256 _parcelId,
        uint256 _newBid,
        string calldata _contentHash
    ) external payable {
        AdParcel storage adParcel = adParcels[_parcelId];

        if (adParcel.owner == address(0)) {
            revert Lemonads__ParcelNotFound();
        }

        if (_newBid < adParcel.bid) {
            revert Lemonads__BidLowerThanCurrent();
        }

        renterFunds[msg.sender] += msg.value;

        if (
            renterFunds[msg.sender] < (adParcel.bid * MIN_CLICK_AMOUNT_COVERED)
        ) {
            revert Lemonads__UnsufficientFundsLocked();
        }

        // Remove the parcel from the previous renter's list if applicable
        if (adParcel.renter != address(0)) {
            _removeAdRentedParcel(adParcel.renter, _parcelId);
        }

        adParcel.bid = _newBid;
        adParcel.renter = msg.sender;
        adParcel.contentHash = _contentHash;
        renterParcels[msg.sender].push(_parcelId);

        emit AdParcelRented(_parcelId, msg.sender, _newBid);
    }

    // Function to update the minimum bid of an ad parcel
    function updateMinBid(
        uint256 _parcelId,
        uint256 _minBid
    ) external onlyAdParcelOwner(_parcelId) {
        adParcels[_parcelId].minBid = _minBid;

        emit MinBidUpdated(_parcelId, _minBid);
    }

    // Function to add funds to the renter's account
    function addFunds() external payable {
        if (msg.value == 0) {
            revert Lemonads__NotZero();
        }

        renterFunds[msg.sender] += msg.value;

        emit FundsAdded(msg.sender, msg.value);
    }

    // Function to withdraw funds from the renter's account
    function withdrawFunds(uint256 _amount) external {
        if (_amount > renterFunds[msg.sender]) {
            revert Lemonads__UnsufficientFundsLocked();
        }

        renterFunds[msg.sender] -= _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        if (!success) {
            revert Lemonads__TransferFailed();
        }

        emit FundsWithdrawn(msg.sender, _amount);
    }

    function closeParcel(
        uint256 _parcelId
    ) external onlyAdParcelOwner(_parcelId) {
        AdParcel storage adParcel = adParcels[_parcelId];
        adParcel.active = false;
        adParcel.bid = 0;
        adParcel.renter = address(0);
        adParcel.websiteInfoHash = "";
    }

    // Internal function to remove a parcel from the renter's list
    function _removeAdRentedParcel(
        address _renter,
        uint256 _parcelId
    ) internal {
        uint256[] storage parcels = renterParcels[_renter];
        for (uint256 i = 0; i < parcels.length; i++) {
            if (parcels[i] == _parcelId) {
                parcels[i] = parcels[parcels.length - 1];
                parcels.pop();
                break;
            }
        }
    }

    function _ensureAdParcelOwnership(uint256 _parcelId) internal view {
        if (adParcels[_parcelId].owner != msg.sender) {
            revert Lemonads__NotParcelOwner();
        }
    }

    function getAdParcelById(
        uint256 _parcelId
    ) external view returns (AdParcel memory) {
        return adParcels[_parcelId];
    }

    // Function to get all parcels owned by a user
    function getOwnerParcels(
        address _owner
    ) external view returns (uint256[] memory) {
        return ownerParcels[_owner];
    }

    // Function to get all parcels rented by a user
    function getRenterParcels(
        address _renter
    ) external view returns (uint256[] memory) {
        return renterParcels[_renter];
    }

    // Function to get all parcels globally
    function getAllParcels() external view returns (uint256[] memory) {
        return allParcels;
    }

    function getParcelMetadataHash(
        uint256 _parcelId
    ) external view returns (string memory) {
        return adParcels[_parcelId].metadataHash;
    }

    // Function to get the website info hash of a specific ad parcel
    function getWebsiteInfoHash(
        uint256 _parcelId
    ) external view returns (string memory) {
        return adParcels[_parcelId].websiteInfoHash;
    }

    // Function to get the content hash of a specific ad parcel
    function getContentHash(
        uint256 _parcelId
    ) external view returns (string memory) {
        return adParcels[_parcelId].contentHash;
    }

    // Function to check if a specific ad parcel is active
    function isParcelActive(uint256 _parcelId) external view returns (bool) {
        return adParcels[_parcelId].active;
    }
}
