import { useEffect, useMemo, useRef, useState } from "react"
import WorkerManager from "./WorkerManager"
import { ScriptAdjustments } from "./scriptAdjustments"
import { TutorialProgress } from "@/database/interfaces/TutorialProgress"

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
        setState({...state, executing: true, executionError: ""})
    }

    return {
        manager, state, restart, executeCode
    }
}


export function useImages(initial?: TutorialProgress["images"], onUpdate?: () => void) {

    const [meta, setMeta] = useState(initial ? initial.meta : {
        image: "",
        resolution: 0
    })
    const [images, setImages] = useState(initial ? initial.images : [])

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
        onUpdate && onUpdate()
        return ""
    }

    const updateName = (name: string, i: number) => {
        if (names.includes(name)) return
        const copy = [...images]
        copy[i].name = name
        setImages(copy)
        onUpdate && onUpdate()
    }

    return {
        names, meta, images, importJSON, updateName
    }
}


export function useCanvas(pyodideManager: WorkerManager, 
    images: ReturnType<typeof useImages>, executing: boolean, defaults: any = {}) {

    const drawingOutOfBounds = (x, y, w, h) => {
        const w2 = w/2
        const h2 = h/2

        if (x + w2 < 0) return true
        if (x - w2 > 1) return true
        if (y + h2 < 0) return true
        if (y - h2 > 1) return true
        return false
    }

    const htmlImage = useMemo(() => {
        const img = new Image()
        if (images.meta.image) {
            img.src = images.meta.image
        }
        return img
    }, [images])

    const defaultHtmlImage = useMemo(() => {
        if (!defaults.image) return
        const img = new Image()
        img.src = defaults.image.meta.image
        return img
    }, [defaults])

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const cancel = useRef<boolean>(false)
    const lastAnimationTime = useRef<number>(null)
    const data = useRef<any>({})

    useMemo(() => {
        if (!executing) {
            cancel.current = true
        }
    }, [executing])

    const listener = (event: MessageEvent) => {
        if (event.data.type === "canvas_data_req") {
            const msg:any = {}
            msg.images = {}
            for (const key of Object.keys(data.current.images)) {
                const d = data.current.images[key]
                msg.images[key] = {
                    name: d.name,
                    x: d.x, y: d.y, w: d.w, h: d.h
                }
            }
            pyodideManager.postMessage({
                type: "canvas_state",
                value: msg
            })
        }
    }

    useEffect(() => {
        if (!pyodideManager) return

        if (pyodideManager.listenerExists("canvasHook")) return

        pyodideManager.addListener(listener, "canvasHook")

        return () => pyodideManager.removeListener(listener, "canvasHook")
    }, [pyodideManager])

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

            for (const key of Object.keys(data.current.images || {})) {
                const drawing = data.current.images[key]
                let props = images.images.find(img => img.name === drawing.name)
                let meta = images.meta
                let img = htmlImage
                if (!props) {
                    props = defaults.image?.images.find(img => img.name === drawing.name)
                    img = defaultHtmlImage
                    meta = defaults.image?.meta
                }
                if (!props) {
                    console.log("Image not found! Bad things will happen...")
                }
                if (drawing.movement === "static") {
                    ctx.drawImage(
                        img,
                        props.x, props.y,
                        meta.resolution, meta.resolution,
                        drawing.x*w - (drawing.w*w / 2), drawing.y*h - (drawing.h*h / 2),
                        drawing.w*w, drawing.h*h
                    )
                } else if (drawing.movement === "constant") {
                    if (drawing.autodelete && drawingOutOfBounds(drawing.x, drawing.y, drawing.w, drawing.h)) {
                        delete data.current.images[key]
                        continue
                    }
                    drawing.x += drawing.vel.x*delta
                    drawing.y += drawing.vel.y*delta
                    ctx.drawImage(
                        img,
                        props.x, props.y,
                        meta.resolution, meta.resolution,
                        drawing.x*w - (drawing.w*w / 2), drawing.y*h - (drawing.h*h / 2),
                        drawing.w*w, drawing.h*h
                    )
                }
            }

            requestAnimationFrame(loop)
        }
        canvasRef.current.getContext("2d").imageSmoothingEnabled = false
        requestAnimationFrame(loop)
    }, [executing]) 

    return {
        canvasRef, data
    }
}