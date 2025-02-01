import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import WorkerManager from "./WorkerManager";


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

    const listener = (event: MessageEvent) => {
        console.log("from antoher", event)
        if (event.data.type === "print") {
            setOutput((prev) => [...prev, event.data.msg as string])
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
            console.log("resetting output")
            setOutput([])
        }
    }, [pyodideState])

    useMemo(() => {
        setOutput([])
    }, [clearCount])

    console.log('output', output)

    return (
        <Box height={height || "500px"} border="1px solid #000" p={1} overflow="scroll">
            {output.map((line, i) => (
                <Box key={i} whiteSpace="pre" fontSize="1.3rem">
                    {line}
                </Box>
            ))}
        </Box>
    )
}