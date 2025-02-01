import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import StudentMain from "@/components/session/dashboard/student/Main";
import TeacherMain from "@/components/session/dashboard/teacher/Main";
import { MySession } from "@/database/interfaces/Session";
import { SessionTutorial } from "@/database/interfaces/SessionTutorial";
import { Student } from "@/database/interfaces/Student";
import { Teacher } from "@/database/interfaces/Teacher";
import { getStudentSessionDashboardInfo } from "@/database/operations/student";
import { getTeacherSessionDashboardInfo } from "@/database/operations/teacher";
import { getUserFromCtx, mustNotBeAuthenticated, StudentFromJWT } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export interface TeacherData {
    session: MySession;
    students: Student[];
    tutorials: SessionTutorial[];
}


interface StudentData {
    session: MySession;
    tutorials: SessionTutorial[];
    student: StudentFromJWT;
}


interface Props {
    data: TeacherData | StudentData;
    type: string;
}


export default function Session({data, type}: Props) {

    type = type[0].toUpperCase() + type.slice(1)

    return (
        <>
            <Head>
                <title>{data.session.name} | {type} View</title>
            </Head>
            <div className="root-header-footer">
                <MainHeader loggedIn />
                {
                    type == "Teacher" ?
                    <TeacherMain {...data as TeacherData} /> :
                    <StudentMain {...data as StudentData} />
                }
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    console.log("on indiv session")

    const {user, redirect, token} = await getUserFromCtx(ctx)

    if (redirect) {
        return redirect
    }

    let data: any = null
    if (token?.type == "teacher") {
        data = await getTeacherSessionDashboardInfo((user as any)?.id as string, ctx.query.url_name as string)
    } else {
        data = await getStudentSessionDashboardInfo(user as StudentFromJWT, ctx.query.url_name as string)
    }

    console.log('the query data', data)

    if (!data) {
        // most likely a teacher or student is going to a session they do not have access to
        const redirect = await mustNotBeAuthenticated(ctx)
        if (!redirect) {
            console.log("something bad is hapenning!!")
            return {props: {}, redirect: {destination: "/", permanent: false}}
        }
        return redirect
    }

    if (token?.type === "student") {
        (data as any).student = user
    } else {
        data = data.data
        data.students = data.students.data
        data.tutorials = data.tutorials.data
    }
    

    return {props: {
        data: JSON.parse(JSON.stringify(data)),
        type: token?.type as string
    }}
}