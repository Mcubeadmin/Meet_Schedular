import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const LoadingModal = ({open, message="Loading, Please wait..."}) => {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: "column",
                gap: 2
            }}
            open={open}
        >
            <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <CircularProgress color="inherit" size={60} />
                <Typography variant="h6" sx={{mt: 2}}>
                    {message}
                </Typography>

            </Box>
        </Backdrop>
    );
};

export default LoadingModal;