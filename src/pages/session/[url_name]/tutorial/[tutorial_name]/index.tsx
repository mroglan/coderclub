import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/session/tutorial/Main";
import { MySession } from "@/database/interfaces/Session";
import { SessionTutorial } from "@/database/interfaces/SessionTutorial";
import { Student } from "@/database/interfaces/Student";
import { TutorialProgress } from "@/database/interfaces/TutorialProgress";
import { getStudentTutorialInfo } from "@/database/operations/student";
import { getTeacherTutorialInfo } from "@/database/operations/teacher";
import { getUserFromCtx, mustNotBeAuthenticated, StudentFromJWT } from "@/utils/auth";
import { NoSsr } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export interface TeacherData {
    session: MySession;
    tutorial: SessionTutorial;
    progress: TutorialProgress|null;
    students: Student[];
}


interface StudentData {
    tutorial: C_SessionTutorial;
    progress: C_TutorialProgress|null;
}


export interface Props {
    data: TeacherData | StudentData;
    type: string;
}


export default function Tutorial({data, type}: Props) {

    return (
        <>
            <Head>
                <title>{`${data.tutorial.name} | Tutorial`}</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader loggedIn />
                <NoSsr>
                    <Main data={data} type={type} />
                </NoSsr>
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    console.log(ctx.query.tutorial_name)

    const {user, redirect, token} = await getUserFromCtx(ctx)

    if (redirect) {
        return redirect
    }

    try {
        let data: any = null
        if (token?.type === "student") {
            data = await getStudentTutorialInfo(user as StudentFromJWT, ctx.query.tutorial_name as string)
        } else {
            data = await getTeacherTutorialInfo(token?.id as string, ctx.query.url_name as string, ctx.query.tutorial_name as string)
        }

        if (!data) {
            // most likely a teacher or student is going to a session tutorial they do not have access to
            const redirect = await mustNotBeAuthenticated(ctx)
            if (!redirect) {
                console.log("something bad is hapenning!!")
                return {props: {}, redirect: {destination: "/", permanent: false}}
            }
            return redirect
        }

        console.log('query data', data)

        if (token?.type == "student") {
            data.user = user
        } else {
            data = data.data
            data.students = data.students.data
        }

        return {props: {
            data: JSON.parse(JSON.stringify(data)),
            type: token?.type as string
        }}
    } catch (e) {
        console.log(e)
        return {redirect: {destination: "/", permanent: false}}
    }
}