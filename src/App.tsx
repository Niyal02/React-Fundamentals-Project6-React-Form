import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/login_register_form/LoginForm";
import RegisterForm from "./components/login_register_form/RegisterForm";
import ErrorPage from "./components/404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/404-Page-not-found" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
