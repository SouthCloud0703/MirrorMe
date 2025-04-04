import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { RequestHandler } from "express";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export const verifyHandler: RequestHandler = async (req, res) => {
  const { payload, action, signal } = req.body as IRequestPayload;
  const app_id = process.env.APP_ID as `app_${string}`;
  
  try {
    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    )) as IVerifyResponse;

    console.log("Verification response:", verifyRes);

    if (verifyRes.success) {
      // Here you could save the verification status in a database
      // along with the user's points if you want persistence
      res.status(200).json({ verifyRes, status: 200 });
      return;
    } else {
      res.status(400).json({ verifyRes, status: 400 });
      return;
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal server error", status: 500 });
    return;
  }
};