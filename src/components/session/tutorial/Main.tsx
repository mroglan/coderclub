import { DefaultEditor, EditorTabs, EditorWrapper, LowerToolbar } from "@/components/codingUtils/Editor";
import { DefaultErrorDisplay } from "@/components/codingUtils/ErrorDisplay";
import { OutputManager, Terminal } from "@/components/codingUtils/Output";
import { ScriptAdjustments } from "@/components/codingUtils/scriptAdjustments";
import WorkerManager from "@/components/codingUtils/WorkerManager";
import { GreenPrimaryButton, PurpleLargeButton, PurplePrimaryButton, RedPrimaryButton } from "@/components/misc/buttons";
import { TUTORIAL_ENVS, TUTORIAL_SOLUTIONS, TUTORIAL_STEPS, TUTORIAL_TEMPLATES } from "@/database/interfaces/SessionTutorial";
import { Props, TeacherData } from "@/pages/session/[url_name]/tutorial/[tutorial_name]";
import { EditorView } from "@codemirror/view";
import { Box, Container, Grid2, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Router from "next/router"
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";
import { TutorialProgress } from "@/database/interfaces/TutorialProgress";
import CachedIcon from '@mui/icons-material/Cached';
import EditorFullScreenDialog from "@/components/codingUtils/EditorFullScreenDialog";
import Link from "next/link";
import { ResizableBox } from "react-resizable"
import Undo from "@/components/codingUtils/Undo";
import { useImages, usePyodide } from "@/components/codingUtils/hooks";
import { Environment } from "@/utils/constants";
import ImageEditor from "@/components/codingUtils/Images";


export default function Main({data, type}: Props) {

    const [tutorial, setTutorial] = useState(data.tutorial)

    const [totalProgress, setTotalProgress] = useState(data.progress || {
        sessionId: data.tutorial.sessionId,
        teacherId: type == "teacher" ? data.tutorial.teacherId : undefined,
        studentId: type == "student" ? "": undefined,
        code: {} as any
    })

    const [studentCodeToShow, setStudentCodeToShow] = useState<TutorialProgress|null>(null)
    const [loadingStudentCode, setLoadingStudentCode] = useState(false)

    const router = useRouter()

    useMemo(() => {
        if (router.query.step) return

        router.push({
            query: {...router.query, step: TUTORIAL_STEPS[data.tutorial.name][0]},
        }, undefined, {shallow: true})
    }, [router.query])

    const tabs = useMemo(() => {
        let t = []
        if (type === "teacher") {
            t = ["My Code", "Student Code", "Solution"]
        } else {
            t = ["My Code", "Solution"]
        }
        if (TUTORIAL_ENVS[data.tutorial.name][router.query.step] !== Environment.CONSOLE) {
            t.splice(1, 0, "Images")
        }
        return t
    }, [type, router.query])

    const [imagesSaved, setImagesSaved] = useState(true)

    const pyodide = usePyodide()
    const images = useImages(data.progress?.images, () => setImagesSaved(false))
    const [clearCount, setClearCount] = useState(0)

    const editorViewRef = useRef<EditorView>(null);

    const [selectedTab, setSelectedTab] = useState("My Code")

    useMemo(() => {
        if (!router.query.step) return
        if (router.query.step === "Tutorial Complete!") return

        const code = totalProgress.code[router.query.step as string] || TUTORIAL_TEMPLATES[data.tutorial.name][router.query.step as string]

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
        } else if (selectedTab === "Student Code") {
            console.log('set student code to null')
            setStudentCodeToShow(null)
        }
        setSelectedTab(tab)
    }

    const [checkingForSolution, setCheckingForSolution] = useState(false)
    const checkingForSolutionDelayTime = useRef(0)

    const loadSolution = () => {
        setCheckingForSolution(true)

        setTimeout(() => {
            // if students spam the button, they shall wait the longer!
            checkingForSolutionDelayTime.current += 10000

            const updateTutorial = async () => {
                const {data: {tutorial}} = await axios({
                    method: "GET",
                    url: `/api/session/${router.query.url_name}/tutorial?tutorialId=${data.tutorial.id}`
                })
                
                setTutorial(tutorial)
                setCheckingForSolution(false)
            }
            updateTutorial()
        }, checkingForSolutionDelayTime.current)
    }

    useMemo(() => {
        if (!editorViewRef.current) return
        let newContent: any = ""
        if (selectedTab === "My Code") {
            newContent = totalProgress.code[router.query.step as string]
        } else if (selectedTab === "Solution") {
            newContent = TUTORIAL_SOLUTIONS[data.tutorial.name][router.query.step as string]
            if (!tutorial.unlockSolutions.includes(router.query.step as string) && type === "student") {
                newContent = "# Solutions not unlocked yet!!!"
            } else {
                checkingForSolutionDelayTime.current = 0
            }
        } else if (selectedTab === "Student Code") {
            newContent = studentCodeToShow?.code[router.query.step as string] || "# No progress found!"
        }
        (editorViewRef as any).current.dispatch({
            changes: { from: 0, to: (editorViewRef as any).current.state.doc.length, insert: newContent },
        });
    }, [selectedTab, studentCodeToShow, tutorial])

    const updateCodeProgress = async () => {
        if (!editorViewRef.current) return
        console.log('updateCodeProgress')
        try {
            console.log('imagesSaved', imagesSaved)
            await axios({
                method: "POST",
                url: `/api/session/${router.query.url_name}/tutorial/update-progress`,
                data: {
                    sessionId: data.tutorial.sessionId,
                    tutorialName: data.tutorial.name,
                    stepName: router.query.step,
                    code: editorViewRef.current.state.doc.toString(),
                    images: imagesSaved ? undefined : {
                        meta: images.meta,
                        images: images.images
                    }
                }
            })
            setImagesSaved(true)
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

        if (!editorViewRef.current) {
            console.log("No editorViewRef!")
            return
        }

        const adjScript = new ScriptAdjustments(
            editorViewRef.current.state.doc.toString(),
            TUTORIAL_ENVS[data.tutorial.name][router.query.step]
        ).output()

        if (selectedTab === "My Code") {
            updateCodeProgress()
        }

        pyodide.executeCode(adjScript)
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

    const goToStep = (step: string) => {
        router.push({
            query: {...router.query, step}
        }, undefined, {shallow: true})
    }

    const onBack = () => {
        saveProgressLocally()
        if (router.query.step === TUTORIAL_STEPS[data.tutorial.name][0]) {
            if (confirm("Are you sure you want to leave the tutorial?")) {
                Router.push(`/session/${router.query.url_name}`)
            }
        } else if (router.query.step === "Tutorial Complete!") {
            goToStep(TUTORIAL_STEPS[data.tutorial.name].at(-1))
        } else {
            const currIndex = TUTORIAL_STEPS[data.tutorial.name].indexOf(router.query.step as string)
            goToStep(TUTORIAL_STEPS[data.tutorial.name][currIndex-1])
        }
    }

    const onNext = () => {
        saveProgressLocally()
        if (router.query.step === TUTORIAL_STEPS[data.tutorial.name].at(-1)) {
            goToStep("Tutorial Complete!")
        } else {
            const currIndex = TUTORIAL_STEPS[data.tutorial.name].indexOf(router.query.step as string)
            goToStep(TUTORIAL_STEPS[data.tutorial.name][currIndex+1])
        }
    }

    const displayStudentCode = async (studentId: string) => {
        if (loadingStudentCode) return

        setLoadingStudentCode(true)

        try {

            const {data: {tutorialProgress}} = await axios({
                method: "GET",
                url: `/api/session/${router.query.url_name}/tutorial/student-progress?studentId=${studentId}&tutorialName=${data.tutorial.name}&sessionId=${data.tutorial.sessionId}`
            })

            if (!tutorialProgress) {
                setStudentCodeToShow({
                    code: {}
                } as any)
            } else {
                setStudentCodeToShow(tutorialProgress)
            }
        } catch (e) {
            console.log(e)
        }
        setLoadingStudentCode(false)
    }

    console.log('student code to show', studentCodeToShow)

    return (
        <Box my={3}>
            <Box mx={3}>
                <Box mb={3}>
                    <Grid2 container justifyContent="space-between" alignItems="center" wrap="nowrap">
                        <Grid2>
                            <PurplePrimaryButton startIcon={<ArrowLeftIcon />} onClick={onBack}>
                                Back
                            </PurplePrimaryButton>
                        </Grid2>
                        <Grid2>
                            <Typography variant="h4">
                                {router.query.step}
                            </Typography>
                        </Grid2>
                        <Grid2>
                            <PurplePrimaryButton sx={router.query.step === "Tutorial Complete!" ? {
                                opacity: 0,
                                zIndex: -1
                            } : {
                                opacity: 1,
                                zIndex: 1
                            }}
                            endIcon={<ArrowRightIcon />} onClick={onNext}>
                                Next
                            </PurplePrimaryButton>
                        </Grid2>
                    </Grid2>
                </Box>
                <Box display={router.query.step === "Tutorial Complete!" ? "none" : undefined}>
                    <Typography variant="body1">
                        Environment: {TUTORIAL_ENVS[data.tutorial.name][router.query.step]}
                    </Typography>
                </Box>
                <Grid2 container spacing={3} display={router.query.step === "Tutorial Complete!" ? "none" : "flex"}>
                    <Grid2>
                        <EditorWrapper
                            main={
                                <>
                                    <EditorTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={changeTab} />
                                    <Box display={selectedTab === "Student Code" && !studentCodeToShow ? "none" : "default"}
                                        position="relative">
                                        {
                                            type == "student" && selectedTab == "Solution" && !tutorial.unlockSolutions.includes(router.query.step as string) 
                                            && <Box position="absolute" top="50%" left="50%" sx={{transform: "translate(-50%, -50%)"}} zIndex={10}>
                                                <IconButton color="success" sx={{animation: checkingForSolution ? "rotate 5s infinite linear": "none"}}
                                                disabled={checkingForSolution} onClick={loadSolution}>
                                                    <CachedIcon sx={{fontSize: 100}} />
                                                </IconButton>
                                            </Box>
                                        }
                                        <Box display={selectedTab === "Images" ? undefined : "none"}>
                                            <ImageEditor images={images} />
                                        </Box>
                                        <Box display={selectedTab !== "Images" ? undefined : "none"}>
                                            <DefaultEditor originalCode={totalProgress.code[router.query.step as string] || TUTORIAL_TEMPLATES[data.tutorial.name][router.query.step as string]}
                                                editorViewRef={editorViewRef} />
                                        </Box>
                                    </Box>
                                    {
                                        selectedTab === "Student Code" && !studentCodeToShow && <Box
                                        bgcolor="#fff" p={3}>
                                            <Grid2 container spacing={3} justifyContent="space-around">
                                                {(data as TeacherData).students.map(student => (
                                                    <Grid2 key={student.name} sx={{cursor: "pointer"}}>
                                                        <Box onClick={() => displayStudentCode(student.id)}>
                                                            <Typography variant="body1" color="primary">
                                                                {student.name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid2>
                                                ))}
                                            </Grid2>
                                        </Box>
                                    }
                                </>
                            }
                            lowerToolbar={<LowerToolbar runCode={runCode} pyodide={pyodide} editorViewRef={editorViewRef} />}
                        />
                    </Grid2>
                    <Grid2 flex={1} minWidth={300} position="relative">
                        <Box mt={3}>
                            <OutputManager env={TUTORIAL_ENVS[data.tutorial.name][router.query.step]}
                                pyodideWorker={pyodide.manager} pyodideState={pyodide.state}
                                clearCount={clearCount} 
                                images={selectedTab !== "Student Code" ? images : 
                                    studentCodeToShow?.images || {
                                        meta: {image: "", resolution: 0},
                                        images: []
                                    } as any
                                } />
                            <DefaultErrorDisplay error={pyodide.state.executionError} />
                        </Box>
                    </Grid2>
                </Grid2>
                {router.query.step === "Tutorial Complete!" && <Box>
                    <Box textAlign="center">
                        <img src="/thatsallfolks.png" height={500} />
                    </Box> 
                    <Box mt={3}>
                        <Grid2 container justifyContent="center" spacing={3}>
                            <Grid2 width={300}>
                                <Link href={`/session/${router.query.url_name}`}>
                                    <PurpleLargeButton fullWidth>
                                        Back to Home     
                                    </PurpleLargeButton> 
                                </Link>
                            </Grid2>
                            <Grid2 width={300}>
                                <Link href="/sandbox" target="_blank">
                                    <PurpleLargeButton fullWidth>
                                        Go to Sandbox!
                                    </PurpleLargeButton>
                                </Link>
                            </Grid2>
                        </Grid2>
                    </Box>
                    <Box mt={6}>
                        <Container maxWidth="md">
                            <Grid2 container spacing={5} justifyContent="space-around">
                                {TUTORIAL_STEPS[data.tutorial.name].map(step => (
                                    <Grid2>
                                        <Box sx={{cursor: "pointer"}} onClick={() => goToStep(step)}>
                                            <Typography variant="body1" color="primary">
                                                {step}
                                            </Typography>
                                        </Box>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Container>
                    </Box>
                </Box>}
            </Box>
        </Box>
    )
}