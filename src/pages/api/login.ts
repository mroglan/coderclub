import { NextApiRequest, NextApiResponse } from "next";
import { getTeacherFromEmail } from "../../database/operations/teacher";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

export default async function Login(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method'})
    }

    try {

        const {email, password} = req.body

        const teacher = await getTeacherFromEmail(email)

        if (!teacher) {
            return res.status(409).json({field: 'email', msg: 'Email not found.'})
        }

        if (!teacher.data.password) {
            return res.status(401).json({msg: 'Need to set up account.'})
        }

        const isCorrectPassword = await new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(password, teacher.data.password, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        }).catch(e => {
            throw e
        })

        if (!isCorrectPassword) {
            return res.status(409).json({field: 'password', msg: 'Incorrect password.'})
        }

        const token = jwt.sign(
            {email, type: "teacher", id: teacher.ref.id, sessions: teacher.data.sessions},
            process.env.JWT_TOKEN_SIGNATURE,
            {expiresIn: '48hr'}
        )

        setCookie({res}, 'user-auth', token, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: true,
            maxAge: 172800, // 48 hours
            path: '/'
        })

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}