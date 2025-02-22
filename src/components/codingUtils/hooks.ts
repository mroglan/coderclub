import { useEffect, useMemo, useState } from "react"
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