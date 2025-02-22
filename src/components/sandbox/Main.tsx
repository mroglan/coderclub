import { Box, Container, Grid2 } from "@mui/material";
import { DefaultEditor, EditorTabs, EditorWrapper, LowerToolbar } from "../codingUtils/Editor";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { Terminal } from "../codingUtils/Output";
import { DefaultErrorDisplay } from "../codingUtils/ErrorDisplay";
import { useImages, usePyodide } from "../codingUtils/hooks";
import { Environment } from "@/utils/constants";
import EnvironmentSelector from "../codingUtils/EnvironmentSelector";
import ImageEditor from "../codingUtils/Images";


export default function Main() {

    const editorViewRef = useRef<EditorView>(null);

    const [env, setEnv] = useState(Environment.CONSOLE)

    const [selectedTab, setSelectedTab] = useState("My Code")

    const tabs = useMemo(() => {
        if (env !== Environment.CONSOLE) {
            return ["My Code", "Images"]
        }
        return null
    }, [env])

    useMemo(() => setSelectedTab("My Code"), [env])

    const pyodide = usePyodide()

    const images = useImages()

    return (
        <Box my={3}>
            <Box mx={3}>
                <Box mb={3}>
                    <EnvironmentSelector env={env} setEnv={setEnv} />
                </Box>
                <Grid2 container spacing={3}>
                    <Grid2 position="relative">
                        <EditorWrapper
                            main={
                            <>
                                {tabs && <EditorTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                                {
                                    selectedTab === "Images" ?
                                    <ImageEditor images={images} /> :
                                    <DefaultEditor editorViewRef={editorViewRef} originalCode="" />
                                }
                            </>
                            } 
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