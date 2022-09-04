import { useState } from "react";
import axios from "axios";
import { environment } from "../../config/environment";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
export default function ValidatePromoCode() {
    const [mobile, setMobile] = useState("");
    const [code, setCode] = useState("");

    const validate = async () => {
        if (!mobile || !code) {
            return alert("Please fill in properly");
        }
        try {
            const res = await axios.get(
                `${environment.host}/evouchers/validate?code=${code}&mobile=${mobile}`
            );
            const data = res.data;
            console.log(data);
            alert("This code is valid for this number");
        } catch (e) {
            console.log(e);
            alert(e.response?.data?.message || e.message);
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
            <Typography variant="h6">Validate Promo Code</Typography>
            <TextField
                label="Code"
                variant="standard"
                value={code}
                style={{ marginBottom: 10 }}
                onChange={(e) => setCode(e.target.value)}
            />
            <TextField
                label="Mobile"
                variant="standard"
                value={mobile}
                style={{ marginBottom: 10 }}
                onChange={(e) => setMobile(e.target.value)}
            />

            <Button variant="outlined" onClick={validate}>
                Validate
            </Button>
        </Box>
    );
}
