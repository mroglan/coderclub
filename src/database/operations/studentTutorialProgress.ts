import client from "../fauna"
import { query as q } from "faunadb"
import { StudentTutorialProgressData } from "../interfaces/StudentTutorialProgress"


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

    static updateProgressByStudent(data: StudentTutorialProgressData) {
        return q.If(
            q.Exists(q.Match(
                q.Index("studentTutorialProgress_by_sessionId_tutorialName_stepName_studentId"), 
                [data.sessionId, data.tutorialName, data.stepName, data.studentId]
            )),
            q.Update(
                q.Select(0, q.Paginate(q.Match(
                    q.Index("studentTutorialProgress_by_sessionId_tutorialName_stepName_studentId"), 
                    [data.sessionId, data.tutorialName, data.stepName, data.studentId]
                ))),
                {data}
            ),
            q.Create(
                q.Collection("studentTutorialProgress"),
                {data}
            )
        )
    }

    static updateProgressByTeacher(data: StudentTutorialProgressData) {
        return q.If(
            q.Exists(q.Match(
                q.Index("studentTutorialProgress_by_sessionId_tutorialName_stepName_teacherId"), 
                [data.sessionId, data.tutorialName, data.stepName, data.teacherId]
            )),
            q.Update(
                q.Select(0, q.Paginate(q.Match(
                    q.Index("studentTutorialProgress_by_sessionId_tutorialName_stepName_teacherId"), 
                    [data.sessionId, data.tutorialName, data.stepName, data.teacherId]
                ))),
                {data}
            ),
            q.Create(
                q.Collection("studentTutorialProgress"),
                {data}
            )
        )
    }
}


// export async function createStudentTutorialProgress(data: StudentTutorialProgressData, type: string) {

//     return client.query(
//         q.If(
//             type === "teacher",
//             q.If(
//                 q.Equals(q.Select(["data", "teacherId"], q.Get(q.Ref(q.Collection("session"), data.sessionId))), data.teacherId),
//                 InnerQueries.createStudentTutorialProgress(data),
//                 null
//             ),
//             InnerQueries.createStudentTutorialProgress(data)
//         )        
//     )
// }

// export async function updateStudentTutorialProgress(id: string, code: string, type: string, teacherId: string, sessionId: string) {

//     await client.query(
//         q.If(
//             type === "teacher",
//             q.If(
//                 q.Equals(q.Select(["data", "teacherId"], q.Get(q.Ref(q.Collection("session"), sessionId))), teacherId),
//                 InnerQueries.updateStudentTutorialProgress(id, code),
//                 null
//             ),
//             InnerQueries.updateStudentTutorialProgress(id, code)
//         )
//     )
// }


export async function updateStudentTutorialProgress(data: StudentTutorialProgressData, type: string) {

    return await client.query(
        q.If(
            type === "teacher",
            q.If(
                q.Equals(q.Select(["data", "teacherId"], q.Get(q.Ref(q.Collection("session"), data.sessionId))), data.teacherId),
                InnerQueries.updateProgressByTeacher(data),
                null
            ),
            InnerQueries.updateProgressByStudent(data)
        )
    )
}