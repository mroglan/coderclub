import { Student } from "@/database/interfaces/Student";
import { getStudentFromNameAndSessionUrlName } from "@/database/operations/student";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { setCookie } from "nookies";
import { sessionNameToUrlName } from "@/utils/session";

export default async function JoinSession(req: NextApiRequest, res: NextApiResponse) {

    try {

        if (req.method !== "POST") {
            return res.status(400).json({msg: "Invalid request method"})
        }

        const url_name = sessionNameToUrlName(req.body.session)

        const student: {data: Student} = await getStudentFromNameAndSessionUrlName(req.body.name, url_name)

        if (!student.data) {
            return res.status(409).json({msg: "We couldn't find your name in that session!"})
        }

        const token = jwt.sign(
            {
                name: student.data.name,
                sessionId: student.data.sessionId,
                sessionUrlName: url_name, // useful for redirects
                type: "student",
                id: student.data.id
            },
            process.env.JWT_TOKEN_SIGNATURE,
            {expiresIn: '24hr'}
        )

        setCookie({res}, "user-auth", token, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: true,
            maxAge: 172800, // 48 hours
            path: '/'
        })

        return res.status(200).json({msg: "Success"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: "Internal server error"})
    }
}