import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import WorkerManager from "./WorkerManager";


interface Props {
    pyodideWorker: WorkerManager|null;
    pyodideState: {
        ready: boolean;
        executing: boolean;
    }
}


export function Terminal({pyodideWorker, pyodideState}: Props) {

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

    console.log('output', output)

    return (
        <Box>
            {output.map((line, i) => (
                <Box key={i}>
                    {line}
                </Box>
            ))}
        </Box>
    )
}