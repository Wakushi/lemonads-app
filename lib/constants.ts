export const PINATA_GATEWAY_BASE_URL =
  "https://peach-genuine-lamprey-766.mypinata.cloud/ipfs"

export const SEPOLIA_ETHERSCAN_TX_URL = "https://sepolia.etherscan.io/tx"

export const LEMONADS_CONTRACT_ADDRESS =
  "0xC5e7A8f3699f1691B463651418556c5Af4124A7c"

export const LEMONADS_CONTRACT_ABI = [
  {
    inputs: [],
    name: "addFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "closeParcel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minBid",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_traitsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "_websiteInfoHash",
        type: "string",
      },
    ],
    name: "createAdParcel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "Lemonads__BidLowerThanCurrent",
    type: "error",
  },
  {
    inputs: [],
    name: "Lemonads__NotParcelOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "Lemonads__NotZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "parcelId",
        type: "uint256",
      },
    ],
    name: "Lemonads__ParcelAlreadyCreatedAtId",
    type: "error",
  },
  {
    inputs: [],
    name: "Lemonads__ParcelNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "Lemonads__TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "Lemonads__UnsufficientFundsLocked",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "parcelId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minBid",
        type: "uint256",
      },
    ],
    name: "AdParcelCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "parcelId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
    ],
    name: "AdParcelRented",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "parcelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newMinBid",
        type: "uint256",
      },
    ],
    name: "MinBidUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newBid",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_contentHash",
        type: "string",
      },
    ],
    name: "rentAdParcel",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minBid",
        type: "uint256",
      },
    ],
    name: "updateMinBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "getAdParcelById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "bid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minBid",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "renter",
            type: "address",
          },
          {
            internalType: "string",
            name: "traitsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "websiteInfoHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct Lemonads.AdParcel",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllParcels",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "getContentHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getOwnerParcels",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "getParcelTraitsHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_renter",
        type: "address",
      },
    ],
    name: "getRenterFundsAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_renter",
        type: "address",
      },
    ],
    name: "getRenterParcels",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "getWebsiteInfoHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_parcelId",
        type: "uint256",
      },
    ],
    name: "isParcelActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_CLICK_AMOUNT_COVERED",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
