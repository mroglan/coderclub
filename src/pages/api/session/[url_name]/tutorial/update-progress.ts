import { CreateSessionTutorialByTeacher, UpdateSessionTutorialByTeacher } from "@/database/operations/sessionTutorial";
import { updateStudentTutorialProgress } from "@/database/operations/studentTutorialProgress";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function UpdateProgress(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type === "teacher") {
            req.body.data.teacherId = req.body.jwtUser.id
            req.body.data.studentId = ""
        } else {
            req.body.data.teacherId = ""
            req.body.data.studentId = req.body.jwtUser.id
            if (req.body.jwtUser.sessionId !== req.body.data.sessionId) {
                return res.status(409).json({msg: "Invalid session"})
            }
        }

        const data = await updateStudentTutorialProgress(req.body.data, req.body.jwtUser.type) 

        return res.status(200).json({result: data})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})