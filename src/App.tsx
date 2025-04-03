import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/login_register_form/LoginForm";
import RegisterForm from "./components/login_register_form/RegisterForm";
import ErrorPage from "./components/404";
import Dashboard from "./components/dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
// import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Category from "./components/pages/Category";
import Products from "./components/pages/Products";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Payment from "./components/pages/Payment";
import OrderHistory from "./components/pages/OrderHistory";
import PrivateRoute from "./routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/404-Page-not-found" element={<ErrorPage />} />
          </Route>
          <Route path="/user" element={<DashboardLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="/user/dashboard" element={<Dashboard />} />
              <Route path="/user/category" element={<Category />} />
              <Route path="/user/products" element={<Products />} />
              <Route path="/user/payment" element={<Payment />} />
              <Route path="/user/order-history" element={<OrderHistory />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
