import { S_Ref, C_Ref } from "./fauna";

interface TeacherData {
    email: string;
    sessions: string[];
}

export interface S_TeacherData extends TeacherData {
    password: string;
}

export interface C_TeacherData extends TeacherData {}

export interface S_Teacher {
    ref: S_Ref;
    data: S_TeacherData;
}

export interface C_Teacher {
    ref: C_Ref;
    data: C_TeacherData;
}

export interface Cookie_Teacher extends C_TeacherData {
    id: string;
    type: "teacher";
}