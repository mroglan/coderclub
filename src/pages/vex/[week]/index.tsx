import MainFooter from "@/components/nav/MainFooter";
import MainHeader from "@/components/nav/MainHeader";
import Main from "@/components/vex/Main";
import Week2 from "@/components/vex/Week2";
import Week3 from "@/components/vex/Week3";
import Week4 from "@/components/vex/Week4";
import Week5 from "@/components/vex/Week5";
import Week6 from "@/components/vex/Week6";
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
    } else if (week == "3") {
        component = <Week3 />
    } else if (week == "4") {
        component = <Week4 />
    } else if (week == "5") {
        component = <Week5 />
    } else if (week == "6") {
        component = <Week6 />
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