import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "./pages/AuthPage";
import { setNavigate } from "./lib/navigation";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<DetailPage />} />
            <Route
                path="/login"
                element={<AuthPage choosedTab="login" />}
            />
            <Route
                path="/register"
                element={<AuthPage choosedTab="register" />}
            />
        </Routes>
    );
}

export default App;
