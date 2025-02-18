import { Box, Container, Grid2 } from "@mui/material";
import { DefaultEditor, EditorWrapper, LowerToolbar } from "../codingUtils/Editor";
import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { Terminal } from "../codingUtils/Output";
import { DefaultErrorDisplay } from "../codingUtils/ErrorDisplay";
import { usePyodide } from "../codingUtils/hooks";


export default function Main() {

    const editorViewRef = useRef<EditorView>(null);

    const pyodide = usePyodide()

    return (
        <Box my={3}>
            <Box mx={3}>
                <Grid2 container spacing={3}>
                    <Grid2 position="relative">
                        <EditorWrapper
                            main={<DefaultEditor editorViewRef={editorViewRef} originalCode="" />} 
                            lowerToolbar={<LowerToolbar pyodide={pyodide} editorViewRef={editorViewRef} />}
                        />
                    </Grid2>
                    <Grid2 position="relative" minWidth={300} flex={1}>
                        <Terminal pyodideWorker={pyodide.manager} pyodideState={pyodide.state} clearCount={0} />
                        <DefaultErrorDisplay error={pyodide.state.executionError} />
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    )
}