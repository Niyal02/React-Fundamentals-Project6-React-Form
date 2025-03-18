import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
