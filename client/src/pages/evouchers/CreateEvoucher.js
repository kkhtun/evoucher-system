import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { environment } from "../../config/environment";
import { useNavigate } from "react-router-dom";
function CreateEvoucher() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("ONLY_ME_USAGE");
    const [image, setImage] = useState("");
    const [evoucher_username, setEvoucherUsername] = useState("");
    const [evoucher_mobile, setEvoucherMobile] = useState("");
    const [purchase_limit, setPurchaseLimit] = useState("");
    const [quantity, setQuantity] = useState("");

    const createEvoucher = async () => {
        if (
            !title ||
            !expirationDate ||
            !amount ||
            !type ||
            !evoucher_username ||
            !evoucher_mobile ||
            !purchase_limit ||
            !quantity
        ) {
            return alert("Please fill all the fields");
        }

        const formData = new FormData();
        formData.append("title", title);
        description && formData.append("description", description);
        formData.append("expirationDate", expirationDate.toISOString());
        formData.append("amount", amount);
        formData.append("quantity", quantity);
        formData.append("type", type);
        image && formData.append("image", image);
        formData.append("evoucher_username", evoucher_username);
        formData.append("evoucher_mobile", evoucher_mobile);
        formData.append("purchase_limit", purchase_limit);

        try {
            const res = await axios.post(
                `${environment.host}/evouchers`,
                formData
            );
            const data = res.data;
            alert("Evoucher Created");
            navigate(`/evouchers/checkout/${data._id}`);
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
            <Typography variant="h6">Create Evoucher</Typography>
            <TextField
                label="Title"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                label="Description"
                multiline
                rows={3}
                variant="standard"
                style={{ marginBottom: 10 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    label="Expiration Date"
                    value={expirationDate}
                    onChange={(newValue) => {
                        console.log(newValue.toISOString());
                        setExpirationDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <TextField
                label="Amount"
                variant="standard"
                type="number"
                style={{ marginBottom: 10 }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
                label="Quantity"
                variant="standard"
                type="number"
                style={{ marginBottom: 10 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Select
                value={type}
                label="Type"
                onChange={(e) => {
                    setType(e.target.value);
                }}
                style={{ marginBottom: 10 }}
            >
                <MenuItem value="ONLY_ME_USAGE">ONLY ME USAGE</MenuItem>
                <MenuItem value="GIFT_TO_OTHERS">GIFT TO OTHERS</MenuItem>
            </Select>
            <Button variant="outlined" component="label">
                {image?.name || "Upload Image"}
                <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={(e) => {
                        setImage(e.target.files[0]);
                    }}
                />
            </Button>
            <TextField
                label="Evoucher Username"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={evoucher_username}
                onChange={(e) => setEvoucherUsername(e.target.value)}
            />
            <TextField
                label="Evoucher Mobile"
                variant="standard"
                style={{ marginBottom: 10 }}
                value={evoucher_mobile}
                onChange={(e) => setEvoucherMobile(e.target.value)}
            />
            <TextField
                label="Purchase Limit"
                variant="standard"
                type="number"
                style={{ marginBottom: 10 }}
                value={purchase_limit}
                onChange={(e) => setPurchaseLimit(e.target.value)}
            />
            <Button variant="contained" sx={{ my: 5 }} onClick={createEvoucher}>
                Create
            </Button>
        </Box>
    );
}

export default CreateEvoucher;
