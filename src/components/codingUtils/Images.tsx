import { Box, Divider, Grid2, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { useImages } from "./hooks"
import { PurplePrimaryButton } from "../misc/buttons"
import { PrimaryLink } from "../misc/links"
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"


export const DEFAULT_IMAGES = {
    avatar: {
        meta: {
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAwCAYAAABwrHhvAAADMElEQVRYR+2WMWgUQRSG30kiJIgoJCZp4kWraKGSRhDktNA0dlfYSGxUEEECYhXJBc/GJgTEQhE8sDBwiGCjTTgEwU4tNIVozlgkMYIpJEI8HPeN9+bezs7MzoZdLoUDx+0N+/b/3vvfvL0ctHnlstCfHC+K0ngR9k0cgc/lN1CarsLUdFVp5Xu3ifrqH/k7dQASn5nrh5m5Abh6cin4LIcgCgc6Re3D70wAhFh8LMV2H7qiAH68uwNYkdzgWZl0lhWQALSwCpg9rSaA+pm2BQIfSBXAjGlhRVgFMgMA8h8VSJS+aa/y6AlQA6ZdAZUxgXAIOgW8ATMDECMjonR8qGXBywWAY2sA127BidFzQCcgEwAUN82WRuUjlB+cwnkQ0k19DojZHtFY64KOe3sArn8BuL0XGhe/Qeelr6hFcEo3VYDgBIjGzqcAs6+g4/12VYjGwQ0JwM9/6ChkMI7FZLEbpqrrueBbBN+y7HoDZtIDzWSw1Ly6+u/WcMog+0SPTLUHEik3b/4PsDUrUBselgOj+8YnWL+5X1lbmJ/3Ah46U5fxS6MbMPC8NQ8WnuUj8ZENLs6bikDiILg4jycQHSIEQOKUvQkA92wQJE7ZmwBwj0MoAJe4TyVc4q5KRADQd1orr/Pquu9oXV7brDCVfmIweAU3V3lxl7zSrXACYABBbAYA4wkiMQDPHh+UFIBnj/GpAZANeiPqFtgAyAZqRKsFba8A71y6dg0l2/nXnxPbhCZh057NArxXn4Cm+IgFeBOfBS4Qn0HkijcOIgqIg/AdxTYA5yj2LX+a93m93dIU1J+1NQEujx2W7/Ofp3/BjhddCvpu5a0X8Njyqox/2NcD51e+q/hKf2/8/wEuzstFIHEQXJzHE4gOESIiccreBIB7NggSp+xNALjHIRSAS9ynEi5xVyUiAOi7mgn3W/8NChf+/Te0WWEqPfcf+wGXboUTAANqTYjNAHDBxAAkTNVICsCz5z3hXQEbANmgN6JugQ2AqkKNaLWg7RXgnZvkFJDXtvhYC2gG8AloepjNApPfpviIBXgTnwW2DHDfZxC54o2DiALiIHxHsQ1AH8V/AWTKKE9CFzn4AAAAAElFTkSuQmCC",
            resolution: 16
        },
        images: [
            {name: "avatar", x: 16, y: 0},
            {name: "fire", x: 0, y: 16},
            {name: "water", x: 16, y: 16},
            {name: "earth", x: 0, y: 32},
            {name: "air", x: 16, y: 32}
        ]
    }
}


interface Props {
    images: ReturnType<typeof useImages>
}


export default function ImageEditor({images}: Props) {

    const inputRef = useRef<HTMLInputElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [uploadError, setUploadError] = useState("")

    const [selectedImage, setSelectedImage] = useState(0)

    const [textFieldName, setTextFieldName] = useState("")

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('handle upload')
        if (e.target.files.length < 1) {
            return setUploadError("No file selected.")
        }
        const file = e.target.files[0]
        if (file.type !== "application/json") {
            return setUploadError("Please input a .json file.")
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result as string)
            const error = images.importJSON(data)
            if (error) {
                setUploadError(error)
            }
        }
        reader.readAsText(file)
    }

    useMemo(() => {
        if (!selectedImage || images.names.length < 1) return
        setSelectedImage(0)
    }, [images.names])

    useMemo(() => {
        if (images.names.length < 1) return
        setTextFieldName(images.names[selectedImage])
    }, [images.names, selectedImage])

    useEffect(() => {
        if (images.names.length < 1) return
        const img = new Image()
        img.src = images.meta.image
        img.onload = () => {
            const ctx = canvasRef.current.getContext("2d")
            ctx.imageSmoothingEnabled = false
            ctx.clearRect(0, 0, 300, 300)
            ctx.drawImage(img, 
                images.images[selectedImage].x, images.images[selectedImage].y,
                images.meta.resolution, images.meta.resolution,
                0, 0, 300, 300
            )
        }
    }, [images.names, selectedImage])

    return (
        <Box>
            <Paper elevation={5}>
                <input type="file" accept=".json" ref={inputRef} style={{display: "none"}} 
                    onChange={handleFileUpload} />
                <Box p={3}>
                    <Grid2 container spacing={3} alignItems="center">
                        <Grid2>
                            <PurplePrimaryButton onClick={() => inputRef.current.click()}>
                                Import Images JSON from Piskel     
                            </PurplePrimaryButton>     
                        </Grid2> 
                        <Grid2>
                            <PrimaryLink variant="h5" target="_blank" href="/how/import-images-from-piskel">
                                How?
                            </PrimaryLink>
                        </Grid2>
                    </Grid2>
                    {uploadError && <Box mt={1}>
                        <Typography variant="body1" color="error">
                            {uploadError}
                        </Typography>
                    </Box>}
                    <Box mt ={3}>
                        <Grid2 container spacing={3}>
                            <Grid2 width={200} sx={{overflowY: "scroll"}} height={379}>
                                {images.names.map((name, i) => (
                                    <React.Fragment key={i}>
                                        <Box py={2} px={0.5} sx={{cursor: "pointer"}} 
                                        bgcolor={i === selectedImage ? "primary.light" : undefined}
                                        onClick={() => setSelectedImage(i)}>
                                            <Typography variant="body1">
                                                {name}
                                            </Typography>
                                        </Box>
                                        {i < images.names.length-1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </Grid2>
                            <Grid2 flex={1}>
                                <Box mb={3}>
                                    <Grid2 container justifyContent="center">
                                        <Grid2 width="min(100%, 300px)">
                                            <TextField fullWidth InputProps={{
                                                sx:{textAlign: "center", input: { textAlign: "center", padding: 1 }, fontSize: "1.8rem" }}}
                                                value={textFieldName} onChange={(e) => setTextFieldName(e.target.value)}
                                                onBlur={(e) => images.updateName(e.target.value, selectedImage)}
                                                disabled={images.names.length === 0}
                                            />
                                        </Grid2>
                                    </Grid2>
                                </Box>
                                <Grid2 container justifyContent="center">
                                    <Grid2 width={300} height={300} border="1px solid #000">
                                        <canvas ref={canvasRef} width={300} height={300} />
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}