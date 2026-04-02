"use client";
import { PythonProvider, usePython } from "react-py";
import { useCallback, useEffect, useState } from "react";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

export default function Page() {
  useEffect(() => {
    async function init() {
      // @ts-expect-error to load pyodide
      const pyodide = await window.loadPyodide();

      await pyodide.loadPackage("pyodide-http");
      console.log("Pyodide is ready.");
    }
  }, []);

  const [code, setCode] = useState("# Write your python code here:");

  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const onChange = useCallback((val: string) => {
    setCode(val);
  }, []);

  function handleRun() {
    runPython(code);
  }

  return (
    <div className="p-6">
      <PythonProvider>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <CodeMirror
            value={code}
            theme="dark"
            onChange={onChange}
            extensions={[python()]}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
            }}
            height="300px"
            className="w-full lg:w-1/2"
          />
          <div className="flex flex-col w-full lg:w-1/2 gap-4">
            <button
              className={`btn btn-primary mt-2 ${isRunning ? "loading" : ""}`}
              onClick={handleRun}
              disabled={isLoading}
            >
              {isRunning ? "Loading" : "Run Code"}
            </button>
            <div className="bg-black text-white h-full p-4 font-mono rounded-lg">
              <p className="text-gray-500">Output:</p>
              <pre>{stdout || stderr}</pre>
            </div>
          </div>
        </div>
      </PythonProvider>
    </div>
  );
}
