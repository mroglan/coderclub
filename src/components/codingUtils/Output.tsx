import { Box, Grid2, TextField } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import WorkerManager from "./WorkerManager";
import { GreenPrimaryButton } from "../misc/buttons";


interface Props {
    pyodideWorker: WorkerManager|null;
    pyodideState: {
        ready: boolean;
        executing: boolean;
    }
    clearCount: number;
    height?: number;
}


export function Terminal({pyodideWorker, pyodideState, clearCount, height}: Props) {

    const [output, setOutput] = useState<string[]>([])
    const [waitingForInput, setWaitingForInput] = useState(false)
    const [input, setInput] = useState("")

    const printLength = useRef<number>(0)

    const listener = (event: MessageEvent) => {
        console.log("from antoher", event)
        if (printLength.current < 0) return
        if (event.data.type === "print") {
            setOutput((prev) => {
                printLength.current += event.data.msg.split("\n").length
                if (printLength.current > 10000) {
                    printLength.current = -1
                    return [...prev, event.data.msg as string, "Print limit exceeded! No more messages will be shown.\nDo you have an infinite loop perhaps?"]
                }
                return [...prev, event.data.msg as string]
            })
        }
        if (event.data.type === "input") {
            setOutput((prev) => [...prev, event.data.prompt as string])
            setWaitingForInput(true)
            setInput("")
        }
    }
    
    useMemo(() => {
        if (!pyodideWorker) return

        if (pyodideWorker.numListeners() > 1) return

        pyodideWorker.addListener(listener)

    }, [pyodideWorker])

    useMemo(() => {
        if (output.length === 0) return

        if (pyodideState.executing) {
            setOutput([])
            printLength.current = 0
        } else {
            setWaitingForInput(false)
            setInput("")
        }
    }, [pyodideState])

    useMemo(() => {
        setOutput([])
    }, [clearCount])

    const submitInput = () => {
        pyodideWorker.postMessage({
            type: "input_response",
            value: input
        })
        setWaitingForInput(false)
        setInput("")
    }

    console.log('output', output)

    return (
        <Box>
            <Box height={height || "500px"} border="1px solid #000" p={1} overflow="scroll">
                {output.map((line, i) => (
                    <Box key={i} whiteSpace="pre" fontSize="1.3rem">
                        {line}
                    </Box>
                ))}
            </Box>
            {waitingForInput && <Box mt={1}>
                <Grid2 container spacing={3} alignItems="center">
                    <Grid2 flex={1}>
                        <TextField fullWidth value={input} InputProps={{
                            style: {fontSize: "1.4rem"}
                        }} placeholder="Enter your input here!"
                        onChange={(e) => setInput(e.target.value)} onKeyDown={(event) => {
                            if (event.key === "Enter") submitInput()
                        }}/>
                    </Grid2>
                    <Grid2 width={150}>
                        <GreenPrimaryButton fullWidth onClick={() => submitInput()}>
                            Enter
                        </GreenPrimaryButton>
                    </Grid2>
                </Grid2>
            </Box>}
        </Box>
    )
}