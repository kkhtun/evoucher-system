import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { environment } from "../../config/environment";
import axios from "axios";
function CreatePaymentMethod() {
    const [payment_method, setPaymentMethod] = useState("");
    const [payment_method_discount, setPaymentMethodDiscount] = useState("");

    const create = async () => {
        if (!payment_method || !payment_method_discount) {
            return alert("Please fill in all fields properly");
        }
        try {
            const res = await axios.post(
                `${environment.host}/payment-discounts`,
                {
                    payment_method,
                    payment_method_discount,
                }
            );
            const data = res.data;
            if (data) alert("Payment discount created successfully");
        } catch (e) {
            console.log(e);
            alert(
                e.response?.data?.message?.includes("duplicate")
                    ? "Payment Method already exists"
                    : e.response?.data?.message
            );
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
                label="Payment Method"
                variant="standard"
                value={payment_method}
                style={{ marginBottom: 10 }}
                onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <TextField
                label="Discount"
                variant="standard"
                value={payment_method_discount}
                style={{ marginBottom: 10 }}
                onChange={(e) => setPaymentMethodDiscount(e.target.value)}
            />
            <Button variant="contained" onClick={create}>
                Create
            </Button>
        </Box>
    );
}

export default CreatePaymentMethod;
