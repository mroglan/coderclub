import { Box, Container } from "@mui/material"
import { useState } from "react";

import { PurplePrimaryButton } from "@/components/misc/buttons"
import { PrimaryLink } from "@/components/misc/links";
import { C_Teacher } from "@/database/interfaces/Teacher"
import { CreateDialog } from "./CreateDialog";


interface Props {
    user: C_Teacher;
}


export default function Main({user}: Props) {

    const [open, setOpen] = useState(false)

    const openCreateDialog = () => {
        setOpen(true)
    }

    const closeCreateDialog = () => {
        setOpen(false)
    }

    return (
        <Box mx={3} mt={3}>
            <Box>
                <PurplePrimaryButton onClick={openCreateDialog} >
                    Create New Session
                </PurplePrimaryButton>
            </Box>
            <CreateDialog user={user} open={open} onClose={closeCreateDialog} />
            <Box mt={3}>
                {user.data.sessions.map(session => (
                    <Box my={1}>
                        <PrimaryLink href="/session/{name}" as={`/session/${session}`}>
                            {session} 
                        </PrimaryLink>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}