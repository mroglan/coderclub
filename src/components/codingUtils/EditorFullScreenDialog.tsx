import { AppBar, Box, Container, Dialog, DialogContent, DialogTitle, Grid2, IconButton, Toolbar, Typography } from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { EditorView, keymap } from "@codemirror/view";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { indentMore, indentLess } from "@codemirror/commands";
import { DefaultEditor } from "./Editor";


interface Props {
    editorViewRef: RefObject<EditorView|null>;
}


export default function EditorFullScreenDialog({editorViewRef}: Props) {

    const localViewRef = useRef<EditorView>(null)

    const [fullScreen, setFullScreen] = useState(false)

    const handleClose = () => {
        if (!localViewRef.current || !editorViewRef.current) return
        editorViewRef.current.dispatch({
            changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: localViewRef.current.state.doc.toString()},
        })
        localViewRef.current = null
        setFullScreen(false)
    }

    return (
        <Grid2>
            <IconButton onClick={() => setFullScreen(true)}>
                <FullscreenIcon fontSize="large" />
            </IconButton> 
            <Dialog fullScreen open={fullScreen} onClose={handleClose}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="div">
                        Editor
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Container maxWidth="xl">
                        <Box p={3}>
                            {fullScreen && <DefaultEditor 
                            originalCode={editorViewRef.current.state.doc.toString()}
                            editorViewRef={localViewRef}
                            height="70vh" />}
                        </Box>
                    </Container>
                </DialogContent>
            </Dialog>
        </Grid2>
    )
}