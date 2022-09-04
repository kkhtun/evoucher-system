import { Box, Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { environment } from "../../config/environment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListEvouchers() {
    const [evoucher, setEvouchers] = useState([]);
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchEvouchers() {
            const res = await axios.get(`${environment.host}/evouchers`);
            const data = res.data;
            setEvouchers(data.data);
            setCount(data.count);
        }

        fetchEvouchers();
    }, []);
    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6">Evouchers</Typography>
            <Button onClick={() => navigate("/evouchers/create")}>
                Create
            </Button>
            {evoucher ? (
                evoucher.map((e) => (
                    <Card
                        key={e._id}
                        sx={{ maxWidth: 345, padding: 5, mx: "auto", mb: 2 }}
                    >
                        <Typography component="h6">
                            Title - {e.title}
                        </Typography>
                        <Typography>Description - {e.description}</Typography>
                        <Typography>
                            Expiration Date - {e.expirationDate}
                        </Typography>
                        <Typography>Amount - {e.amount}</Typography>
                        <Typography>Quantity - {e.quantity}</Typography>
                        <Typography>Status - {e.status}</Typography>
                        <Typography>Type - {e.type}</Typography>
                        {e.status === "PENDING" ? (
                            <Button
                                onClick={() =>
                                    navigate(`/evouchers/checkout/${e._id}`)
                                }
                            >
                                Complete Checkout
                            </Button>
                        ) : (
                            <></>
                        )}
                        <Button onClick={() => navigate(`/evouchers/${e._id}`)}>
                            Details
                        </Button>
                    </Card>
                ))
            ) : (
                <></>
            )}
        </Box>
    );
}

export default ListEvouchers;
