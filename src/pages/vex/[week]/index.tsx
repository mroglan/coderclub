import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/vex/Main";
import Week2 from "@/components/vex/Week2";
import { getUserFromCtx, mustNotBeAuthenticated } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";


interface Props {
    week: string;
}


export default function Home({week}: Props) {

    week = week.split("-")[1].trim()

    let component = null

    if (week == "2") {
        component = <Week2 />
    }


    return (
        <>
            <Head>
                <title>CoderClub | Vex Week {week}</title>     
            </Head> 
            <div className="root-header-footer">
                <MainHeader />
                {component}
                <MainFooter />
            </div>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    return {props: {
        week: ctx.query.week
    }}
}