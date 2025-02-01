import { Box, Container, Grid2 } from "@mui/material";
import { DefaultEditor } from "../codingUtils/Editor";
import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { Terminal } from "../codingUtils/Output";
import WorkerManager from "../codingUtils/WorkerManager";
import { GreenPrimaryButton } from "../misc/buttons";
import { ScriptAdjustments } from "../codingUtils/scriptAdjustments";
import { DefaultErrorDisplay } from "../codingUtils/ErrorDisplay";


export default function Main() {

    const editorViewRef = useRef<EditorView>(null);

    const [pyodideWorker, setPyodideWorker] = useState<WorkerManager|null>(null)
    const [pyodideState, setPyodideState] = useState({
        ready: false,
        executing: false,
    })
    const [executionError, setExecutionError] = useState("")

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

    useEffect(() => {
        if (pyodideWorker) return
        const worker = new WorkerManager("/pyodide.js")
        worker.addListener(pyodideListener)
        setPyodideWorker(worker)
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
            code: editorViewRef.current.state.doc.toString()
        })
        setPyodideState({...pyodideState, executing: true})
        setExecutionError("")
    }

    return (
        <Box my={3}>
            <Container maxWidth="xl">
                <Box mx={3}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 6}}>
                            <DefaultEditor editorViewRef={editorViewRef} originalCode="" />
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
                            <Terminal pyodideWorker={pyodideWorker} pyodideState={pyodideState} clearCount={0} />
                            <DefaultErrorDisplay error={executionError} />
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </Box>
    )
}