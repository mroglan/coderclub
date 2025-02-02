import { CreateSessionTutorialByTeacher, GetSessionTutorial } from "@/database/operations/sessionTutorial";
import { CreateStudentByTeacher } from "@/database/operations/student";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function Tutorial(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "GET") {
            return res.status(400).json({msg: "Invalid request method"})
        }


        const tutorial = await GetSessionTutorial(req.query.tutorialId as string)

        if (!tutorial.data) {
            return res.status(409).json({msg: "Error adding student"})
        }

        return res.status(200).json({tutorial: tutorial.data})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})