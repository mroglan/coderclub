import client from "../fauna"
import { fql } from "fauna"
import { Teacher } from "../interfaces/Teacher"


interface CreateTeacherData extends Omit<Teacher, "id"> {}


export async function createTeacher(data: CreateTeacherData) {

    return await client.query(
        fql`
            let exists = teacher.byEmail(${data.email}).first()
            if (exists == null) {
                teacher.create({
                    email: ${data.email},
                    password: ${data.password},
                })
            }
        `
    )
}


export async function getTeacherFromEmail(email:string) {

    return await client.query(
        fql`
            teacher.byEmail(${email}).first()
        `
    )
}


export async function getTeacher(id: string) {

    return await client.query(
        fql`
            teacher.byId(${id}) 
        `
    )
}


export async function getTeacherSessionDashboardInfo(teacherId: string, url_name: string) {

    return await client.query(
        fql`
            let s = tSession.byUrlName(${url_name}).first()
            let id = s!.id.toString()
            if (s!.teacherId == ${teacherId}) {
                let students = student.bySessionId(id).pageSize(30)
                let tutorials = sessionTutorial.bySessionId(id)
                {
                    "session": s,
                    "students": students,
                    "tutorials": tutorials
                }
            }
        `
    )
}


export async function getTeacherTutorialInfo(teacherId: string, sessionUrlName: string, tutorialName: string) {

    return await client.query(
        fql`
            let s = tSession.byUrlName(${sessionUrlName}).first()
            let id = s!.id.toString()
            if (s!.teacherId == ${teacherId}) {
                let tutorial = sessionTutorial.bySessionIdAndName(id, ${tutorialName}).first()
                let progress = tutorialProgress.teacherProgress(id, ${tutorialName}, ${teacherId}).first()
                let students = student.bySessionId(id).pageSize(30)
                {
                    "session": s,
                    "students": students,
                    "tutorial": tutorial,
                    "progress": progress
                }
            }
        `
    )
}