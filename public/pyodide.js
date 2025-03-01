import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

let pyodide;

const loadPyodideInstance = async () => {
    pyodide = await loadPyodide();

    self.printMsg = []
    self.lastPrintSend = Date.now()
    self.numPrints = 0

    pyodide.globals.set("print", msg => {
        // self.printMsg.push(msg)
        // if (Date.now() - self.lastPrintSend < 100) return
        if (typeof msg !== "string") {
            throw new Error("Expected string passed to print()!")
        }

        self.numPrints += 1
        if (self.numPrints > 5000) return

        self.postMessage({type: "print", msg})
        // self.postMessage({type: "print", msg: self.printMsg.join("\n")})
        // self.printMsg = []
        // self.lastPrintSend = Date.now()
    })

    pyodide.globals.set("input", async (prompt) => {
        if (typeof prompt !== "string") {
            throw new Error("Expected string passed to input()!")
        }
        const p = [...self.printMsg, `[prompt] ${prompt}`].join("\n")
        self.printMsg = []
        return new Promise((resolve) => {
            self.inputResolver = resolve
            self.postMessage({type: "input", prompt: p})
        })
    })

    pyodide.globals.set("__get_canvas_state", async () => {
        return new Promise(resolve => {
            self.canvasStateResolver = resolve
            self.postMessage({type: "canvas_data_req"})
        })
    })

    pyodide.globals.set("__clear_print_queue", () => {
        if (self.printMsg.length < 1) return
        self.postMessage({type: "print", msg: self.printMsg.join("\n")})
        self.printMsg = []
        self.lastPrintSend = Date.now()
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
            // self.postMessage({type: "print", msg: `I saw ${JSON.stringify(event.data.value)}`})
            self.canvasStateResolver(event.data.value)
            self.canvasStateResolver = null
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