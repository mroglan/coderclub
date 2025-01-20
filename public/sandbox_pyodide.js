import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

self.onmessage = async (event) => {
    if (event.data.type === "stop") {
        self.close();
    } else if (event.data.type === "input_response") {
        // Resume Python execution by resolving the promise
        if (self.inputResolver) {
            self.inputResolver(event.data.value);
            self.inputResolver = null;
        }
    } else {
        // importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

        if (!self.pyodide) {
            self.pyodide = await loadPyodide();
        }

        self.pyodide.registerJsModule("js_functions", {
            logMessage: (msg) => {
                self.postMessage({ type: "log", message: msg });
            },
            getInput: async (prompt) => {
                return new Promise((resolve) => {
                    self.inputResolver = resolve;
                    self.postMessage({ type: "input_request", prompt });
                });
            }
        });

        try {
            const result = await self.pyodide.runPythonAsync(event.data.code);
            self.postMessage({ type: "result", data: result });
        } catch (e) {
            self.postMessage({ type: "error", error: e.message });
        }
    }
};
