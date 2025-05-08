import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import "./index.css";
import App from "./App.tsx";
import { AuthLayout } from "./components/index.ts";
import {
  Home,
  Login,
  Signup,
  VerifyOTP,
  UploadItem,
  ProductDetails,
} from "./pages/index.ts";
import { AuthProvider } from "./context/AuthProvider.tsx";
import Categories from "./pages/Categories"; // Add this import

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/verify-otp",
        element: (
          <AuthLayout authentication={false}>
            <VerifyOTP />
          </AuthLayout>
        ),
      },
      {
        path: "/upload-item",
        element: (
          <AuthLayout>
            <UploadItem />
          </AuthLayout>
        ),
      },
      {
        path: "/product-details",
        element: (
          <AuthLayout authentication={false}>
            <ProductDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/product-details/:productId", // Add productId parameter
        element: (
          <AuthLayout authentication={false}>
            <ProductDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/categories",
        element: (
          <AuthLayout authentication={false}>
            <Categories />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
