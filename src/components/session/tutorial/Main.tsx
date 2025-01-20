import { DefaultEditor, EditorTabs } from "@/components/codingUtils/Editor";
import { C_SessionTutorial, TUTORIAL_SOLUTIONS, TUTORIAL_STEPS } from "@/database/interfaces/SessionTutorial";
import { C_StudentTutorialProgress } from "@/database/interfaces/StudentTutorialProgress";
import { Props } from "@/pages/session/[url_name]/tutorial/[tutorial_name]";
import { EditorView } from "@codemirror/view";
import { Box, Container, Grid2 } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";


export default function Main({data, type}: Props) {

    const router = useRouter()

    useMemo(() => {
        if (router.query.step) return

        router.push({
            query: {...router.query, step: TUTORIAL_STEPS[data.tutorial.data.name][0]},
        }, undefined, {shallow: true})
    }, [router.query])

    const tabs = useMemo(() => {
        if (type === "teacher") {
            return ["My Code", "Student Code", "Solution"]
        }
        return ["My Code", "Solution"]
    }, [type])


    const editorRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView>(null);

    const [myCode, setMyCode] = useState({id: null, code: "", stepName: ""})
    const [selectedTab, setSelectedTab] = useState("My Code")

    useMemo(() => {
        if (!router.query.step) return

        if (router.query.step === myCode.stepName) return

        const prog = data.progress.find(p => p.data.stepName === router.query.step) 
        if (!prog) {
            setMyCode({
                id: null,
                code: "",
                stepName: router.query.step as string
            })
        } else {
            return {
                id: prog.ref["@ref"].id,
                code: prog.data.code,
                stepName: prog.data.stepName
            }
        }
    }, [router.query])

    console.log("progress", myCode)

    const changeTab = (tab: string) => {
        if (selectedTab == "My Code") {
            setMyCode({...myCode, code: (editorViewRef as any).current.state.doc.toString()})
        }
        setSelectedTab(tab)
    }

    useMemo(() => {
        if (!editorViewRef.current) return
        let newContent: any = ""
        if (selectedTab === "My Code") {
            newContent = myCode.code
        } else if (selectedTab === "Solution") {
            newContent = TUTORIAL_SOLUTIONS[data.tutorial.data.name][router.query.step as string]
        }
        (editorViewRef as any).current.dispatch({
            changes: { from: 0, to: (editorViewRef as any).current.state.doc.length, insert: newContent },
        });
    }, [selectedTab])

    const runCode = async (code: string) => {
        // codeType is either myCode, studentCode (if teacher looking at student's code), or solutionCode

        // editor will include button to run code that will call this function. It will pause it's run code
        // button until this function finishes. This function will send an api request to update the student/teacher's
        // progress and will run the code with pyodide and display output.
    }

    // TODO: add next and back buttons to this component since used by both teacher and student
    return (
        <Box my={3}>
            <Container maxWidth="xl">
                <Box mx={3}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 6}}>
                            <EditorTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={changeTab} />
                            <DefaultEditor originalCode={myCode.code} editorRef={editorRef} editorViewRef={editorViewRef} />
                        </Grid2>
                        <Grid2 size={{xs: 6}}>
                            output
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}