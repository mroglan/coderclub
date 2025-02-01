import { Box, Container } from "@mui/material"
import { useState } from "react";

import { PurplePrimaryButton } from "@/components/misc/buttons"
import { PrimaryLink } from "@/components/misc/links";
import { Teacher } from "@/database/interfaces/Teacher"
import { CreateDialog } from "./CreateDialog";
import { MySession } from "@/database/interfaces/Session";


interface Props {
    user: Teacher;
    sessions: MySession[];
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
                    <Box my={1} key={session.id}>
                        <PrimaryLink href="/session/{name}" as={`/session/${session.url_name}`}>
                            {session.name} 
                        </PrimaryLink>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}