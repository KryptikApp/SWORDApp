import { NetworkDb, TokenDb } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { PricesDict } from "../../../src/helpers/coinGeckoHelper";
import { KryptikFetch } from "../../../src/kryptikFetch";

type Data = {
  prices: PricesDict | null;
  msg?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get data submitted in request's body.
  try {
    const fetchRes = await KryptikFetch(
      "https://www.kryptik.app/api/prices/all",
      {
        method: "GET",
        timeout: 8000,
        headers: { "Content-Type": "application/json" },
      }
    );
    const pricesDict: PricesDict | null | undefined = fetchRes.data.prices;
    if (!pricesDict) throw new Error("Prices dictionary response undefined.");
    return res
      .status(200)
      .json({ prices: pricesDict, msg: "Prices have been updated." });
  } catch (e: any) {
    return res.status(400).json({ prices: null, msg: `${e.message}` });
  }
}

function getAllIds(networks: NetworkDb[], tokens: TokenDb[]) {
  const ids = [];
  for (const nw of networks) {
    ids.push(nw.coingeckoId);
  }
  for (const token of tokens) {
    ids.push(token.coingeckoId);
  }
  return ids;
}
