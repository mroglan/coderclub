import client from "../fauna"
import { fql } from "fauna"
import { query as q } from "faunadb"


class InnerQueries {

    // static createStudentTutorialProgress(data: StudentTutorialProgressData) {
    //     return q.Create(
    //         q.Collection("studentTutorialProgress"),
    //         {data}
    //     )
    // }

    // static updateStudentTutorialProgress(id: string, code: string) {
    //     return q.Update(
    //         q.Ref(q.Collection("studentTutorialProgress"), id),
    //         {data: {code}}
    //     )
    // }

    static updateProgressByStudent(sessionId: string, tutorialName: string, studentId: string, stepName: string, code: string) {
        return q.If(
            q.Exists(q.Match(
                q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), 
                [sessionId, tutorialName, studentId]
            )),
            q.Update(
                q.Select(0, q.Paginate(q.Match(
                    q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), 
                    [sessionId, tutorialName, studentId]
                ))),
                {data: {
                    code: {
                        [stepName]: code
                    }
                }}
            ),
            q.Create(
                q.Collection("tutorialProgress"),
                {data: {
                    sessionId, tutorialName, studentId, code: {
                        [stepName]: code
                    }
                }}
            )
        )
    }

    static updateProgressByTeacher(sessionId: string, tutorialName: string, teacherId: string, stepName: string, code: string) {
        return q.If(
            q.Exists(q.Match(
                q.Index("tutorialProgress_by_sessionId_tutorialName_teacherId"), 
                [sessionId, tutorialName, teacherId]
            )),
            q.Update(
                q.Select(0, q.Paginate(q.Match(
                    q.Index("tutorialProgress_by_sessionId_tutorialName_teacherId"), 
                    [sessionId, tutorialName, teacherId]
                ))),
                {data: {
                    code: {
                        [stepName]: code
                    }
                }}
            ),
            q.Create(
                q.Collection("tutorialProgress"),
                {data: {
                    sessionId, tutorialName, teacherId, code: {
                        [stepName]: code
                    }
                }}
            )
        )
    }
}

export async function updateTutorialProgress(type: string, id: string, sessionId: string, tutorialName: string, stepName: string, code: string) {
    // return await client.query(
    //     q.If(
    //         type === "teacher",
    //         q.If(
    //             q.Equals(q.Select(["data", "teacherId"], q.Get(q.Ref(q.Collection("session"), sessionId))), id),
    //             InnerQueries.updateProgressByTeacher(sessionId, tutorialName, id, stepName, code),
    //             null
    //         ),
    //         InnerQueries.updateProgressByStudent(sessionId, tutorialName, id, stepName, code)
    //     )
    // )
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
    // return await client.query(
    //     q.If(
    //         q.Exists(q.Match(
    //             q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), 
    //             [sessionId, tutorialName, studentId]
    //         )),
    //         q.Get(q.Match(
    //             q.Index("tutorialProgress_by_sessionId_tutorialName_studentId"), 
    //             [sessionId, tutorialName, studentId]
    //         )),
    //         null
    //     )
    // )
    return await client.query(
        fql`
            tutorialProgress.studentProgress(${sessionId}, ${tutorialName}, ${studentId}).first()
        `
    )
}