import MainHeader from "@/components/nav/MainHeader"
import Main from "@/components/session/index/Main"
import Head from "next/head"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth"
import { C_Teacher } from "@/database/interfaces/Teacher"
import { getSessionsFromTeacherId } from "@/database/operations/session"
import { C_Session } from "@/database/interfaces/Session"
import MainFooter from "@/components/nav/MainFooter"


interface Props {
    user: C_Teacher;
    sessions: C_Session[];
}


export default function Session({user, sessions}: Props) {

    return (
        <>
            <Head>
                <title>Your Sessions | CoderClub</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader loggedIn />
                <Main user={user} sessions={sessions} />
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const {user, redirect} = await getUserFromCtx(ctx, ["student"])

    if (redirect) {
        return redirect
    }

    const sessions = await getSessionsFromTeacherId(user?.ref.id as string)

    return {props: {
        user: JSON.parse(JSON.stringify(user)),
        sessions: JSON.parse(JSON.stringify(sessions.data))
    }}
}