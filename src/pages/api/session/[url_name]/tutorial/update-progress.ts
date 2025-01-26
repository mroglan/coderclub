import { CreateSessionTutorialByTeacher, UpdateSessionTutorialByTeacher } from "@/database/operations/sessionTutorial";
import { updateStudentTutorialProgress } from "@/database/operations/studentTutorialProgress";
import { updateTutorialProgress } from "@/database/operations/tutorialProgress";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function UpdateProgress(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type === "student" && req.body.jwtUser.sessionId !== req.body.sessionId) {
            return res.status(409).json({msg: "Invalid session"})
        }

        // const data = await updateStudentTutorialProgress(req.body.data, req.body.jwtUser.type) 
        const data = await updateTutorialProgress(
            req.body.jwtUser.type,
            req.body.jwtUser.id,
            req.body.sessionId,
            req.body.tutorialName,
            req.body.stepName,
            req.body.code
        )

        return res.status(200).json({result: data})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})