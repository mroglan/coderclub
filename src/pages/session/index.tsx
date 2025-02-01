import MainHeader from "@/components/nav/MainHeader"
import Main from "@/components/session/index/Main"
import Head from "next/head"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth"
import { Teacher } from "@/database/interfaces/Teacher"
import { getSessionsFromTeacherId } from "@/database/operations/session"
import { MySession } from "@/database/interfaces/Session"
import MainFooter from "@/components/nav/MainFooter"


interface Props {
    user: Teacher;
    sessions: MySession[];
}


export default function Session({user, sessions}: Props) {

    console.log('sessions', sessions)

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

    const sessions = await getSessionsFromTeacherId((user as any).id as string)

    return {props: {
        user: JSON.parse(JSON.stringify(user)),
        sessions: JSON.parse(JSON.stringify(sessions.data.data))
    }}
}