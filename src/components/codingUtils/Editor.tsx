import { Box, Chip, Grid2, Paper, Typography } from "@mui/material";
import { Dispatch, JSX, RefObject, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { usePyodide } from "./hooks"
import { EditorView, keymap } from "@codemirror/view";
import { indentMore, indentLess } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import WorkerManager from "./WorkerManager";
import { GreenPrimaryButton, RedPrimaryButton } from "../misc/buttons";
import Undo from "./Undo";
import EditorFullScreenDialog from "./EditorFullScreenDialog";
import { ScriptAdjustments } from "./scriptAdjustments";


const DRAG_COLORS = {
    Common: "#cd43e6",
    Casting: "#4966eb"
}


const DRAG_TYPES = {
    Common: ["print", "input"],
    Casting: ["str", "int"]
}


const DRAG_ITEMS = {
    print: {
        text: "print()",
    },
    input: {
        text: "input()",
    },
    str: {
        text: "str()",
    },
    int: {
        text: "int()",
    }
}


interface DraggableChipProps {
    type: string;
    item: {
        text: string;
    };
    editorViewRef: RefObject<EditorView|null>;
}


function DraggableChip({type, item, editorViewRef}: DraggableChipProps) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "DragItem",
        item, // Pass a copy of the item
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const handleClick = () => {
        const t = editorViewRef.current.state.update({
            changes: {
                from: editorViewRef.current.state.selection.main.head,
                insert: item.text
            }
        })
        editorViewRef.current.dispatch(t)
    }

    return (
        <Chip ref={drag as any} label={item.text} style={{
            borderColor: DRAG_COLORS[type],
            color: DRAG_COLORS[type],
            cursor: "pointer",
            fontSize: "1.5rem",
            padding: "16px 16px"
        }} variant="outlined" onClick={handleClick} />
    )
}


interface DroppableEditorProps {
    editorViewRef: RefObject<EditorView|null>;
    editorRef: RefObject<HTMLDivElement|null>;
    height?: string;
}


function DroppableEditor({editorViewRef, editorRef, height}: DroppableEditorProps) {

    const [, drop] = useDrop(() => ({
        accept: "DragItem",
        drop: (item: any, monitor) => {
            const {x, y} = monitor.getClientOffset()
            const pos = editorViewRef.current.posAtCoords({x, y})
            const t = editorViewRef.current.state.update({
                changes: {
                    from: pos,
                    insert: item.text
                },
                selection: {
                    anchor: pos,
                    head: pos + item.text.length
                },

            })
            editorViewRef.current.dispatch(t)
        },
    }));

    return (
        <Box ref={drop as any}>
            <div ref={editorRef} style={{height: height || "500px"}} />
        </Box>
    )
}


interface DefaultEditorProps {
    originalCode: string;
    editorViewRef: RefObject<EditorView|null>;
    height?: string;
    dragItems?: string[];
}


export function DefaultEditor({originalCode, editorViewRef, height, dragItems}: DefaultEditorProps) {

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

    const dItems = useMemo(() => {
        const l = dragItems || Object.keys(DRAG_ITEMS)
        const d = {}
        for (let key of Object.keys(DRAG_TYPES)) {
            console.log('key', key)
            d[key] = DRAG_TYPES[key].filter(k => l.includes(k)).map(k => DRAG_ITEMS[k])
        }
        return d
    }, [dragItems])

    return (
        <Box>
            <DndProvider backend={HTML5Backend}>
                <Paper id="my-dnd-root" elevation={5}>
                    <Box pt={1}>
                        <Grid2 container wrap="nowrap">
                            <Grid2 width={200} sx={{overflowY: "scroll"}}>
                                <Box ml={0.5}>
                                    {Object.keys(dItems).map(key => {
                                        if (dItems[key].length === 0) return null
                                        return (
                                            <Box key={key}>
                                                <Box mb={1}>
                                                    <Typography variant="body1" color={DRAG_COLORS[key]}>
                                                        {key}
                                                    </Typography>
                                                </Box>
                                                <Box mb={1} ml={1}>
                                                    {dItems[key].map(item => (
                                                        <Box key={item.text} mt={1}>
                                                            <DraggableChip type={key} item={item} editorViewRef={editorViewRef} />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Grid2>
                            <Grid2 flex={1}>
                                <DroppableEditor editorRef={editorRef} editorViewRef={editorViewRef} height={height} />
                            </Grid2>
                        </Grid2>
                    </Box>
                </Paper>
            </DndProvider>
        </Box>
    )
}


interface EditorWrapperProps {
    main: JSX.Element;
    lowerToolbar: JSX.Element;
}


export function EditorWrapper({main, lowerToolbar}: EditorWrapperProps) {

    const [editorWidth, setEditorWidth] = useState(parseInt(localStorage.getItem("editorWidth") || "600"))

    const updateEditorWidth = (size: number) => {
        setEditorWidth(size)
        localStorage.setItem("editorWidth", size.toString())
    }

    return (
        <ResizableBox
            width={editorWidth}
            height={Infinity}
            axis="x"
            resizeHandles={["e"]}
            minConstraints={[400, Infinity]}
            maxConstraints={[window.innerWidth-63, Infinity]}
            onResizeStop={(event, {size}) => updateEditorWidth(size.width)}
            handle={<Box sx={{
                position: "absolute",
                right: -24,
                top: 0,
                width: "30px",
                height: "100%",
                cursor: "ew-resize"
            }} />}>
            <Box>
                {main}
                {lowerToolbar}
            </Box>
        </ResizableBox>
    )
}


interface LowerToolbarProps {
    pyodide: ReturnType<typeof usePyodide>;
    editorViewRef: RefObject<EditorView>;
    runCode?: () => void;
}


export function LowerToolbar({pyodide, editorViewRef, runCode}: LowerToolbarProps) {

    const defaultRunCode = () => {
        if (!editorViewRef.current) {
            console.log("No editorViewRef!")
            return
        }
        pyodide.executeCode(new ScriptAdjustments(editorViewRef.current.state.doc.toString()).output())
    }

    return (
        <Box mt={3}>
            <Grid2 container spacing={3} alignItems="center">
                <Grid2 minWidth={200}>
                    <Box>
                        <GreenPrimaryButton fullWidth disabled={pyodide.state.executing || !pyodide.state.ready}
                            onClick={() => runCode ? runCode() : defaultRunCode()}>
                            Run Code
                        </GreenPrimaryButton>
                    </Box>
                </Grid2>
                <Grid2 minWidth={200}>
                    <Box>
                        <RedPrimaryButton fullWidth disabled={!pyodide.state.executing || !pyodide.state.ready}
                        onClick={() => pyodide.restart()}>
                            Cancel Run
                        </RedPrimaryButton>
                    </Box>
                </Grid2>
                <Grid2 flex={1} />
                <Undo editorViewRef={editorViewRef} />
                <EditorFullScreenDialog editorViewRef={editorViewRef} />
            </Grid2>
        </Box>
    )
}


interface EditorTabsProps {
    tabs: string[];
    selectedTab: string;
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