import { CreateSessionTutorialByTeacher } from "@/database/operations/sessionTutorial";
import { CreateStudentByTeacher } from "@/database/operations/student";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function AddTutorial(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type !== "teacher") {
            return res.status(403).json({msg: "Only teachers may add tutorials"})
        }

        const tutorial = await CreateSessionTutorialByTeacher(req.body.jwtUser.id, req.query.url_name as string, req.body.name)

        if (!tutorial) {
            return res.status(409).json({msg: "Error adding student"})
        }

        return res.status(200).json({tutorial: tutorial})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})