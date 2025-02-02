import { Box, Paper, Typography } from "@mui/material";
import { Dispatch, RefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { indentMore, indentLess } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";


interface DefaultEditorProps {
    originalCode: string;
    editorViewRef: RefObject<EditorView|null>;
    height?: string;
}


export function DefaultEditor({originalCode, editorViewRef, height}: DefaultEditorProps) {

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && !editorViewRef.current) {
            console.log('seting editor')
            const state = EditorState.create({
                doc: originalCode,
                extensions: [
                    basicSetup, 
                    python(),
                    EditorView.theme({
                        "&": { height: "100%", width: "100%" }, // Ensures the editor expands
                        ".cm-scroller": { height: "100%", overflow: "auto" }, // Makes the scroller take full height
                    }),
                    EditorView.editable.of(true),
                    keymap.of([
                        { key: "Tab", run: indentMore }, 
                        { key: "Shift-Tab", run: indentLess }
                    ])
                ],
            });
            editorViewRef.current = new EditorView({
                state,
                parent: editorRef.current
            });
        }
    }, []);

    return (
        <Box>
            <Paper elevation={5}>
                <Box pt={1}>
                    <div ref={editorRef} style={{height: height || "500px"}} />
                </Box>
            </Paper>
        </Box>
    )
}


interface EditorTabsProps {
    tabs: string[];
    selectedTab: string;
    // setSelectedTab: Dispatch<SetStateAction<string>>;
    setSelectedTab: (tab: string) => void;
}


export function EditorTabs({tabs, selectedTab, setSelectedTab}: EditorTabsProps) {

    const onClick = (tab: string) => {
        if (tab === selectedTab) return

        setSelectedTab(tab)
    }

    return (
        <Box mt={3} mb={1}>
            {tabs.map(tab => (
                <Box key={tab} sx={{
                    display: "inline", 
                    bgcolor: tab === selectedTab ? "#fff" : "default",
                    boxShadow: tab === selectedTab ? `
                        -1px -1px 1px rgba(0, 0, 0, 0.2), /* Left shadow */
                        1px -1px 1px rgba(0, 0, 0, 0.2),  /* Right shadow */
                        0px -1px 1px rgba(0, 0, 0, 0.2);` : "default",
                    cursor: "pointer",
                    "&:hover": {
                        color: "hsl(287, 71%, 52%)"
                    }
                    }}
                    px={3} py={2} onClick={() => onClick(tab)} > 
                    <Typography variant="h6" sx={{display: "inline"}} color="inherit">
                        {tab}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}