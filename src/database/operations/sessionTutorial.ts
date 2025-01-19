import client from "../fauna"
import { query as q } from "faunadb"
import { InnerQueries as StudentInnerQueries } from "./student"
import { C_SessionTutorial } from "../interfaces/SessionTutorial"


export async function CreateSessionTutorialByTeacher(teacherId: string, session_url_name: string, name: string) {

    return await client.query(
        StudentInnerQueries.sessionWithTeacherValidatedWrapper(
            teacherId, 
            session_url_name,
            q.Create(
                q.Collection("sessionTutorial"),
                {data: {
                    name, 
                    teacherId,
                    sessionId: q.Select(["ref", "id"], q.Var("session")),
                    unlockSolutions: []
                }}
            )
        )
    ) as C_SessionTutorial
}


export async function UpdateSessionTutorialByTeacher(teacherId: string, sessionId: string, name: string, data: any) {

    return await client.query(
        q.Update(
            q.Select(0, q.Paginate(q.Match(q.Index("sessionTutorial_by_sessionId_teacherId_name"), [sessionId, teacherId, name]))),
            {data}
        )
    )
}