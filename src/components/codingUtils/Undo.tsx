import { RefObject } from "react";
import { EditorView } from "@codemirror/view";
import { Grid2, IconButton } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import { undo } from "@codemirror/commands";


interface Props {
    editorViewRef: RefObject<EditorView|null>;
}


export default function Undo({editorViewRef}: Props) {

    const handleClick = () => {
        undo(editorViewRef.current)
    }

    return (
        <Grid2>
            <IconButton onClick={handleClick}>
                <UndoIcon fontSize="large" />
            </IconButton>
        </Grid2>
    )
}