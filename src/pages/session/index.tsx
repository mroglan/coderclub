import MainHeader from "@/components/nav/MainHeader"
import Main from "@/components/session/index/Main"
import Head from "next/head"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth"
import { C_Teacher } from "@/database/interfaces/Teacher"


interface Props {
    user: C_Teacher;
}


export default function Session({user}: Props) {

    console.log(user)

    return (
        <>
            <Head>
                <title>Your Sessions | CoderClub</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader loggedIn />
                <Main />
                <div>footer</div>
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const {user, redirect} = await getUserFromCtx(ctx, ["student"])

    if (redirect) {
        return redirect
    }

    return {props: {
        user: JSON.parse(JSON.stringify(user))
    }}
}