import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import StudentMain from "@/components/session/dashboard/student/Main";
import TeacherMain from "@/components/session/dashboard/teacher/Main";
import { C_Session } from "@/database/interfaces/Session";
import { C_SessionTutorial } from "@/database/interfaces/SessionTutorial";
import { C_Student } from "@/database/interfaces/Student";
import { C_Teacher } from "@/database/interfaces/Teacher";
import { getStudentSessionDashboardInfo } from "@/database/operations/student";
import { getTeacherSessionDashboardInfo } from "@/database/operations/teacher";
import { getUserFromCtx, mustNotBeAuthenticated, StudentFromJWT } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export interface TeacherData {
    session: C_Session;
    students: C_Student[];
    tutorials: C_SessionTutorial[];
}


interface StudentData {
    session: C_Session;
    tutorials: C_SessionTutorial[];
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
                <title>{data.session.data.name} | {type} View</title>
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

    let data = null
    if (token?.type == "teacher") {
        data = await getTeacherSessionDashboardInfo((user as any)?.ref.id as string, ctx.query.url_name as string)
    } else {
        data = await getStudentSessionDashboardInfo(user as StudentFromJWT, ctx.query.url_name as string)
    }

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
    }
    

    return {props: {
        data: JSON.parse(JSON.stringify(data)),
        type: token?.type as string
    }}
}