
export interface TutorialProgress {
    id: string;
    sessionId: string;
    tutorialName: string;
    studentId?: string; // this will either be an id or ""
    teacherId?: string; // this will either be an id or ""
    code: {[stepName: string]: string};
    images?: {
        meta: {
            image: string;
            resolution: number;
        },
        images: {
            name: string;
            x: number;
            y: number;
        }[];
    }
}
