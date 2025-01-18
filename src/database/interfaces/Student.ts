import { S_Ref, C_Ref } from "./fauna";


interface StudentData {
    name: string;
    sessionId: string;
}


export interface S_Student {
    ref: S_Ref;
    data: StudentData;
}


export interface C_Student {
    ref: C_Ref;
    data: StudentData;
}