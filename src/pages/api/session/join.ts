import { NextApiRequest, NextApiResponse } from "next";

export default async function JoinSession(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        const url_name = req.body.session.toLowerCase().replace(/\s/g, "_")


        return res.status(200).json("success")
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
}