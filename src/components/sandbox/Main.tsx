import { Box, Container, Grid2 } from "@mui/material";
import { DefaultEditor } from "../codingUtils/Editor";
import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { Terminal } from "../codingUtils/Output";
import WorkerManager from "../codingUtils/WorkerManager";
import { GreenPrimaryButton, RedPrimaryButton } from "../misc/buttons";
import { ScriptAdjustments } from "../codingUtils/scriptAdjustments";
import { DefaultErrorDisplay } from "../codingUtils/ErrorDisplay";
import EditorFullScreenDialog from "../codingUtils/EditorFullScreenDialog";
import { ResizableBox } from "react-resizable"


export default function Main() {

    const editorViewRef = useRef<EditorView>(null);

    const [pyodideWorker, setPyodideWorker] = useState<WorkerManager|null>(null)
    const [pyodideState, setPyodideState] = useState({
        ready: false,
        executing: false,
    })
    const [executionError, setExecutionError] = useState("")

    const [editorWidth, setEditorWidth] = useState(parseInt(localStorage.getItem("editorWidth") || "600"))

    const pyodideListener = (event: MessageEvent) => {
        if (event.data.type === "ready") {
            setPyodideState({ready: true, executing: false})
        }
        if (event.data.type === "result" || event.data.type === "error") {
            setPyodideState({ready: true, executing: false})
        }
        if (event.data.type === "error") {
            console.log("saving error")
            setExecutionError(event.data.error)
        }
    }

    const setupPyodide = () => {
        const worker = new WorkerManager("/pyodide.js")
        worker.addListener(pyodideListener)
        setPyodideWorker(worker)
    }

    useEffect(() => {
        if (pyodideWorker) return
        setupPyodide()
    }, [])

    const runCode = async () => {
        if (!pyodideWorker) {
            console.log("How are we here!! There is no pyodide Worker!")
            return
        }

        if (!editorViewRef.current) {
            console.log("No editorViewRef!")
            return
        }

        const adjScript = new ScriptAdjustments(editorViewRef.current.state.doc.toString()).output()

        pyodideWorker.postMessage({
            type: "execute",
            code: adjScript
        })
        setPyodideState({...pyodideState, executing: true})
        setExecutionError("")
    }

    const cancelCode = async () => {
        pyodideWorker.terminate()
        setPyodideState({ready: false, executing: false})
        setupPyodide()
    }

    const updateEditorWidth = (size: number) => {
        setEditorWidth(size)
        localStorage.setItem("editorWidth", size.toString())
    }

    return (
        <Box my={3}>
            <Box mx={3}>
                <Grid2 container spacing={3}>
                    <Grid2 position="relative">
                        <ResizableBox
                            width={editorWidth}
                            height={Infinity}
                            axis="x"
                            resizeHandles={["e"]}
                            minConstraints={[400, Infinity]}
                            maxConstraints={[window.innerWidth-63, Infinity]}
                            onResizeStop={(event, {size}) => updateEditorWidth(size.width)}
                            handle={<Box sx={{
                                position: "absolute",
                                right: -24,
                                top: 0,
                                width: "30px",
                                height: "100%",
                                cursor: "ew-resize"
                            }} />}>
                                <Box>
                                    <DefaultEditor editorViewRef={editorViewRef} originalCode="" />
                                    <Box mt={3}>
                                        <Grid2 container spacing={3} alignItems="center">
                                            <Grid2 minWidth={200}>
                                                <Box>
                                                    <GreenPrimaryButton fullWidth disabled={pyodideState.executing || !pyodideState.ready}
                                                        onClick={() => runCode()}>
                                                        Run Code
                                                    </GreenPrimaryButton>
                                                </Box>
                                            </Grid2>
                                            <Grid2 minWidth={200}>
                                                <Box>
                                                    <RedPrimaryButton fullWidth disabled={!pyodideState.executing || !pyodideState.ready}
                                                    onClick={() => cancelCode()}>
                                                        Cancel Run
                                                    </RedPrimaryButton>
                                                </Box>
                                            </Grid2>
                                            <Grid2 flex={1} />
                                            <EditorFullScreenDialog editorViewRef={editorViewRef} />
                                        </Grid2>
                                    </Box>
                                </Box>
                        </ResizableBox>
                    </Grid2>
                    <Grid2 position="relative" minWidth={300} flex={1}>
                        <Terminal pyodideWorker={pyodideWorker} pyodideState={pyodideState} clearCount={0} />
                        <DefaultErrorDisplay error={executionError} />
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    )
}