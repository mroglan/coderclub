import { Box, Container } from "@mui/material"
import { useState } from "react";

import { PurplePrimaryButton } from "@/components/misc/buttons"
import { PrimaryLink } from "@/components/misc/links";
import { C_Teacher } from "@/database/interfaces/Teacher"
import { CreateDialog } from "./CreateDialog";
import { C_Session } from "@/database/interfaces/Session";


interface Props {
    user: C_Teacher;
    sessions: C_Session[];
}


export default function Main({user, sessions}: Props) {

    const [open, setOpen] = useState(false)

    const openCreateDialog = () => {
        setOpen(true)
    }

    const closeCreateDialog = () => {
        console.log("closing dialog")
        setOpen(false)
    }

    return (
        <Box mx={3} mt={3}>
            <Box>
                <PurplePrimaryButton onClick={openCreateDialog} >
                    Create New Session
                </PurplePrimaryButton>
            </Box>
            <CreateDialog open={open} onClose={closeCreateDialog} />
            <Box mt={3}>
                {sessions.map(session => (
                    <Box my={1} key={session.ref["@ref"].id}>
                        <PrimaryLink href="/session/{name}" as={`/session/${session.data.url_name}`}>
                            {session.data.name} 
                        </PrimaryLink>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}