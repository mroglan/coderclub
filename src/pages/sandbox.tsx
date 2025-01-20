import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/sandbox/Main2";
// import Main from "@/components/sandbox/Main";
import Head from "next/head";

export default function Sandbox() {

    return (
        <>
            <Head>
                <title>Sandbox</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                <Main />
                <MainFooter />
            </div>
        </>
    )
}