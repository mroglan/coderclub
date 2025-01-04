import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies"
import jwt from "jsonwebtoken"

import { S_Teacher } from "../database/interfaces/Teacher"
import { getTeacher } from "@/database/operations/teacher";


type User = S_Teacher | null;

interface AuthToken {
    id: string;
    type: "teacher" | "student";
    email?: string;
}


async function getAuthTokenFromCtx(ctx: GetServerSidePropsContext) {

    const auth = parseCookies(ctx)["user-auth"]

    if (!auth) return null

    return new Promise<AuthToken|null>((res, rej) => {
        jwt.verify(auth, process.env.JWT_TOKEN_SIGNATURE, (err, decoded) => {
            if (!err && decoded) res(decoded as AuthToken)
            res(null)
        })
    })
}


export async function getUserFromCtx(ctx: GetServerSidePropsContext, disallowed?: string[]): Promise<{user: User|null, redirect: GetServerSidePropsResult<any>|null}> {

    const token = await getAuthTokenFromCtx(ctx)
    
    console.log('token', token)

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