import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/vex/Main";
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


export default function Home() {

    return (
        <>
            <Head>
                <title>CoderClub | Vex</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                <Main />
                <MainFooter />
            </div>
        </>
    )
}