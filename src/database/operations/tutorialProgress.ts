import client from "../fauna"
import { fql } from "fauna"


export async function updateTutorialProgress(type: string, id: string, sessionId: string, tutorialName: string, stepName: string, code: string) {

    const codeBlock = {
        [stepName]: code
    }
    if (type == "teacher") {
        return await client.query(
            fql`
                let progress = tutorialProgress.teacherProgress(${sessionId}, ${tutorialName}, ${id}).first()
                if (progress == null) {
                    tutorialProgress.create({
                        sessionId: ${sessionId} ,
                        tutorialName: ${tutorialName},
                        teacherId: ${id},
                        code: ${codeBlock}
                    }) 
                } else {
                    progress!.update({
                        code: ${codeBlock} 
                    })
                }
            `
        )
    } else if (type == "student") {
        return await client.query(
            fql`
                let progress = tutorialProgress.studentProgress(${sessionId}, ${tutorialName}, ${id}).first()
                if (progress == null) {
                    tutorialProgress.create({
                        sessionId: ${sessionId} ,
                        tutorialName: ${tutorialName},
                        studentId: ${id},
                        code: ${codeBlock}
                    }) 
                } else {
                    progress!.update({
                        code: ${codeBlock} 
                    })
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