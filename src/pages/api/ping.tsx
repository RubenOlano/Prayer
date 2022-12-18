import { NextApiHandler } from "next";
import { env } from "../../env/server.mjs";

const handler: NextApiHandler = (req, res) => {
  // Check if the request has the correct headers
  const { headers } = req;
  if (headers["secret-key"] !== env.JWT_SECRET) return res.status(401).json({ error: "Invalid secret key" });
  // Get the current time
  const time = new Date().toLocaleDateString();

  res.status(200).json({ time });
};

export default handler;
