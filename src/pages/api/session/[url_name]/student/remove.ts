import { CreateStudentByTeacher, RemoveStudentByTeacher } from "@/database/operations/student";
import { verifyUser } from "@/utils/auth";
import { NextApiRequest, NextApiResponse } from "next";


export default verifyUser(async function RemoveStudent(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        if (req.body.jwtUser.type !== "teacher") {
            return res.status(403).json({msg: "Only teachers may remove students"})
        }

        const byebye = await RemoveStudentByTeacher(req.body.jwtUser.id, req.query.url_name as string, req.body.studentId)

        if (!byebye) {
            return res.status(409).json({msg: "Error removing student"})
        }

        return res.status(200).json({msg: "Success"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
})