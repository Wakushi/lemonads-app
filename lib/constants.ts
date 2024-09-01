export const PINATA_GATEWAY_BASE_URL =
  "https://peach-genuine-lamprey-766.mypinata.cloud/ipfs"

export const BASE_ETHERSCAN_TX_URL = "https://sepolia.basescan.org/tx"

export const CONTACT_EMAIL = "zoukushimetazord@gmail.com"

export const LEMONADS_CONTRACT_ADDRESS =
  "0x49878912A6A6A376C161CCd029705A40D81992a9"

export const LEMONADS_CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_functionsRouter",
        type: "address",
        internalType: "address",
      },
      { name: "_donId", type: "bytes32", internalType: "bytes32" },
      {
        name: "_functionsSubId",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "_clickAggregatorSource",
        type: "string",
        internalType: "string",
      },
      {
        name: "_notificationSource",
        type: "string",
        internalType: "string",
      },
      { name: "_secretReference", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MIN_CLICK_AMOUNT_COVERED",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_INTERVAL_BETWEEN_CRON",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addFunds",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "aggregateClicks",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closeParcel",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAdParcel",
    inputs: [
      { name: "_parcelId", type: "uint256", internalType: "uint256" },
      { name: "_minBid", type: "uint256", internalType: "uint256" },
      { name: "_traitsHash", type: "string", internalType: "string" },
      {
        name: "_websiteInfoHash",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAdParcelById",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Lemonads.AdParcel",
        components: [
          { name: "bid", type: "uint256", internalType: "uint256" },
          { name: "minBid", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          { name: "renter", type: "address", internalType: "address" },
          {
            name: "traitsHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "contentHash",
            type: "string",
            internalType: "string",
          },
          {
            name: "websiteInfoHash",
            type: "string",
            internalType: "string",
          },
          { name: "active", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllParcels",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getClickPerAdParcel",
    inputs: [{ name: "_adParcelId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getContentHash",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLastCronTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOwnerParcels",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getParcelTraitsHash",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPayableAdParcels",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRenterFundsAmount",
    inputs: [{ name: "_renter", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRenterParcels",
    inputs: [{ name: "_renter", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWebsiteInfoHash",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "handleOracleFulfillment",
    inputs: [
      { name: "requestId", type: "bytes32", internalType: "bytes32" },
      { name: "response", type: "bytes", internalType: "bytes" },
      { name: "err", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isParcelActive",
    inputs: [{ name: "_parcelId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payParcelOwners",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rentAdParcel",
    inputs: [
      { name: "_parcelId", type: "uint256", internalType: "uint256" },
      { name: "_newBid", type: "uint256", internalType: "uint256" },
      { name: "_contentHash", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMinBid",
    inputs: [
      { name: "_parcelId", type: "uint256", internalType: "uint256" },
      { name: "_minBid", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateSecretReference",
    inputs: [
      { name: "_secretReference", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateTraits",
    inputs: [
      { name: "_parcelId", type: "uint256", internalType: "uint256" },
      { name: "_traitsHash", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateWebsite",
    inputs: [
      { name: "_parcelId", type: "uint256", internalType: "uint256" },
      {
        name: "_websiteInfoHash",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawFunds",
    inputs: [{ name: "_amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AdParcelCreated",
    inputs: [
      {
        name: "parcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "minBid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AdParcelPaid",
    inputs: [
      {
        name: "adParcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "renter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "renterFunds",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AdParcelRented",
    inputs: [
      {
        name: "parcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "renter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "bid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChainlinkRequestSent",
    inputs: [
      {
        name: "requestId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClickAggregated",
    inputs: [
      {
        name: "requestId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FundsAdded",
    inputs: [
      {
        name: "renter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FundsWithdrawn",
    inputs: [
      {
        name: "renter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LowFunds",
    inputs: [
      {
        name: "adParcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "renter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "renterFunds",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinBidUpdated",
    inputs: [
      {
        name: "parcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newMinBid",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ParcelPaymentFailed",
    inputs: [
      {
        name: "adParcelId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RenterNotified",
    inputs: [
      {
        name: "requestId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RenterRemovedFromParcel",
    inputs: [
      {
        name: "adParcelId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RequestFulfilled",
    inputs: [
      {
        name: "id",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RequestSent",
    inputs: [
      {
        name: "id",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SentRequestForNotifications",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "TraitsUpdated",
    inputs: [
      {
        name: "parcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "traitsHash",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WebsiteInfoUpdated",
    inputs: [
      {
        name: "parcelId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "websiteInfoHash",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "EmptyArgs", inputs: [] },
  { type: "error", name: "EmptySource", inputs: [] },
  { type: "error", name: "Lemonads__BidLowerThanCurrent", inputs: [] },
  { type: "error", name: "Lemonads__NoPayableParcel", inputs: [] },
  { type: "error", name: "Lemonads__NotEnoughTimePassed", inputs: [] },
  { type: "error", name: "Lemonads__NotParcelOwner", inputs: [] },
  { type: "error", name: "Lemonads__NotZero", inputs: [] },
  {
    type: "error",
    name: "Lemonads__NotificationListEmpty",
    inputs: [],
  },
  {
    type: "error",
    name: "Lemonads__ParcelAlreadyCreatedAtId",
    inputs: [{ name: "parcelId", type: "uint256", internalType: "uint256" }],
  },
  { type: "error", name: "Lemonads__ParcelNotFound", inputs: [] },
  { type: "error", name: "Lemonads__TransferFailed", inputs: [] },
  {
    type: "error",
    name: "Lemonads__UnsufficientFundsLocked",
    inputs: [],
  },
  { type: "error", name: "NoInlineSecrets", inputs: [] },
  { type: "error", name: "OnlyRouterCanFulfill", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "StringsInsufficientHexLength",
    inputs: [
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "length", type: "uint256", internalType: "uint256" },
    ],
  },
]
