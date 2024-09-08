# Lemonads - Decentralized Ad Platform

Welcome to the Lemonads repository! This project is a decentralized ad platform built using **Next.js** for the frontend, **Web3Auth** for authentication, **Chainlink Functions** for automation and price feeds, and **AWS Rekognition** for content moderation. Our solution provides a seamless experience for publishers and advertisers to engage with ad parcels via bidding, real-time data, and reliable content moderation.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [License](#license)

## Project Overview

Lemonads is a decentralized platform where **publishers** can register their websites, link their Google Analytics, and offer **ad parcels** on which **advertisers** can bid. Advertisers can upload content (images, links, descriptions), moderated by AWS Rekognition, ensuring a safe and auditable ad experience. Once content is approved, advertisers bid on available parcels using a smart contract-based system.

The app automates the key processes like tracking ad clicks, notifying advertisers of low funds, and calculating payments—all powered by **Chainlink Functions** and **Chainlink Automation**.

## Features

- **Chainlink Functions** to gather click data and automate notifications.
- **AWS Rekognition** for ad content moderation.
- **Google Analytics Integration** for accurate publisher tracking.
- **Web3Auth** for easy sign-in using Google, Discord, X, or Metamask.
- **Next.js** as the core web framework.
- **TailwindCSS** for sleek and responsive UI.
- **Smart Contract Bidding** for transparent and decentralized ad campaigns.

## Tech Stack

This project is built on a combination of modern web and blockchain technologies:

- **Next.js** 14.2.6 (Frontend)
- **Web3Auth** for user authentication
- **Firebase Admin** (Backend services)
- **AWS SDK** (for Rekognition API)
- **Chainlink Functions and Price Feeds**
- **Google Analytics** (via the @google-analytics/data package)
- **Recharts** (Data visualization)
- **TailwindCSS** (Styling)
- **Wagmi & Viem** (Web3 interaction)

## Installation

Follow these steps to install and set up the project on your local machine.

### Prerequisites

You’ll need the following software:

- **Node.js** (>= 18.x)
- **npm** or **yarn**
- **Firebase Admin credentials** (for server management)
- **AWS Credentials** (for Rekognition)
- **Google Analytics credentials** (for data fetching)
- **Web3Auth credentials** (for authentication)
- **Chainlink VRF credentials** (for smart contract interaction)

### Clone the repository

```bash
git clone https://github.com/Wakushi/lemonads-app
cd lemonads-app
```

### Install Dependencies

```bash
npm install
# OR
yarn install
```

### Environment Variables

Create a `.env.local` file at the root of the project and add the following environment variables:

```env
# Base API and URL settings
NEXT_PUBLIC_BASE_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Web3Auth configuration
NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID=REPLACE_WITH_WEB3_AUTH_CLIENT_ID

# Alchemy RPC settings
NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Firebase Admin SDK credentials
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----

# Pinata JWT token
PINATA_JWT=your-pinata-jwt-token

# Wallet private key
PRIVATE_KEY=your-wallet-private-key

# API Secret key
SECRET=your-secret-key

# SMTP settings
EMAIL_PASS=your-smtp-password

# Google Analytics credentials
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMOCK_GOOGLE_PRIVATE_KEY\n-----END PRIVATE KEY-----
GOOGLE_CLIENT_EMAIL=google-analytics@your-google-project.iam.gserviceaccount.com

# AWS Credentials
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
```

## Key Features

    •	Publishers: Can register websites, bind analytics, and create ad parcels.
    •	Advertisers: Can browse the marketplace, bid on parcels, and upload ad content.
    •	Smart Contracts: Handle bidding, payments, and notifications using Chainlink.
    •	Real-Time Data: Integrated with Google Analytics for accurate reporting.

# License

This project is licensed under the MIT License.
