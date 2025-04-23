import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/login_register_form/LoginForm";
import RegisterForm from "./components/login_register_form/RegisterForm";
import ErrorPage from "./components/404";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./routes/PublicRoute";
import Category from "./components/pages/Category";
import Products from "./components/pages/Products";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Payment from "./components/pages/Payment";
import PrivateRoute from "./routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./components/dashboard/Dashboard";
import OrderItems from "./components/pages/OrderItems";
import HomePage from "./components/homepage/Homepage";
import ProductByCategory from "./components/pages/ProductByCategory";
import HomepageLayout from "./components/homepage/HomepageLayout";
import { CartProvider } from "./components/cart/CartContext";
import Cart from "./components/cart/Cart";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/home" element={<HomepageLayout />}>
                <Route index element={<HomePage />} />
                <Route
                  path="/home/category/:id"
                  element={<ProductByCategory />}
                />
                <Route path="/home/cart" element={<Cart />} />
              </Route>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/forgot-password-404-Page-not-found"
                element={<ErrorPage />}
              />
              <Route path="*" element={<Navigate to="/home" />} />
            </Route>
            <Route path="/user" element={<DashboardLayout />}>
              <Route element={<PrivateRoute />}>
                <Route path="/user/dashboard" element={<Dashboard />} />
                <Route path="/user/category" element={<Category />} />
                <Route path="/user/products" element={<Products />} />
                <Route path="/user/payment" element={<Payment />} />
                <Route path="/user/order-history" element={<OrderItems />} />
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
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
