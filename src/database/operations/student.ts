import client from "../fauna"
import { Expr, query as q } from "faunadb"
import { fql } from "fauna"
import { StudentFromJWT } from "@/utils/auth";

interface CreateStudentData {
    name: string;
    sessionId: string;
}


export async function CreateStudentByTeacher(teacherId: string, session_url_name: string, data: CreateStudentData) {

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

    // TODO: add back validation that I removed during fauna's stupid decomission
    return await client.query(
        fql`
            student.byId(${studentId})!.delete()
        `
    )
}


export async function getStudentFromNameAndSessionUrlName(studentName: string, session_url_name: string) {

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