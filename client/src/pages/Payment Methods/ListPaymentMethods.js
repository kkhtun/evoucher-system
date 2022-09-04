import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { environment } from "../../config/environment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListPaymentMethods() {
    const [methods, setMethods] = useState([]);
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchPaymentDiscounts() {
            const res = await axios.get(
                `${environment.host}/payment-discounts`
            );
            const data = res.data;
            setMethods(data.data);
            setCount(data.count);
        }

        fetchPaymentDiscounts();
    }, []);
    return (
        <Box sx={{ m: 2 }}>
            <Button onClick={() => navigate("/payments/create")}>Create</Button>
            <List>
                {methods ? (
                    methods.map((m) => (
                        <ListItem key={m._id}>
                            <ListItemText
                                label="Payment Method"
                                primary={m.payment_method}
                                secondary={m.payment_method_discount}
                            />
                        </ListItem>
                    ))
                ) : (
                    <></>
                )}
            </List>
        </Box>
    );
}

export default ListPaymentMethods;
