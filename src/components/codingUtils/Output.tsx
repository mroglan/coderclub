import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import WorkerManager from "./WorkerManager";


interface Props {
    pyodideWorker: WorkerManager|null;
}


export function Terminal({pyodideWorker}: Props) {

    const [output, setOutput] = useState<string[]>([])

    const listener = (event: MessageEvent) => {
        console.log("from antoher", event)
        if (event.data.type === "log") {
            // output.push(event.data.msg as string)
            setOutput([...output, event.data.msg as string])
        }
    }
    
    useMemo(() => {
        if (!pyodideWorker) return

        if (pyodideWorker.numListeners() > 1) return

        pyodideWorker.addListener(listener)

    }, [pyodideWorker])

    console.log('output', output)

    return (
        <Box>
            terminal
        </Box>
    )
}