import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { environment } from "../../config/environment";
import { Button, Card, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
export default function EvoucherDetails() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [codes, setCodes] = useState([]);

    useEffect(() => {
        async function fetchEvoucher() {
            const res = await axios.get(`${environment.host}/evouchers/${_id}`);
            const data = res.data;
            setData(data);
            setCodes(data.codes);
        }

        if (_id) {
            fetchEvoucher();
        }
    }, [_id]);
    return (
        <>
            <Card sx={{ maxWidth: 345, padding: 5, mx: "auto", my: 2 }}>
                <Typography component="h6">Title - {data.title}</Typography>
                <Typography>Description - {data.description}</Typography>
                <Typography>Expiration Date - {data.expirationDate}</Typography>
                <Typography>Amount - {data.amount}</Typography>
                <Typography>Quantity - {data.quantity}</Typography>
                <Typography>Status - {data.status}</Typography>
                <Typography>Type - {data.type}</Typography>
                {data.status === "PENDING" ? (
                    <Button
                        onClick={() =>
                            navigate(`/evouchers/checkout/${data._id}`)
                        }
                    >
                        Complete Checkout
                    </Button>
                ) : (
                    <></>
                )}
            </Card>

            <Card sx={{ maxWidth: 345, padding: 5, mx: "auto", my: 2 }}>
                {codes.length > 0 ? (
                    codes.map((c) => (
                        <Box key={c._id}>
                            <Typography variant="h6">
                                Code - {c.promo_code}
                            </Typography>
                            <Typography>
                                Username - {c.evoucher_username}
                            </Typography>
                            <Typography>
                                Mobile - {c.evoucher_mobile}
                            </Typography>
                            <Typography>
                                Purchased Times - {c.purchased_times}
                            </Typography>
                            <Typography>Balance - {c.balance}</Typography>
                            <Divider sx={{ my: 2 }}></Divider>
                        </Box>
                    ))
                ) : (
                    <></>
                )}
            </Card>
        </>
    );
}
