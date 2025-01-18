import { useState, useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
// import { loadPyodide, PyodideInterface } from "pyodide";

// const loadPyodide = async () => {
//   const pyodideModule = await import("pyodide");
//   return pyodideModule.loadPyodide();
// };

// const loadPyodide = async () => {
//   if (typeof window === "undefined") return null; // Ensure it only runs in the browser

//   // Dynamically load Pyodide from the CDN
//   const pyodideScript = await fetch(
//     "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.mjs"
//   ).then((res) => res.text());

//   // Evaluate the fetched script
//   const { loadPyodide } = await eval(pyodideScript);
//   return loadPyodide();
// };
import usePythonRunner from "./hook"

export default function Main() {
//   const [pyodide, setPyodide] = useState<any>(null);
  const [output, setOutput] = useState<string>("");
  const [inputQueue, setInputQueue] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  const { pyodide } = usePythonRunner()

    const userInputRef = useRef<(value: string) => void>(null);

    const [text, setText] = useState("")


//   useEffect(() => {
//     const initPyodide = async () => {
//       const pyodideInstance = await loadPyodide();
//       await pyodideInstance.runPythonAsync(`
//         import sys
//         class CustomInput:
//             def __init__(self):
//                 self.queue = []
//             def readline(self):
//                 while not self.queue:
//                     pass  # Wait for input
//                 return self.queue.pop(0) + "\\n"
//         sys.stdin = CustomInput()
//       `);
//       setPyodide(pyodideInstance);
//     };

//     initPyodide();
//   }, []);

    // useEffect(() => {
    //     if (!pyodide) return

    //     const initialize = async () => {
    //         await pyodide.runPythonAsync(`
    //             import sys
    //             import time
    //             class CustomInput:
    //                 def __init__(self):
    //                     self.queue = []
    //                 def readline(self):
    //                     i = 0
    //                     while not self.queue and i < 10:
    //                         i += 1
    //                         time.sleep(1.0)
    //                         pass  # Wait for input
    //                     if len(self.queue) == 0:
    //                         return "nothing"
    //                     else:
    //                         return self.queue.pop(0) + "\\n"
    //             sys.stdin = CustomInput()
    //         `)
    //     }
    //     initialize()
    // }, [pyodide])

  useEffect(() => {
    if (editorRef.current && !editorViewRef.current) {
      const state = EditorState.create({
        doc: "# Write your Python code here\nprint('Hello, world!')\nx = await input('Enter something: ')\nprint('You entered:', x)",
        extensions: [basicSetup, python()],
      });
      editorViewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }
  }, []);

    const getUserInput = () => {
        return new Promise<string>((resolve) => {
        // setWaitingForInput(true); // Show input field
        userInputRef.current = resolve; // Store the resolve function to be used later
        });
    };

    const input_fixed = (text) => {
        return prompt(text)
    }

  const handleRun = async () => {
    if (!pyodide || !editorViewRef.current) return;

    const code = editorViewRef.current.state.doc.toString();
    
    // Override input function
    // await pyodide.runPythonAsync(`
    //   def input(message: str = ""):
    //       import sys
    //       return sys.stdin.readline().strip()
    // `);
    // await pyodide.runPythonAsync(`
    //     from pyodide.ffi import to_js
    //     import time
    //     def input(prompt=""):
    //         print(prompt, end="")  # Print the prompt without newline
    //         future =  to_js(getUserInput()).to_py()  # Call JavaScript input handler
    //         while not future.done():
    //             time.sleep(1.0)
    //         return future.result()
    // `)
    // pyodide.globals.set("input_fixed", input_fixed)
    // pyodide.runPythonAsync(`
    //     from pyodide.ffi import to_js
    //     input = to_js(input_fixed())
    // `);

    // pyodide.setStdin({ stdin: () => prompt() })

    pyodide.globals.set("input", () => text)

    pyodide.globals.set("getUserInput", getUserInput);
    await pyodide.runPythonAsync(`
        import asyncio
        from pyodide.ffi import to_js
        async def input(prompt=""):
            return await getUserInput()
    `)

    try {
        // pyodide.globals.set("getUserInput", getUserInput);
        const stdOut = [] 
        pyodide.setStdout({ batched: (msg) => stdOut.push(msg) })
        const result = await pyodide.runPythonAsync(code);
        console.log("restult", result)
        console.log("stdOut", stdOut)
        setOutput(result.toString());
    } catch (error) {
      setOutput(error instanceof Error ? error.message : String(error));
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!pyodide) return;
    

    userInputRef.current(value)
    // setInputQueue((prevQueue) => [...prevQueue, value]);
    // pyodide.runPython(`sys.stdin.queue.append("${value}")`);
  };

  const onChange = (e) => {
    setText(e.target.value)
  }

  return (
    <div>
      <div ref={editorRef} style={{ border: "1px solid black", height: "300px" }}></div>
      <button onClick={handleRun}>Run Code</button>
      <div>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
      <input type="text" placeholder="Enter input..." onBlur={handleInput} onChange={onChange} />
    </div>
  );
};