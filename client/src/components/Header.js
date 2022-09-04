import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const logout = () => {
        const res = window.confirm("Are you sure you want to logout?");
        if (res) {
            localStorage.clear();
            navigate("/login");
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ display: "inline" }}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            Evouchers
                        </Typography>
                    </Box>
                    <Box>
                        <Button onClick={() => navigate("/")}>Evouchers</Button>
                        <Button onClick={() => navigate("/payments")}>
                            Payment Methods
                        </Button>
                        <Button onClick={() => navigate("/evouchers/validate")}>
                            Validate PromoCode
                        </Button>
                        <Button onClick={logout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
