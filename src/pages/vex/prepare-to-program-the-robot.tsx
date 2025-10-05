import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/vex/how-to-program-the-robot/Main";
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export default function Home() {

    return (
        <>
            <Head>
                <title>CoderClub | Prepare to Program the Robot</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                <Main />
                <MainFooter />
            </div>
        </>
    )
}