
export interface TutorialProgress {
    id: string;
    sessionId: string;
    tutorialName: string;
    studentId?: string; // this will either be an id or ""
    teacherId?: string; // this will either be an id or ""
    code: {[stepName: string]: string};
}
