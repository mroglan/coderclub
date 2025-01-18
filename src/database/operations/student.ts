import client from "../fauna"
import { query as q } from "faunadb"
import { InnerQueries as SessionInnerQueries } from "./session";
import { S_Student } from "../interfaces/Student";

interface CreateStudentData {
    name: string;
}

export async function CreateStudentByTeacher(teacherId: string, session_url_name: string, data: CreateStudentData) {

    return await client.query(
        q.If(
            SessionInnerQueries.existsSessionWithUrlName(session_url_name),
            q.Let(
                {
                    session: q.Get(q.Match(q.Index("session_by_url_name"), session_url_name))
                },
                q.If(
                    q.Equals(q.Select(["data", "teacherId"], q.Var("session")), teacherId),
                    q.Create(
                        q.Collection("student"),
                        {data: {...data, sessionId: q.Select(["ref", "id"], q.Var("session"))}}
                    ),
                    null
                )
            ),
            null
        )
    ) as S_Student
}