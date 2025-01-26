import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/session/tutorial/Main";
import { C_SessionTutorial } from "@/database/interfaces/SessionTutorial";
import { C_Teacher } from "@/database/interfaces/Teacher";
import { C_TutorialProgress } from "@/database/interfaces/TutorialProgress";
import { getStudentTutorialInfo } from "@/database/operations/student";
import { getUserFromCtx, mustNotBeAuthenticated, StudentFromJWT } from "@/utils/auth";
import { NoSsr } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


interface TeacherData {
    tutorial: C_SessionTutorial;
    progress: C_TutorialProgress|null;
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
                <title>{`${data.tutorial.data.name} | Tutorial`}</title>     
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

    let data: any = null
    if (token?.type === "student") {
        data = await getStudentTutorialInfo(user as StudentFromJWT, ctx.query.tutorial_name as string)
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

    if (token?.type == "student") {
        data.user = user
    }

    return {props: {
        data: JSON.parse(JSON.stringify(data)),
        type: token?.type as string
    }}
}