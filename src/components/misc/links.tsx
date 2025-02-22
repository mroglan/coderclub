import {Typography, TypographyProps} from '@mui/material'
import Link from 'next/link';

interface LinkProps extends TypographyProps {
    href: string;
    as?: string;
    target?: string;
    children: React.ReactNode;
}

export function PrimaryLink({children, href, as, target, ...typographyProps}: LinkProps) {

    return (
        <Link href={href} as={as} target={target}>
            <Typography sx={{
                transition: "color 100ms",
                "&:hover": {
                    color: "primary.dark"
                }
            }} display="inline" {...typographyProps} color="primary">
                {children}
            </Typography>
        </Link>
    )
}