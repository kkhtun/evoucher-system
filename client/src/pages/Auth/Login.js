import { Box, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { environment } from "../../config/environment";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const login = async () => {
        if (mobile && password) {
            try {
                const res = await axios.post(
                    `${environment.host}/users/login`,
                    { mobile, password }
                );
                const data = res.data;
                localStorage.setItem("ACCESS_TOKEN", data.token);
                localStorage.setItem("REFRESH_TOKEN", data.refreshToken);
                setAuth(data);
                navigate("/");
            } catch (e) {
                alert(e.message);
            }
        }
    };
    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                margin: 30,
            }}
        >
            <TextField
                label="Mobile"
                variant="standard"
                value={mobile}
                style={{ marginBottom: 10 }}
                onChange={(e) => setMobile(e.target.value)}
            />
            <TextField
                label="Password"
                variant="standard"
                value={password}
                style={{ marginBottom: 10 }}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={login}>
                Login
            </Button>
        </Box>
    );
}

export default Login;
