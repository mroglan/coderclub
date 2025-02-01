import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

let pyodide;

const loadPyodideInstance = async () => {
    pyodide = await loadPyodide();

    // pyodide.registerJsModule("js_functions", {
    //     print: (msg) => {
    //         self.postMessage({type: "print", msg});
    //     },
    //     input: async (prompt) => {
    //         return new Promise((resolve) => {
    //             self.inputResolver = resolve;
    //             self.postMessage({type: "status", status: "waiting_for_input", prompt});
    //         });
    //     }
    // });

    pyodide.globals.set("print", msg => {
        self.postMessage({type: "print", msg})
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

    if (event.data.type === "execute") {
        try {
            const result = await pyodide.runPythonAsync(event.data.code)
            self.postMessage({type: "result", data:result});
        } catch (e) {
            self.postMessage({type: "error", error:e.message});
        }
    }
}