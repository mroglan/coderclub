import client from "../fauna"
import { fql } from "fauna"
import { query as q } from "faunadb"
import { S_Session, SessionData } from "../interfaces/Session"


export class InnerQueries {

    static existsSessionWithUrlName(name: string) {
        return q.Exists(q.Match(q.Index('session_by_url_name'), name))
    }
}


interface CreateSessionData {
    teacherId: string;
    name: string;
    url_name: string;
}


export async function createSession(data: CreateSessionData) {

    // return await client.query(
    //     q.If(
    //         InnerQueries.existsSessionWithUrlName(data.url_name),
    //         null,
    //         q.Let(
    //             {
    //                 newSession: q.Create(
    //                     q.Collection("session"), 
    //                     {data: {...data, open: false, creationTime: Date.now()}}
    //                 )
    //             },
    //             q.Update(q.Ref(q.Collection("teacher"), data.teacherId), {
    //                 data: {
    //                     sessions: q.Append(
    //                         q.Select(["ref", "id"], q.Var("newSession")),
    //                         q.Select(
    //                             ["data", "sessions"],
    //                             q.Get(q.Ref(q.Collection("teacher"), data.teacherId))
    //                         )
    //                     )
    //                 }
    //             })
    //         )
    //     )
    // )
    return await client.query(
        fql`
            let exists = tSession.byUrlName_w_id(${data.url_name}).first()
            if (exists == null) {
                tSession.create({
                    teacherId: ${data.teacherId},
                    name: ${data.name},
                    url_name: ${data.url_name}
                })
            }
        `
    )
}


export async function getSessionsFromTeacherId(teacherId: string) {

    // return await client.query(
    //     q.Map(
    //         q.Paginate(q.Match(q.Index("session_by_teacherId"), teacherId)),
    //         q.Lambda(
    //             "sessionRef",
    //             q.Get(q.Var("sessionRef"))
    //         )
    //     )
    // ) as {data: S_Session[]}

    return await client.query(
        fql`
            tSession.byTeacherId(${teacherId})
        `
    )
}