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

