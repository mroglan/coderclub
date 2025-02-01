import client from "../fauna"
import { fql } from "fauna"
import { query as q } from "faunadb"
import { InnerQueries as StudentInnerQueries } from "./student"
import { C_SessionTutorial } from "../interfaces/SessionTutorial"


export class InnerQueries {

    static existsSessionTutorialWithNameAndSessionId(name: string, sessionId: string) {
        return q.Exists(q.Match(q.Index("sessionTutorial_by_sessionId_name"), [sessionId, name]))
    }
}


export async function CreateSessionTutorialByTeacher(teacherId: string, session_url_name: string, sessionId: string, name: string) {

    // return await client.query(
    //     StudentInnerQueries.sessionWithTeacherValidatedWrapper(
    //         teacherId, 
    //         session_url_name,
    //         q.Create(
    //             q.Collection("sessionTutorial"),
    //             {data: {
    //                 name, 
    //                 teacherId,
    //                 sessionId: q.Select(["ref", "id"], q.Var("session")),
    //                 unlockSolutions: []
    //             }}
    //         )
    //     )
    // ) as C_SessionTutorial
    
    // TODO: add back validating removed during stupid fauna decomission
    return await client.query(
        fql`
            sessionTutorial.create({
                name: ${name},
                teacherId: ${teacherId},
                sessionId: ${sessionId},
                unlockSolutions: []
            }) 
        `
    )
}


export async function UpdateSessionTutorialByTeacher(id: string, teacherId: string, sessionId: string, name: string, data: any) {

    // return await client.query(
    //     q.Update(
    //         q.Select(0, q.Paginate(q.Match(q.Index("sessionTutorial_by_sessionId_teacherId_name"), [sessionId, teacherId, name]))),
    //         {data}
    //     )
    // )

    return await client.query(
        fql`
            sessionTutorial.byId(${id})!.update(${data})
        `
    )
}