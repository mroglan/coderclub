"use client";

import { useState, useEffect } from "react";

const Main = () => {
    const [worker, setWorker] = useState(null);
    const [output, setOutput] = useState("");
    const [inputPrompt, setInputPrompt] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        console.log('effect')
        if (worker) return

        const pyodideWorker = new Worker("/pyodide.js", {type: "module"});
        setWorker(pyodideWorker);

        pyodideWorker.onmessage = (event) => {
            if (event.data.type === "log") {
                console.log("JS Function Output:", event.data.message);
                setOutput((prev) => prev + "\n" + event.data.message);
            } else if (event.data.type === "result") {
                setOutput((prev) => prev + "\nPython Result: " + event.data.data);
            } else if (event.data.type === "error") {
                setOutput("Error: " + event.data.error);
            } else if (event.data.type === "input_request") {
                setInputPrompt(event.data.prompt);
            }
        };

        return () => {
            pyodideWorker.terminate();
        };
    }, []);

    const runPyodide = () => {
        if (!worker) {
            const pyodideWorker = new Worker("/pyodide.js", {type: "module"});
            setWorker(pyodideWorker);

            pyodideWorker.onmessage = (event) => {
                if (event.data.type === "log") {
                    console.log("JS Function Output:", event.data.message);
                    setOutput((prev) => prev + "\n" + event.data.message);
                } else if (event.data.type === "result") {
                    setOutput((prev) => prev + "\nPython Result: " + event.data.data);
                } else if (event.data.type === "error") {
                    setOutput("Error: " + event.data.error);
                } else if (event.data.type === "input_request") {
                    setInputPrompt(event.data.prompt);
                }
            };
        }
        else {
            setOutput(""); // Clear previous output
            worker.postMessage({
                code: `
    import js_functions
    js_functions.logMessage("Good day!")
    name = await js_functions.getInput("Enter your name: ")
    js_functions.logMessage(f"Hello, {name}!")
    "Python execution finished"
    `
            });
        }
    };

    const sendInput = () => {
        worker.postMessage({ type: "input_response", value: inputValue });
        setInputPrompt(""); // Hide input prompt
        setInputValue("");  // Clear input field
    };

    const stopPyodide = () => {
        if (worker) {
            worker.terminate();
            setWorker(null);
        }
    };

    return (
        <div>
            <button onClick={runPyodide}>Run Pyodide</button>
            <button onClick={stopPyodide}>Stop Pyodide</button>

            {inputPrompt && (
                <div>
                    <p>{inputPrompt}</p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button onClick={sendInput}>Submit</button>
                </div>
            )}

            <pre>{output}</pre>
        </div>
    );
};

export default Main;
