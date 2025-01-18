import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import TeacherMain from "@/components/session/dashboard/teacher/Main";
import { C_Session } from "@/database/interfaces/Session";
import { C_Student } from "@/database/interfaces/Student";
import { C_Teacher } from "@/database/interfaces/Teacher";
import { getTeacherSessionDashboardInfo } from "@/database/operations/teacher";
import { getUserFromCtx } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export interface TeacherData {
    session: C_Session;
    students: C_Student[];
}


interface StudentData {
    session: C_Session;
}


interface Props {
    data: TeacherData | StudentData;
    type: string;
}


export default function Session({data, type}: Props) {

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
                    null
                }
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const {user, redirect} = await getUserFromCtx(ctx)

    if (redirect) {
        return redirect
    }

    console.log('url_name', ctx.query.url_name)

    console.log(JSON.stringify(user?.ref))
    console.log(user?.ref.id)

    let data = null
    let type = ""
    if (JSON.stringify(user?.ref).includes("teacher")) {
        data = await getTeacherSessionDashboardInfo(user?.ref.id as string, ctx.query.url_name as string)
        type = "Teacher"
    }

    console.log("data", data)
    

    return {props: {
        data: JSON.parse(JSON.stringify(data)),
        type
    }}
}