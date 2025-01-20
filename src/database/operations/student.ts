import client from "../fauna"
import { Expr, query as q } from "faunadb"
import { InnerQueries as SessionInnerQueries } from "./session";
import { S_Student } from "../interfaces/Student";

interface CreateStudentData {
    name: string;
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

    return await client.query(
        InnerQueries.sessionWithTeacherValidatedWrapper(
            teacherId, 
            session_url_name,
            q.Create(
                q.Collection("student"),
                {data: {...data, sessionId: q.Select(["ref", "id"], q.Var("session"))}}
            )
        )
    ) as S_Student
}


export async function RemoveStudentByTeacher(teacherId: string, session_url_name: string, studentId: string) {

    return await client.query(
        InnerQueries.sessionWithTeacherValidatedWrapper(
            teacherId,
            session_url_name,
            q.Delete(q.Ref(q.Collection("student"), studentId))
        )
    )
}


export async function getStudentFromNameAndSessionUrlName(studentName: string, session_url_name: string) {

    return await client.query(
        q.If(
            SessionInnerQueries.existsSessionWithUrlName(session_url_name),
            q.Let(
                {
                    sessionId: q.Select([0, "id"], q.Paginate(q.Match(q.Index("session_by_url_name"), session_url_name)))
                },
                q.If(
                    InnerQueries.existsStudentWithSessionId(studentName, q.Var("sessionId")),
                    q.Let(
                        {
                            student: q.Get(q.Match(q.Index("student_by_name_sessionId"), [studentName, q.Var("sessionId")]))
                        },
                        q.If(
                            q.Equals(q.Var("sessionId"), q.Select(["data", "sessionId"], q.Var("student"))),
                            q.Var("student"),
                            null
                        )
                    ),
                    null
                )
            ),
            null
        )
    ) as S_Student
}