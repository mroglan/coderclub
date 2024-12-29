import MainHeader from "@/components/nav/MainHeader"
import Main from "@/components/login/Main"
import Head from "next/head"

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