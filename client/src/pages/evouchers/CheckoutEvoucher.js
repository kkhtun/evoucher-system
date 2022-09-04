import {
    Box,
    Button,
    Card,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../config/environment";
import { useNavigate, useParams } from "react-router-dom";
function CheckoutEvoucher() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const [evoucher, setEvoucher] = useState({});

    const [number, setNumber] = useState("");
    const [exp_month, setExpMonth] = useState("");
    const [exp_year, setExpYear] = useState("");
    const [cvc, setCvc] = useState("");

    useEffect(() => {
        async function fetchEvoucher() {
            const res = await axios.get(`${environment.host}/evouchers/${_id}`);
            const data = res.data;
            setEvoucher(data);
        }

        if (_id) {
            fetchEvoucher();
        }
    }, [_id]);

    const checkout = async () => {
        if (!number || !exp_month || !exp_year || !cvc) {
            return alert("Please fill all the fields");
        }

        const card = { number, exp_month, exp_year, cvc };
        const requestData = {
            _id,
            card,
        };

        try {
            const res = await axios.post(
                `${environment.host}/evouchers/checkout`,
                requestData
            );
            const data = res.data;
            console.log(data);
            alert("Congrats, Evoucher Paid!");
            navigate(`/evouchers`);
        } catch (e) {
            alert(e.message);
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
            <Typography variant="h6">Checkout Evoucher</Typography>
            {evoucher ? (
                <Card sx={{ padding: 5 }}>
                    <Typography>{evoucher.title}</Typography>
                    <Typography>Amount - {evoucher.amount}</Typography>
                    <Typography>Quantity - {evoucher.quantity}</Typography>
                </Card>
            ) : (
                <></>
            )}
            <Divider />
            <TextField
                label="Card Number"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={number}
                onChange={(e) => {
                    setNumber(e.target.value);
                }}
            />
            <TextField
                label="Exp Month"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={exp_month}
                onChange={(e) => setExpMonth(e.target.value)}
            />
            <TextField
                label="Exp Year"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={exp_year}
                onChange={(e) => setExpYear(e.target.value)}
            />
            <TextField
                label="CVC"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
            />
            <Button variant="contained" sx={{ my: 5 }} onClick={checkout}>
                Checkout
            </Button>
        </Box>
    );
}

export default CheckoutEvoucher;
