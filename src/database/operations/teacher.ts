import client from "../fauna"
import { query as q } from "faunadb"

import { S_Teacher, S_TeacherData } from "../interfaces/Teacher"

class InnerQueries {

    static existsTeacherWithEmail(email:string) {
        return q.Exists(q.Match(q.Index('teacher_by_email'), email))
    }
}


interface CreateTeacherData extends Omit<S_TeacherData, "sessions"> {}


export async function createTeacher(data: CreateTeacherData) {

    return await client.query(
        q.If(
            InnerQueries.existsTeacherWithEmail(data.email),
            null,
            q.Create(q.Collection("teacher"), {data: {...data, sessions: []}})
        )
    )
}


export async function getTeacherFromEmail(email:string) {

    return await client.query(
        q.If(
            InnerQueries.existsTeacherWithEmail(email),
            q.Get(q.Match(q.Index('teacher_by_email'), email)),
            null
        )
    ) as S_Teacher
}


export async function getTeacher(id: string) {

    return await client.query(q.Get(q.Ref(q.Collection('teacher'), id))) as S_Teacher
}


export async function getTeacherSessionDashboardInfo(teacherId: string, url_name: string) {

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index("session_by_url_name"), url_name)),
            q.Let(
                {
                    session: q.Get(q.Match(q.Index("session_by_url_name"), url_name))
                },
                q.If(
                    q.Equals(q.Select(["data", "teacherId"], q.Var("session")), teacherId),
                    q.Var("session"),
                    null
                )
            ),
            null
        )
    )
}