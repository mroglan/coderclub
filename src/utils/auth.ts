import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies"
import jwt from "jsonwebtoken"
import axios from "axios";
import Router from "next/router"

import { S_Teacher } from "../database/interfaces/Teacher"
import { getTeacher } from "@/database/operations/teacher";


type User = S_Teacher | null;

interface AuthToken {
    id: string;
    type: "teacher" | "student";
    email?: string;
}


function decodeToken(auth: string) {
    return new Promise<AuthToken|null>((res, rej) => {
        jwt.verify(auth, process.env.JWT_TOKEN_SIGNATURE, (err, decoded) => {
            if (!err && decoded) res(decoded as AuthToken)
            res(null)
        })
    })
}


async function getAuthTokenFromCtx(ctx: GetServerSidePropsContext) {

    const auth = parseCookies(ctx)["user-auth"]

    if (!auth) return null

    return decodeToken(auth)
}


export async function getUserFromCtx(ctx: GetServerSidePropsContext, disallowed?: string[]): Promise<{user: User|null, redirect: GetServerSidePropsResult<any>|null}> {

    const token = await getAuthTokenFromCtx(ctx)

    if (!token) {
        return {
            user: null,
            redirect: {props: {}, redirect: {destination: "/", permanent: false}}
        }
    }

    const destination = token.type == "teacher" ? "/login" : "/"

    try {

        if (disallowed && token.type in disallowed) {
            console.log(`${token.type} type not allowed.`)
            return {
                user: null,
                redirect: {props: {}, redirect: {destination, permanent: false}}
            }
        }

        const user: User = token.type == "teacher" ? await getTeacher(token.id) : null

        if (!user) {
            throw new Error("No user found")
        }

        return {user, redirect: null}
    } catch (e) {
        return {
            user: null,
            redirect: {props: {}, redirect: {destination: "/", permanent: false}}
        }
    }
}


export async function mustNotBeAuthenticated(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>|null> {
    
    const token = await getAuthTokenFromCtx(ctx)

    if (!token) return null

    const destination = token.type == "teacher" ? "/session" : "/"

    return {props: {}, redirect: {destination, permanent: false}}
}


export function verifyUser(fn: NextApiHandler) {
    return (req: NextApiRequest, res: NextApiResponse) => {
        return new Promise<void>(resolve => {
            decodeToken(req.cookies["user-auth"] || "").then(async (authToken) => {
                if (!authToken) {
                    res.status(403).json({msg: 'YOU CANNOT PASS'})
                    return resolve()
                }
                if (req.method !== 'GET') {
                    req.body.jwtUser = authToken
                }
                await fn(req, res)
                return resolve()
            }).catch(() => {
                res.status(500).json({msg: 'Authentication processing error'})
                return resolve()
            })
        })
    }
}



export async function logout() {
    try {

        await axios({
            method: "POST",
            url: "/api/logout"
        })

        Router.push({
            pathname: "/"
        })

    } catch (e) {
        console.log(e)
    }
}