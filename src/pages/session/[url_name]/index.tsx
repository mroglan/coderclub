import { getTeacherSessionDashboardInfo } from "@/database/operations/teacher";
import { getUserFromCtx } from "@/utils/auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export default function Session() {

    return <div />
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const {user, redirect} = await getUserFromCtx(ctx)

    if (redirect) {
        return redirect
    }

    console.log('url_name', ctx.query.url_name)

    console.log(JSON.stringify(user?.ref))
    console.log(user?.ref.id)

    let data = null
    if (JSON.stringify(user?.ref).includes("teacher")) {
        data = await getTeacherSessionDashboardInfo(user?.ref.id as string, ctx.query.url_name as string)
    }

    console.log("data", data)
    

    return {props: {}}
}