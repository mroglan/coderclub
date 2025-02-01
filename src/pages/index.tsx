import Main from "@/components/home/Main";
import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export default function Home() {

    return (
        <>
            <Head>
                <title>CoderClub</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                <Main />
                <MainFooter />
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