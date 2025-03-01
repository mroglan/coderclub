import client from "../fauna"
import { fql } from "fauna"


export async function updateTutorialProgress(type: string, id: string, 
    sessionId: string, tutorialName: string, stepName: string, 
    code: string, images?: any) {

    const codeBlock = {
        [stepName]: code
    }

    let createObj: any = {
        sessionId, tutorialName, code: codeBlock
    }
    let updateObj:any = {
        code: codeBlock
    }
    if (images) {
        createObj.images = images
        updateObj.images = images
    }
    if (type == "teacher") createObj.teacherId = id
    else createObj.studentId = id

    if (type == "teacher") {
        return await client.query(
            fql`
                let progress = tutorialProgress.teacherProgress(${sessionId}, ${tutorialName}, ${id}).first()
                if (progress == null) {
                    tutorialProgress.create(${createObj}) 
                } else {
                    progress!.update(${updateObj})
                }
            `
        )
    } else if (type == "student") {
        return await client.query(
            fql`
                let progress = tutorialProgress.studentProgress(${sessionId}, ${tutorialName}, ${id}).first()
                if (progress == null) {
                    tutorialProgress.create(${createObj}) 
                } else {
                    progress!.update(${updateObj})
                }
            `
        )
    }
}


export async function getStudentTutorialProgress(studentId: string, sessionId: string, tutorialName: string) {

    return await client.query(
        fql`
            tutorialProgress.studentProgress(${sessionId}, ${tutorialName}, ${studentId}).first()
        `
    )
}