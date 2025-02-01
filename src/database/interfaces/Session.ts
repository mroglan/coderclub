import { S_Ref, C_Ref } from "./fauna";


export interface MySession {
    id: string;
    teacherId: string;
    name: string;
    url_name: string;
    open: boolean;
    creationTime: number;
}


// export interface S_Session {
//     ref: S_Ref;
//     data: SessionData;
// }

// export interface C_Session {
//     ref: C_Ref;
//     data: SessionData;
// }