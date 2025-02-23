import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

let pyodide;

const loadPyodideInstance = async () => {
    pyodide = await loadPyodide();

    self.printMsg = []
    self.lastPrintSend = Date.now()

    pyodide.globals.set("print", msg => {
        self.printMsg.push(msg)
        if (Date.now() - self.lastPrintSend < 100) return

        self.postMessage({type: "print", msg: self.printMsg.join("\n")})
        self.printMsg = []
        self.lastPrintSend = Date.now()
    })

    pyodide.globals.set("input", async (prompt) => {
        const p = [...self.printMsg, `[prompt] ${prompt}`].join("\n")
        self.printMsg = []
        return new Promise((resolve) => {
            self.inputResolver = resolve
            self.postMessage({type: "input", prompt: p})
        })
    })

    pyodide.globals.set("__get_canvas_state", async () => {
        return new Promise(resolve => {
            if (self.canvasState) {
                resolve(self.canvasState)
            } else {
                self.canvasStateResolver = resolve
            }
        })
    })

    self.postMessage({type: "ready"}); // Notify main thread that Pyodide is ready
};


loadPyodideInstance()


self.onmessage = async (event) => {
    if (event.data.type === "input_response") {
        if (self.inputResolver) {
            self.inputResolver(event.data.value);
            self.inputResolver = null;
        }
        return
    }

    if (event.data.type === "canvas_state") {
        if (self.canvasStateResolver) {
            self.canvasStateResolver(event.data.value)
            self.canvasStateResolver = null
        } else {
            self.canvasState = event.data.value
        }
    }

    if (event.data.type === "execute") {
        try {
            self.canvasState = null
            self.canvasStateResolver = null
            self.inputResolver = null
            const result = await pyodide.runPythonAsync(event.data.code)
            if (self.printMsg.length > 0) {
                self.postMessage({type: "print", msg: self.printMsg.join("\n")})
                self.printMsg = []
            }
            self.postMessage({type: "result", data:result});
        } catch (e) {
            self.postMessage({type: "error", error:e.message});
        }
    }
}