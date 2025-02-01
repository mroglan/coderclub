import { NextApiResponse, NextApiRequest } from "next";
import bcrypt from 'bcryptjs'
// import { createUser } from "../../database/operations/user";
import { createTeacher } from "@/database/operations/teacher"

// export default async function TmpNewUser(req:NextApiRequest, res:NextApiResponse) {
//     return res.json({msg: 'hello world'})
// }

// The following should only be uncommented for creating a new initail user/admin
// THIS SHOULD NOT BE USED IN PRODUCTION
export default async function TmpNewTeacher(req:NextApiRequest, res:NextApiResponse) {

    console.log(process.env.NEW_USER_PASSWORD)

    const data = {
        email: 'manueljoseph113@gmail.com',
        password: process.env.NEW_USER_PASSWORD
    }

    const hashedPassword = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    }).catch(err => {
        throw(err)
    })

    data.password = hashedPassword

    await createTeacher(data)

    return res.json({msg: 'Created teacher account'})
}