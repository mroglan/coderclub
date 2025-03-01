import { Box, Grid2, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import WorkerManager from "./WorkerManager";
import { GreenPrimaryButton } from "../misc/buttons";
import { Environment } from "@/utils/constants";
import { EditorTabs } from "./Editor";
import { useCanvas, useImages } from "./hooks";
import { DEFAULT_IMAGES } from "./Images";


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

    const containerRef = useRef<HTMLDivElement>(null)
    const childRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        childRef.current.style.width = containerRef.current.clientWidth.toString() + "px"
        const observer = new ResizeObserver(() => {
            if (childRef.current) {
                childRef.current.style.width = containerRef.current.clientWidth.toString() + "px"
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <Box ref={containerRef}>
            <Box ref={childRef} height={height || "500px"} border="1px solid #000" p={1} overflow="scroll">
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

    const {canvasRef, data} = useCanvas(pyodideWorker, images, pyodideState.executing, {
        image: DEFAULT_IMAGES.avatar
    })

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
                images: {
                    1: {
                        name: "avatar",
                        movement: "static",
                        x: .50,
                        y: .50,
                        w: .20,
                        h: .20
                    },
                }
            }
        }
    }, [pyodideState])

    const listener = (event: MessageEvent) => {
        if (event.data.type !== "print") return
        if (Object.keys(data.current.images).length > 100) return
        console.log('received print', event.data.msg)
        const cmds = event.data.msg.split("\n")
        for (let cmd of cmds) {
            cmd = cmd.trim().split(" ")
            if (!["fire", "water", "earth", "air"].includes(cmd.at(0))) continue
            let dir = cmd.at(1)
            let f = []
            if (dir == "up") f = [0,-1]
            else if (dir == "left") f = [-1, 0]
            else if (dir == "down") f = [0, 1]
            else f = [1, 0]
            const d = {
                name: cmd[0],
                movement: "constant",
                x: .5, y: .5, w: .1, h: .1,
                vel: {
                    x: .2 * f[0],
                    y: .2 * f[1]
                },
                autodelete: true
            }
            const id = Math.random().toString(16).slice(2)
            data.current.images[id] = d
        }
    }

    useEffect(() => {
        if (!pyodideWorker) return

        if (pyodideWorker.listenerExists("avatarCanvas")) return

        pyodideWorker.addListener(listener, "avatarCanvas")

        return () => pyodideWorker.removeListener(listener, "avatarCanvas")
    }, [pyodideWorker])

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (!executingRef.current
                && containerRef.current.clientWidth
                && containerRef.current.clientWidth !== canvasRef.current.width) {
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