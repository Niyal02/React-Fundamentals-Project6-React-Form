import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/login_register_form/LoginForm";
import RegisterForm from "./components/login_register_form/RegisterForm";
import ErrorPage from "./components/404";
import Dashboard from "./components/dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/404-Page-not-found" element={<ErrorPage />} />
      </Routes>
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
    </BrowserRouter>
  );
}

export default App;
