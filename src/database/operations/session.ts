import client from "../fauna"
import { fql } from "fauna"


interface CreateSessionData {
    teacherId: string;
    name: string;
    url_name: string;
}


export async function createSession(data: CreateSessionData) {

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

    return await client.query(
        fql`
            tSession.byTeacherId(${teacherId})
        `
    )
}