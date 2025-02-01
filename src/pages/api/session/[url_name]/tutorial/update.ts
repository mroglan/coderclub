import { CreateSessionTutorialByTeacher, UpdateSessionTutorialByTeacher } from "@/database/operations/sessionTutorial";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function UpdateTutorial(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type !== "teacher") {
            return res.status(403).json({msg: "Only teachers may update tutorials"})
        }

        const tutorial = await UpdateSessionTutorialByTeacher(req.body.id, req.body.jwtUser.id, req.body.sessionId as string, req.body.name, req.body.data)

        if (!tutorial) {
            return res.status(409).json({msg: "Error updating tutorial"})
        }

        return res.status(200).json({msg: "Success"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})