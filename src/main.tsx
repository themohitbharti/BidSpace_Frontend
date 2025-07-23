// import { StrictMode } from "react";
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
  UserProfile,
  UserProducts,
} from "./pages/index.ts";
import { AuthProvider } from "./context/AuthProvider.tsx";
import Categories from "./pages/Discover.tsx";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Toaster } from "react-hot-toast";

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
        path: "/product-details/:productId",
        element: (
          <AuthLayout authentication={false}>
            <ProductDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/discover",
        element: (
          <AuthLayout authentication={false}>
            <Categories />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={false}>
            <UserProfile />
          </AuthLayout>
        ),
      },
      {
        path: "/profile/products",
        element: (
          <AuthLayout authentication={false}>
            <UserProducts />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  
    <Provider store={store}>
      <AuthProvider>
        <WebSocketProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </WebSocketProvider>
      </AuthProvider>
    </Provider>
);
