import { CreateSessionTutorialByTeacher, UpdateSessionTutorialByTeacher } from "@/database/operations/sessionTutorial";
import { getStudentTutorialProgress, updateTutorialProgress } from "@/database/operations/tutorialProgress";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function StudentProgress(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "GET") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        console.log(req.query.studentId)
        console.log(req.query.sessionId)
        console.log(req.query.tutorialName)

        const tutorialProgress = await getStudentTutorialProgress(req.query.studentId as string, 
            req.query.sessionId as string, req.query.tutorialName as string)

        return res.status(200).json({tutorialProgress})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})