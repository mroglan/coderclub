import client from "../fauna"
import { fql } from "fauna"


export async function CreateSessionTutorialByTeacher(teacherId: string, session_url_name: string, sessionId: string, name: string) {

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

    return await client.query(
        fql`
            sessionTutorial.byId(${id})!.update(${data})
        `
    )
}