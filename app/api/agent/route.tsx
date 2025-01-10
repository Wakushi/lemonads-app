import { processUuid } from "@/lib/actions/server/firebase-actions"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Address, parseEther } from "viem"
import { ethers } from "ethers"

const CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
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
        name: "_decisionSource",
        type: "string",
        internalType: "string",
      },
      {
        name: "_secretReference",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "_nativeToUsdpriceFeed",
        type: "address",
        internalType: "address",
      },
      {
        name: "_serverAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DECISION_TIMEOUT",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDecisionTimestamp",
    inputs: [{ name: "_requestId", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
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
    name: "isPendingDecision",
    inputs: [{ name: "_requestId", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "makeDecision",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "s_decisionTimestamps",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_pendingDecisions",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_serverAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "submitDecision",
    inputs: [
      { name: "_requestId", type: "bytes32", internalType: "bytes32" },
      {
        name: "_action",
        type: "uint8",
        internalType: "enum Viktor.Action",
      },
      { name: "_token", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "updateSecretReference",
    inputs: [
      { name: "_secretReference", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateServerAddress",
    inputs: [{ name: "_newServer", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ChainlinkRequestError",
    inputs: [
      {
        name: "err",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
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
    name: "DecisionRequested",
    inputs: [
      {
        name: "requestId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "wallet",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DecisionSubmitted",
    inputs: [
      {
        name: "requestId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "action",
        type: "uint8",
        indexed: true,
        internalType: "enum Viktor.Action",
      },
      {
        name: "token",
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
    name: "TokenBought",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenSold",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "EmptyArgs", inputs: [] },
  { type: "error", name: "EmptySource", inputs: [] },
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
  {
    type: "error",
    name: "Viktor__DecisionAlreadySubmitted",
    inputs: [],
  },
  { type: "error", name: "Viktor__InvalidRequestId", inputs: [] },
  { type: "error", name: "Viktor__NotEnoughTimePassed", inputs: [] },
  { type: "error", name: "Viktor__RequestTimedOut", inputs: [] },
  { type: "error", name: "Viktor__Unauthorized", inputs: [] },
]

async function handleAnalysis(
  uuid: string,
  owner: Address,
  walletAddress: Address
) {
  try {
    // Simulate complex analysis with delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock decision (replace with your actual analysis logic)
    const decision = {
      action: "BUY",
      token: "0x33A3303eE744f2Fd85994CAe5E625050b32db453",
      amount: parseEther("10").toString(),
    }

    // Connect to contract
    const provider = new ethers.JsonRpcProvider(
      process.env.BASE_SEPOLIA_RPC_URL
    )
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const contract = new ethers.Contract(walletAddress, CONTRACT_ABI, wallet)

    // Convert action to actionId
    const actionId =
      decision.action === "BUY" ? 1 : decision.action === "SELL" ? 2 : 0

    // Submit to contract
    const tx = await contract.submitDecision(
      uuid,
      actionId,
      decision.token,
      decision.amount
    )

    console.log(
      `Decision submitted for UUID ${uuid} (Wallet: ${walletAddress} | Owner: ${owner}). TX: ${tx.hash}`
    )
    await tx.wait()
    console.log("Transaction confirmed")
  } catch (error) {
    console.error("Error in handleAnalysis:", error)
    // Here you might want to implement retry logic
    // or store failed attempts for manual review
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { uuid, owner, wallet } = body

  // Validation
  const authorization = headers().get("authorization")
  const token = authorization && authorization.split(" ")[1]
  const secret = process.env.SECRET

  if (token !== secret) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 })
  }

  if (!owner) {
    return NextResponse.json(
      { message: "Missing owner address" },
      { status: 400 }
    )
  }

  if (!uuid) {
    return NextResponse.json({ message: "Missing uuid" }, { status: 400 })
  }

  try {
    // Process UUID to ensure we only handle each request once
    const success = await processUuid(uuid, async () => {
      console.log(`Received analysis request for UUID ${uuid}, wallet ${owner}`)

      // Start analysis in background without awaiting
      handleAnalysis(uuid, owner, wallet).catch((error) => {
        console.error("Background analysis failed:", error)
      })
    })

    if (!success) {
      return NextResponse.json(
        { message: "Request already processed" },
        { status: 409 }
      )
    }

    // Immediately return acknowledgment
    return NextResponse.json(
      { message: "Analysis initiated", requestId: uuid },
      { status: 202 }
    )
  } catch (error: any) {
    console.error("Error in POST handler:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
