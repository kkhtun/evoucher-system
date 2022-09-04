import { Container } from "@mui/material";
import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
    Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import CreateEvoucher from "./pages/evouchers/CreateEvoucher";
import ListEvouchers from "./pages/evouchers/ListEvouchers";
import ListPaymentMethods from "./pages/Payment Methods/ListPaymentMethods";
import { useInterceptor } from "./token.interceptor";
import CheckoutEvoucher from "./pages/evouchers/CheckoutEvoucher";
import Header from "./components/Header";
import EvoucherDetails from "./pages/evouchers/EvoucherDetails";
import ValidatePromoCode from "./pages/evouchers/ValidatePromoCode";
import CreatePaymentMethod from "./pages/Payment Methods/CreatePaymentMethod";
function Wrapper() {
    return (
        <>
            <Header />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}

function App() {
    useInterceptor();
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Wrapper />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="" element={<ListEvouchers />} />
                        <Route path="/evouchers" element={<ListEvouchers />} />
                        <Route
                            index
                            path="/evouchers/create"
                            element={<CreateEvoucher />}
                        />
                        <Route
                            index
                            path="/evouchers/validate"
                            element={<ValidatePromoCode />}
                        />

                        <Route
                            path="/evouchers/checkout/:_id"
                            element={<CheckoutEvoucher />}
                        />
                        <Route
                            index
                            path="/evouchers/:_id"
                            element={<EvoucherDetails />}
                        />

                        <Route
                            path="payments"
                            element={<ListPaymentMethods />}
                        />
                        <Route
                            path="payments/create"
                            element={<CreatePaymentMethod />}
                        />
                    </Route>

                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function ProtectedRoute() {
    let token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default App;
