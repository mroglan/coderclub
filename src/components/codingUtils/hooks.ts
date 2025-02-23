import { useEffect, useMemo, useRef, useState } from "react"
import WorkerManager from "./WorkerManager"
import { ScriptAdjustments } from "./scriptAdjustments"

export function usePyodide() {

    const [manager, setManager] = useState<WorkerManager|null>(null)
    const [state, setState] = useState({
        ready: false,
        executing: false,
        executionError: ""
    })

    const pyodideListener = (event: MessageEvent) => {
        if (event.data.type === "ready") {
            setState({ready: true, executing: false, executionError: ""})
        }
        if (event.data.type === "result" || event.data.type === "error") {
            setState({ready: true, executing: false, executionError: event.data.error || ""})
        }
    }

    const setupPyodide = () => {
        const w = new WorkerManager("/pyodide.js")
        w.addListener(pyodideListener)
        setManager(w)
    }

    useEffect(() => {
        if (manager) return
        setupPyodide()
    }, [])

    const restart = async () => {
        manager.terminate()
        setState({ready: false, executing: false, executionError: ""})
        setupPyodide()
    }

    const executeCode = (code: string) => {
        manager.postMessage({
            type: "execute",
            code: code
        })
        setState({...state, executing: true})
    }

    return {
        manager, state, restart, executeCode
    }
}


export function useImages() {

    const [meta, setMeta] = useState({
        image: "",
        resolution: 0
    })
    const [images, setImages] = useState([])

    const names = useMemo(() => images.map(img => img.name), [images])

    const importJSON = (data) => {
        if (!data.meta?.image || !data.frames || Object.keys(data.frames).length < 1) {
            return "Invalid JSON."
        }
        const image = data.meta.image
        const resolution = (Object.values(data.frames)[0] as any).frame.w
        const imgs = Object.keys(data.frames).map(key => (
            {
                name: key.split(".")[0].replace(" ", "_"),
                x: data.frames[key].frame.x,
                y: data.frames[key].frame.y
            }
        ))

        setMeta({image, resolution})
        setImages(imgs)
        return ""
    }

    const updateName = (name: string, i: number) => {
        if (names.includes(name)) return
        const copy = [...images]
        copy[i].name = name
        setImages(copy)
    }

    return {
        names, meta, images, importJSON, updateName
    }
}


export function useCanvas(images: ReturnType<typeof useImages>, executing: boolean) {

    const htmlImage = useMemo(() => {
        const img = new Image()
        if (images.meta.image) {
            img.src = images.meta.image
        }
        return img
    }, [images])

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const cancel = useRef<boolean>(false)
    const lastAnimationTime = useRef<number>(null)
    const data = useRef<any>({})

    useMemo(() => {
        if (!executing) {
            cancel.current = true
        }
    }, [executing])

    useEffect(() => {
        if (!executing) return

        cancel.current = false

        const loop = (time: number) => {
            if (cancel.current) {
                data.current = {}
                lastAnimationTime.current = null
                return
            }
            if (!lastAnimationTime.current) {
                lastAnimationTime.current = time
                requestAnimationFrame(loop)
                return
            }
            const delta = (time - lastAnimationTime.current) / 1000 // seconds since last animation
            lastAnimationTime.current = time
            
            const ctx = canvasRef.current.getContext("2d")
            const w = canvasRef.current.width
            const h = canvasRef.current.height

            ctx.clearRect(0, 0, w, h)

            for (const key of Object.keys(data.current)) {
                const drawing = data.current[key]
                if (drawing.type === "image") {
                    const props = images.images.find(img => img.name === key)
                    if (drawing.movement === "static") {
                        ctx.drawImage(
                            htmlImage,
                            props.x, props.y,
                            images.meta.resolution, images.meta.resolution,
                            drawing.x*w - (drawing.w*w / 2), drawing.y*h - (drawing.h*h / 2),
                            drawing.w*w, drawing.h*h
                        )
                    }
                }
            }

            console.log('finished animation')

            requestAnimationFrame(loop)
        }
        canvasRef.current.getContext("2d").imageSmoothingEnabled = false
        requestAnimationFrame(loop)
    }, [executing]) 

    return {
        canvasRef, data
    }
}