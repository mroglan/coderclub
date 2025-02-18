import { useEffect, useState } from "react"
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