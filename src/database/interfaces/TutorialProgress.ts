import { S_Ref, C_Ref } from "./fauna";


export interface TutorialProgressData {
    sessionId: string;
    tutorialName: string;
    studentId?: string; // this will either be an id or ""
    teacherId?: string; // this will either be an id or ""
    code: {[stepName: string]: string};
}


export interface S_TutorialProgress {
    ref: S_Ref;
    data: TutorialProgressData;
}


export interface C_TutorialProgress {
    ref: C_Ref;
    data: TutorialProgressData;
}