import client from "../fauna"
import { Expr, query as q } from "faunadb"
import { fql } from "fauna"
import { InnerQueries as SessionInnerQueries } from "./session";
import { InnerQueries as SessionTutorialInnerQueries } from "./sessionTutorial"
import { S_Student } from "../interfaces/Student";
import { StudentFromJWT } from "@/utils/auth";
import { S_Session } from "../interfaces/Session";
import { S_SessionTutorial } from "../interfaces/SessionTutorial";

interface CreateStudentData {
    name: string;
    sessionId: string;
}


export class InnerQueries {

    static sessionWithTeacherValidatedWrapper(teacherId: string, session_url_name: string, query: any) {
        return (
            q.If(
                SessionInnerQueries.existsSessionWithUrlName(session_url_name),
                q.Let(
                    {
                        session: q.Get(q.Match(q.Index("session_by_url_name"), session_url_name))
                    },
                    q.If(
                        q.Equals(q.Select(["data", "teacherId"], q.Var("session")), teacherId),
                        query,
                        null
                    )
                ),
                null
            )
        )
    }

    static existsStudentWithSessionId(studentName: string, sessionId: string|Expr) {
        return q.Exists(q.Match(q.Index("student_by_name_sessionId"), [studentName, sessionId]))
    }
}


export async function CreateStudentByTeacher(teacherId: string, session_url_name: string, data: CreateStudentData) {

    // return await client.query(
    //     InnerQueries.sessionWithTeacherValidatedWrapper(
    //         teacherId, 
    //         session_url_name,
    //         q.Create(
    //             q.Collection("student"),
    //             {data: {...data, sessionId: q.Select(["ref", "id"], q.Var("session"))}}
    //         )
    //     )
    // ) as S_Student

    // TODO: add back validation that I removed during fauna's stupid decomission
    return await client.query(
        fql`
            student.create({
                name: ${data.name},
                sessionId: ${data.sessionId} 
            }) 
        `
    )

}


export async function RemoveStudentByTeacher(teacherId: string, session_url_name: string, studentId: string) {

    // return await client.query(
    //     InnerQueries.sessionWithTeacherValidatedWrapper(
    //         teacherId,
    //         session_url_name,
    //         q.Delete(q.Ref(q.Collection("student"), studentId))
    //     )
    // )
    

    // TODO: add back validation that I removed during fauna's stupid decomission
    return await client.query(
        fql`
            student.byId(${studentId})!.delete()
        `
    )
}


export async function getStudentFromNameAndSessionUrlName(studentName: string, session_url_name: string) {

    // return await client.query(
    //     q.If(
    //         SessionInnerQueries.existsSessionWithUrlName(session_url_name),
    //         q.Let(
    //             {
    //                 sessionId: q.Select([0, "id"], q.Paginate(q.Match(q.Index("session_by_url_name"), session_url_name)))
    //             },
    //             q.If(
    //                 InnerQueries.existsStudentWithSessionId(studentName, q.Var("sessionId")),
    //                 q.Let(
    //                     {
    //                         student: q.Get(q.Match(q.Index("student_by_name_sessionId"), [studentName, q.Var("sessionId")]))
    //                     },
    //                     q.If(
    //                         q.Equals(q.Var("sessionId"), q.Select(["data", "sessionId"], q.Var("student"))),
    //                         q.Var("student"),
    //                         null
    //                     )
    //                 ),
    //                 null
    //             )
    //         ),
    //         null
    //     )
    // ) as S_Student

    return await client.query(
        fql`
            let s = tSession.byUrlName(${session_url_name}).first()

            if (s != null) {
                student.bySessionIdAndName(s!.id.toString(), ${studentName}).first()
            }
        `
    )
}


export async function getStudentSessionDashboardInfo(studentJWT: StudentFromJWT, sessionUrlName: string) {

    if (sessionUrlName !== studentJWT.sessionUrlName) return null

    // return await client.query(
    //     q.If(
    //         SessionInnerQueries.existsSessionWithUrlName(sessionUrlName),
    //         {
    //             session: q.Get(q.Match(q.Index("session_by_url_name"), sessionUrlName)),
    //             tutorials: q.Select("data", q.Map(
    //                 q.Paginate(q.Match(q.Index("sessionTutorial_by_sessionId"), studentJWT.sessionId)),
    //                 q.Lambda(
    //                     "tutorialRef",
    //                     q.Get(q.Var("tutorialRef"))
    //                 )
    //             ))
    //         },
    //         null
    //     )
    // ) as {
    //     session: S_Session;
    //     tutorials: S_SessionTutorial[];
    // }

    return await client.query(
        fql`
            let s = tSession.byUrlName(${sessionUrlName}).first()
            let tutorials = sessionTutorial.bySessionId(s!.id.toString())
            {
                "session": s,
                "tutorials": tutorials
            }
        `
    )
}


export async function getStudentTutorialInfo(studentJWT: StudentFromJWT, tutorialName: string) {

    // return await client.query(
    //     q.If(
    //         SessionTutorialInnerQueries.existsSessionTutorialWithNameAndSessionId(tutorialName, studentJWT.sessionId),
    //         {
    //             tutorial: q.Get(q.Match(q.Index("sessionTutorial_by_sessionId_name"), [studentJWT.sessionId, tutorialName])),
    //             progress: q.If(
    //                 q.Exists(q.Match(q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), [studentJWT.sessionId, tutorialName, studentJWT.id])),
    //                 q.Get(q.Match(q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), [studentJWT.sessionId, tutorialName, studentJWT.id])),
    //                 null
    //             )
    //         },
    //         null
    //     )
    // )

    return await client.query(
        fql`
            let tutorial = sessionTutorial.bySessionIdAndName(${studentJWT.sessionId}, ${tutorialName}).first() 
            let progress = tutorialProgress.studentProgress(${studentJWT.sessionId}, ${tutorialName}, ${studentJWT.id}).first()
            {
                "tutorial": tutorial,
                "progress": progress 
            }
        `
    )
}