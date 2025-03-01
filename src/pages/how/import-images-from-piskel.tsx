import Main from "@/components/how/ImportImagesFromPiskel/Main";
import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";


interface Props {
    isLoggedIn: boolean;
}


export default function ImportImagesFromPiskel({isLoggedIn}: Props) {

    return (
        <>
            <Head>
                <title>How to Import Images from Piskel</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader loggedIn={isLoggedIn} />
                <Main />
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const token = parseCookies(ctx)["user-auth"]

    const isLoggedIn = Boolean(token)

    return {props: {isLoggedIn}}
}