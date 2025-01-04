import MainHeader from "@/components/nav/MainHeader"
import Main from "@/components/login/Main"
import Head from "next/head"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { mustNotBeAuthenticated } from "@/utils/auth"


export default function Login() {

    return (
        <>
            <Head>
                <title>Login | CoderClub</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                <Main />
                <div>footer</div>
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const redirect = await mustNotBeAuthenticated(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {}}
}