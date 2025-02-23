import { Box, Grid2, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import WorkerManager from "./WorkerManager";
import { GreenPrimaryButton } from "../misc/buttons";
import { Environment } from "@/utils/constants";
import { EditorTabs } from "./Editor";
import { useCanvas, useImages } from "./hooks";


interface TerminalProps {
    pyodideWorker: WorkerManager|null;
    pyodideState: {
        ready: boolean;
        executing: boolean;
    }
    clearCount: number;
    height?: number;
}


export function Terminal({pyodideWorker, pyodideState, clearCount, height}: TerminalProps) {

    const [output, setOutput] = useState<string[]>([])

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
        }
    }
    
    useMemo(() => {
        if (!pyodideWorker) return

        if (pyodideWorker.listenerExists("terminal")) return

        pyodideWorker.addListener(listener, "terminal")

    }, [pyodideWorker])

    useMemo(() => {
        if (output.length === 0) return

        if (pyodideState.executing) {
            setOutput([])
            printLength.current = 0
        } 
    }, [pyodideState])

    useMemo(() => {
        setOutput([])
    }, [clearCount])

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
        </Box>
    )
}


interface AvatarCanvasProps {
    pyodideWorker: WorkerManager|null;
    pyodideState: TerminalProps["pyodideState"];
    height?: number;
    images: ReturnType<typeof useImages>;
}


function AvatarCanvas({images, pyodideWorker, pyodideState, height}: AvatarCanvasProps) {

    const {canvasRef, data} = useCanvas(images, pyodideState.executing)

    const containerRef = useRef<HTMLDivElement>(null)

    const executingRef = useRef<boolean>(false)

    useMemo(() => executingRef.current = pyodideState.executing, [pyodideState])

    useMemo(() => {
        if (pyodideState.executing) {
            canvasRef.current.width = containerRef.current.clientWidth
            canvasRef.current.height = containerRef.current.clientWidth
        }
    }, [pyodideState])

    useMemo(() => {
        if (pyodideState.executing && Object.keys(data.current).length < 1) {
            data.current = {
                avatar: {
                    type: "image",
                    movement: "static",
                    x: .50,
                    y: .50,
                    w: .10,
                    h: .10
                }
            }
        }
    }, [pyodideState])

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (!executingRef.current) {
                canvasRef.current.width = 0
                canvasRef.current.height = 0
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <Box ref={containerRef} 
        width={`min(calc(100vh - 250px), max(100%, ${height || "500px"}))`}
        height="auto"
        sx={{aspectRatio: "1/1"}} 
        border="1px solid #000">
            <canvas ref={canvasRef} />
        </Box>
    )
}


interface OutputManagerProps extends TerminalProps {
    env: string;
    images: ReturnType<typeof useImages>;
}


export function OutputManager({env, images, pyodideWorker, pyodideState, clearCount, height}: OutputManagerProps) {

    const [waitingForInput, setWaitingForInput] = useState(false)
    const [input, setInput] = useState("")
    const [prompt, setPrompt] = useState("")

    const [selectedTab, setSelectedTab] = useState("Console")

    const tabs = useMemo(() => {
        if (env !== Environment.CONSOLE) {
            return ["Console", "Canvas"]
        }
        return null
    }, [env])

    useMemo(() => setSelectedTab("Console"), [env])

    const listener = (event: MessageEvent) => {
        if (event.data.type === "input") {
            setPrompt(event.data.prompt.split("\n").at(-1).replace("[prompt] ", ""))
            setWaitingForInput(true)
            setInput("")
        }
    }

    useMemo(() => {
        if (!pyodideWorker) return

        if (pyodideWorker.listenerExists("outputManager")) return

        pyodideWorker.addListener(listener, "outputManager")

    }, [pyodideWorker])

    useMemo(() => {
        setWaitingForInput(false)
    }, [pyodideState])

    const submitInput = () => {
        pyodideWorker.postMessage({
            type: "input_response",
            value: input
        })
        setWaitingForInput(false)
    }

    return (
        <Box>
            {tabs && 
            <Box mb="10px">
                <EditorTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={tabs} />
            </Box>
            }
            <Box display={selectedTab === "Console" ? undefined : "none"}>
                <Terminal pyodideWorker={pyodideWorker} pyodideState={pyodideState}
                    clearCount={clearCount} height={height} />
            </Box>
            {env !== Environment.CONSOLE && 
            <Box display={selectedTab === "Canvas" ? undefined : "none"} >
                <AvatarCanvas images={images} pyodideWorker={pyodideWorker} pyodideState={pyodideState}
                    height={height} />
            </Box>}
            {waitingForInput && <Box>
                <Box>
                    <Typography variant="body1" color="success.dark" fontSize="1.3rem">
                        {prompt}
                    </Typography>
                </Box>
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