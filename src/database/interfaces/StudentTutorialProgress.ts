import { S_Ref, C_Ref } from "./fauna";


interface StudentTutorialProgressData {
    sessionId: string;
    tutorialName: string;
    studentId: string;
    stepName: string;
    code: string;
}


export interface S_StudentTutorialProgress {
    ref: S_Ref;
    data: StudentTutorialProgressData;
}


export interface C_StudentTutorialProgress {
    ref: C_Ref;
    data: StudentTutorialProgressData;
}