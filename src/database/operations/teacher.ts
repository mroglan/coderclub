import client from "../fauna"
import { fql } from "fauna"
// import { query as q } from "faunadb"

import { S_Teacher, S_TeacherData, Teacher } from "../interfaces/Teacher"
import { S_Session } from "../interfaces/Session"
import { S_Student } from "../interfaces/Student"
import { C_SessionTutorial, S_SessionTutorial } from "../interfaces/SessionTutorial"
import { InnerQueries as SessionInnerQueries } from "./session"

class InnerQueries {

    static existsTeacherWithEmail(email:string) {
        return q.Exists(q.Match(q.Index('teacher_by_email'), email))
    }
}


interface CreateTeacherData extends Omit<S_TeacherData, "sessions"> {}


export async function createTeacher(data: CreateTeacherData) {

    return await client.query(
        fql`
            let exists = teacher.byEmail(${data.email}).first()
            if (exists == null) {
                teacher.create({
                    email: ${data.email},
                    password: ${data.password},
                })
            }
        `
    )
}


export async function getTeacherFromEmail(email:string) {

    // return await client.query(
    //     q.If(
    //         InnerQueries.existsTeacherWithEmail(email),
    //         q.Get(q.Match(q.Index('teacher_by_email'), email)),
    //         null
    //     )
    // ) as S_Teacher
    return await client.query(
        fql`
            teacher.byEmail(${email}).first()
        `
    )
}


export async function getTeacher(id: string) {

    // return await client.query(q.Get(q.Ref(q.Collection('teacher'), id))) as S_Teacher
    return await client.query(
        fql`
            teacher.byId(${id}) 
        `
    )
}


export async function getTeacherSessionDashboardInfo(teacherId: string, url_name: string) {

    // return await client.query(
    //     q.If(
    //         q.Exists(q.Match(q.Index("session_by_url_name"), url_name)),
    //         q.Let(
    //             {
    //                 session: q.Get(q.Match(q.Index("session_by_url_name"), url_name))
    //             },
    //             q.If(
    //                 q.Equals(q.Select(["data", "teacherId"], q.Var("session")), teacherId),
    //                 {
    //                     session: q.Var("session"),
    //                     students: q.Select("data", q.Map(
    //                         q.Paginate(q.Match(q.Index("student_by_sessionId"), q.Select(["ref", "id"], q.Var("session")))),
    //                         q.Lambda(
    //                             "studentRef",
    //                             q.Get(q.Var("studentRef"))
    //                         )
    //                     )),
    //                     tutorials: q.Select("data", q.Map(
    //                         q.Paginate(q.Match(q.Index("sessionTutorial_by_sessionId"), q.Select(["ref", "id"], q.Var("session")))),
    //                         q.Lambda(
    //                             "tutorialRef",
    //                             q.Get(q.Var("tutorialRef"))
    //                         )
    //                     ))
    //                 },
    //                 null
    //             )
    //         ),
    //         null
    //     )
    // ) as {
    //     session: S_Session;
    //     students: S_Student[];
    //     tutorials: S_SessionTutorial[];
    // }

    return await client.query(
        fql`
            let s = tSession.byUrlName(${url_name}).first()
            let id = s!.id.toString()
            if (s!.teacherId == ${teacherId}) {
                let students = student.bySessionId(id).pageSize(30)
                let tutorials = sessionTutorial.bySessionId(id)
                {
                    "session": s,
                    "students": students,
                    "tutorials": tutorials
                }
            }
        `
    )
}


export async function getTeacherTutorialInfo(teacherId: string, sessionUrlName: string, tutorialName: string) {

    return await client.query(
        q.If(
            SessionInnerQueries.existsSessionWithUrlName(sessionUrlName),
            q.Let(
                {
                    session: q.Get(q.Match(q.Index('session_by_url_name'), sessionUrlName))
                },
                q.If(
                    q.Equals(q.Select(["data", "teacherId"], q.Var("session")), teacherId),
                    {
                        tutorial: q.Get(q.Match(q.Index("sessionTutorial_by_sessionId_name"), [q.Select(["ref", "id"], q.Var("session")), tutorialName])),
                        progress: q.If(
                            q.Exists(q.Match(q.Index("tutorialProgress_by_sessionId_tutorialName_teacherId"), [q.Select(["ref", "id"], q.Var("session")), tutorialName, teacherId])),
                            q.Get(q.Match(q.Index("tutorialProgress_by_sessionId_tutorialName_teacherId"), [q.Select(["ref", "id"], q.Var("session")), tutorialName, teacherId])),
                            null
                        ),
                        students: q.Select("data", q.Map(
                            q.Paginate(q.Match(q.Index("student_by_sessionId"), q.Select(["ref", "id"], q.Var("session")))),
                            q.Lambda(
                                "studentRef",
                                q.Get(q.Var("studentRef"))
                            )
                        )),
                        session: q.Var("session")
                    },
                    null
                )
            ),
            null
        )
    )
}