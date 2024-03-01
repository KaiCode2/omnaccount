// 1. Get post request with an address field
// 2. get balances of those users across all chains that we support
// 3. combine token balances
// 4. return after

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { MoralisNextApi } from "@moralisweb3/next";

const supportedChains = ["Sepolia", "Arbitrum Sepolia", "Optimism Sepolia"];
const apiKey = process.env.MORALIS_API_KEY;

interface BalanceResponse {
  chain: string;
  balance: string | number;
}

interface PostData {
  address: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      throw new Error("Method Not Allowed");
    }

    const { address }: PostData = req.body;
    if (!address) {
      throw new Error("Address field is required");
    }

    const balances = await Promise.all(
      supportedChains.map(async (chain) => {
        try {
          const response = await axios.get<BalanceResponse>(
            `https://your-api-endpoint.com/balance?chain=${chain}&address=${address}`
          );
          return { chain, balance: response.data.balance };
        } catch (error) {
          return { chain, balance: "Error fetching balance" };
        }
      })
    );

    let totalBalance = 0;
    balances.forEach((balance) => {
      if (typeof balance.balance === "number") {
        totalBalance += balance.balance;
      }
    });

    res.status(200).json({ balances, totalBalance });
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;

const userAddress = "0x123";
const postData = { address: userAddress };

fetch("/packages/.env", {
  method: "POST",
  headers: {
    "X-API-Key": apiKey,
  },
  body: JSON.stringify(postData),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
