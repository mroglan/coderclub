import { DefaultEditor, EditorTabs } from "@/components/codingUtils/Editor";
import { DefaultErrorDisplay } from "@/components/codingUtils/ErrorDisplay";
import { Terminal } from "@/components/codingUtils/Output";
import { ScriptAdjustments } from "@/components/codingUtils/scriptAdjustments";
import WorkerManager from "@/components/codingUtils/WorkerManager";
import { GreenPrimaryButton, PurplePrimaryButton } from "@/components/misc/buttons";
import { C_SessionTutorial, TUTORIAL_SOLUTIONS, TUTORIAL_STEPS, TUTORIAL_TEMPLATES } from "@/database/interfaces/SessionTutorial";
import { Props } from "@/pages/session/[url_name]/tutorial/[tutorial_name]";
import { EditorView } from "@codemirror/view";
import { Box, Container, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Router from "next/router"
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";


export default function Main({data, type}: Props) {

    const [totalProgress, setTotalProgress] = useState(data.progress?.data || {
        sessionId: data.tutorial.data.sessionId,
        teacherId: type == "teacher" ? data.tutorial.data.teacherId : undefined,
        studentId: type == "student" ? "": undefined,
        code: {} as any
    })

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


    const [pyodideWorker, setPyodideWorker] = useState<WorkerManager|null>(null)
    const [pyodideState, setPyodideState] = useState({
        ready: false,
        executing: false,
    })
    const [executionError, setExecutionError] = useState("")
    const [clearCount, setClearCount] = useState(0)

    const pyodideListener = (event: MessageEvent) => {
        if (event.data.type === "ready") {
            setPyodideState({ready: true, executing: false})
        }
        if (event.data.type === "result" || event.data.type === "error") {
            console.log("setting pyodide state executing false")
            setPyodideState({ready: true, executing: false})
        }
        if (event.data.type === "error") {
            console.log("saving error")
            setExecutionError(event.data.error)
        }
    }

    useEffect(() => {
        if (pyodideWorker) return
        const worker = new WorkerManager("/pyodide.js")
        worker.addListener(pyodideListener)
        setPyodideWorker(worker)
    }, [])


    const editorViewRef = useRef<EditorView>(null);

    const [selectedTab, setSelectedTab] = useState("My Code")

    useMemo(() => {
        if (!router.query.step) return

        const code = totalProgress.code[router.query.step as string] || TUTORIAL_TEMPLATES[data.tutorial.data.name][router.query.step as string]

        setClearCount(clearCount+1)
        setSelectedTab("My Code")
        if (editorViewRef.current) {
            editorViewRef.current.dispatch({
            changes: { from: 0, to: (editorViewRef as any).current.state.doc.length, insert: code},
        })
        }
    }, [router.query])

    const changeTab = (tab: string) => {
        if (!editorViewRef.current) return
        if (selectedTab == "My Code") {
            setTotalProgress({
                ...totalProgress,
                code: {...totalProgress.code, [router.query.step as string]: editorViewRef.current.state.doc.toString()}
            })
        }
        setSelectedTab(tab)
    }

    useMemo(() => {
        if (!editorViewRef.current) return
        let newContent: any = ""
        if (selectedTab === "My Code") {
            // newContent = myCode.code
            newContent = totalProgress.code[router.query.step as string]
        } else if (selectedTab === "Solution") {
            newContent = TUTORIAL_SOLUTIONS[data.tutorial.data.name][router.query.step as string]
        }
        (editorViewRef as any).current.dispatch({
            changes: { from: 0, to: (editorViewRef as any).current.state.doc.length, insert: newContent },
        });
    }, [selectedTab])

    const updateCodeProgress = async () => {
        if (!editorViewRef.current) return
        console.log('updateCodeProgress')
        try {
            await axios({
                method: "POST",
                url: `/api/session/${router.query.url_name}/tutorial/update-progress`,
                data: {
                    sessionId: data.tutorial.data.sessionId,
                    tutorialName: data.tutorial.data.name,
                    stepName: router.query.step,
                    code: editorViewRef.current.state.doc.toString()
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    const lastRunTime = useRef(new Date().getTime())    

    const runCode = async () => {
        const date = new Date().getTime()
        if (Math.abs(date - lastRunTime.current) < 2000) {
            console.log("ignoring run code as last run was less than 2 seconds ago")
            return
        }
        lastRunTime.current = date

        if (!pyodideWorker) {
            console.log("How are we here!! There is no pyodide Worker!")
            return
        }

        if (!editorViewRef.current) {
            console.log("No editorViewRef!")
            return
        }

        const adjScript = new ScriptAdjustments(editorViewRef.current.state.doc.toString()).output()

        if (selectedTab === "My Code") {
            updateCodeProgress()
        }

        pyodideWorker.postMessage({
            type: "execute",
            code: editorViewRef.current.state.doc.toString()
        })
        setPyodideState({...pyodideState, executing: true})
        setExecutionError("")
    }

    const saveProgressLocally = () => {
        // TODO: eventually save this to localStorage as well and don't reload it when user refreshes page
        if (selectedTab !== "My Code" || !editorViewRef.current) return
        const code = editorViewRef.current.state.doc.toString()
        setTotalProgress({
            ...totalProgress,
            code: {...totalProgress.code, [router.query.step as string]: code}
        })
    }

    const onBack = () => {
        saveProgressLocally()
        if (router.query.step === TUTORIAL_STEPS[data.tutorial.data.name][0]) {
            if (confirm("Are you sure you want to leave the tutorial?")) {
                Router.push("/")
            }
        } else {
            const currIndex = TUTORIAL_STEPS[data.tutorial.data.name].indexOf(router.query.step as string)
            router.push({
                query: {...router.query, step: TUTORIAL_STEPS[data.tutorial.data.name][currIndex-1]}
            })
        }
    }

    const onNext = () => {
        saveProgressLocally()
        if (router.query.step === TUTORIAL_STEPS[data.tutorial.data.name].at(-1)) {
            router.push({
                query: {...router.query, step: "review"},
            }, undefined, {shallow: true})
        } else {
            const currIndex = TUTORIAL_STEPS[data.tutorial.data.name].indexOf(router.query.step as string)
            router.push({
                query: {...router.query, step: TUTORIAL_STEPS[data.tutorial.data.name][currIndex+1]}
            })
        }
    }

    // TODO: add next and back buttons to this component since used by both teacher and student
    return (
        <Box my={3}>
            <Container maxWidth="xl">
                <Box mx={3}>
                    <Box mb={3}>
                        <Grid2 container justifyContent="space-between">
                            <Grid2 minWidth={200}>
                                <PurplePrimaryButton startIcon={<ArrowLeftIcon />} onClick={onBack}>
                                    Back
                                </PurplePrimaryButton>
                            </Grid2>
                            <Grid2>
                                <PurplePrimaryButton endIcon={<ArrowRightIcon />} onClick={onNext}>
                                    Next
                                </PurplePrimaryButton>
                            </Grid2>
                        </Grid2>
                    </Box>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 6}}>
                            <EditorTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={changeTab} />
                            <DefaultEditor originalCode={totalProgress.code[router.query.step as string] || TUTORIAL_TEMPLATES[data.tutorial.data.name][router.query.step as string]}
                                editorViewRef={editorViewRef} />
                            <Box mt={3}>
                                <Grid2 container>
                                    <Grid2 minWidth={200}>
                                        <Box>
                                            <GreenPrimaryButton fullWidth disabled={pyodideState.executing || !pyodideState.ready}
                                                onClick={() => runCode()}>
                                                Run Code
                                            </GreenPrimaryButton>
                                        </Box>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </Grid2>
                        <Grid2 size={{xs: 6}} position="relative">
                            <Terminal pyodideWorker={pyodideWorker} pyodideState={pyodideState} clearCount={clearCount} />
                            <DefaultErrorDisplay error={executionError} />
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}