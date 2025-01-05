import { createSession } from "@/database/operations/session";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default verifyUser(async function CreateSession(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type !== "teacher") {
            return res.status(403).json({msg: "Only teachers may create sessions"})
        }

        const url_name = req.body.name.toLowerCase().replace(/\s/g, "_")

        const session = await createSession({
            teacherId: req.body.jwtUser.id,
            name: req.body.name,
            url_name
        })

        if (!session) {
            return res.status(409).json({msg: "Session with this name already exists"})
        }

        return res.status(200).json({msg: "Success", url_name})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})