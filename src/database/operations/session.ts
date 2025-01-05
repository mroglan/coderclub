import client from "../fauna"
import { query as q } from "faunadb"
import { SessionData } from "../interfaces/Session"


class InnerQueries {

    static existsSessionWithUrlName(name: string) {
        return q.Exists(q.Match(q.Index('teacher_by_email'), name))
    }
}


interface CreateSessionData {
    teacherId: string;
    name: string;
    url_name: string;
}


export async function createSession(data: CreateSessionData) {

    return await client.query(
        q.If(
            InnerQueries.existsSessionWithUrlName(data.url_name),
            null,
            q.Let(
                {
                    newSession: q.Create(
                        q.Collection("session"), 
                        {data: {...data, students: [], open: false, creationTime: Date.now()}}
                    )
                },
                q.Update(q.Ref(q.Collection("teacher"), data.teacherId), {
                    data: {
                        sessions: q.Append(
                            q.Select(["ref", "id"], q.Var("newSession")),
                            q.Select(
                                ["data", "sessions"],
                                q.Get(q.Ref(q.Collection("teacher"), data.teacherId))
                            )
                        )
                    }
                })
            )
        )
    )
}