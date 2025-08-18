import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/Error/ErrorPage";
import Loading from "../components/ui/Loading";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import SignUp from "../pages/Authentication/SignUp";
import Login from "../pages/Authentication/Login";
import DashboardLayout from "../layouts/dashboardLayout";
import AdminHomepage from "../dashboard/admin/AdminHomepage";
import ManageUsers from "../dashboard/admin/ManageUsers";
import ManageCategory from "../dashboard/admin/ManageCategory";
import SalesReport from "../dashboard/admin/SalesReport";
import ManageMedicines from "../dashboard/seller/ManageMedicines";
import PaymentHistory from "../dashboard/seller/PaymentHistory";
import AdminRoute from "./AdminRoute";
import Forbidden from "../pages/forbidden/Forbidden";
import SellerRoute from "./SellerRoute";
import SellerHomepage from "../dashboard/seller/SellerHomepage";
import ShopPage from "../pages/ShopPage/ShopPage";
import CartPage from "../pages/cartpage/CartPage";
import CheckOutPage from "../pages/checkoutPage/CheckOutPage";
import UserPaymentHistory from "../dashboard/user/UserPaymentHistory";
import PrivateRoute from "./PrivateRoute";
import UserInfo from "../dashboard/user/UserInfo";


const Router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                HydrateFallback: Loading,
                Component: Home
            },
            {
                path: '/shop-page',
                HydrateFallback: Loading,
                Component: ShopPage
            },
            {
                path: '/cart-page',
                HydrateFallback: Loading, 
                element: <PrivateRoute><CartPage/></PrivateRoute>
            },
            {
                path: '/payment-checkout/:id',
                HydrateFallback: Loading,
                element: <PrivateRoute><CheckOutPage/></PrivateRoute>
            },
            {
                path: '/forbidden',
                HydrateFallback: Loading,
                Component: Forbidden
            },
        ]
    },
    {
        path: '/auth',
        Component: AuthLayout,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/auth/sign-up',
                HydrateFallback: Loading,
                Component: SignUp 
            },
            {
                path: '/auth/login',
                HydrateFallback: Loading,
                Component: Login
            }
        ]
    },
    {
        path: '/dashboard',
        Component: DashboardLayout,
        errorElement: <ErrorPage />,
        children: [
            //admin routes ------------------------
            {
                path: '/dashboard/admin-dashboard',
                HydrateFallback: Loading,
                element: <AdminRoute><AdminHomepage/></AdminRoute>
                
            },
            {
                path: '/dashboard/admin-manege-users',
                HydrateFallback: Loading,
                element: <AdminRoute><ManageUsers/></AdminRoute>
                
            },
            {
                path: '/dashboard/admin-manage-category',
                HydrateFallback: Loading,
                element: <AdminRoute><ManageCategory/></AdminRoute>
            },
            {
                path: '/dashboard/admin-sales-report',
                HydrateFallback: Loading,
                element: <AdminRoute><SalesReport/></AdminRoute>
            },
            
            // seller routes ----------------------------
            {
                path: '/dashboard/seller-homepage',
                HydrateFallback: Loading,
                element: <SellerRoute><SellerHomepage/></SellerRoute>        
            },
            {
                path: '/dashboard/payment-history',
                HydrateFallback: Loading,
                element: <SellerRoute><PaymentHistory/></SellerRoute>
            },
            {
                path: '/dashboard/manage-medicines',
                HydrateFallback: Loading,
                element: <SellerRoute><ManageMedicines/></SellerRoute>
            },
            //user -----------------------------
            {
                path: '/dashboard/user-payment-history',
                HydrateFallback: Loading,
                element: <PrivateRoute><UserPaymentHistory/></PrivateRoute>
            },
            {
                path: '/dashboard/user-dashboard',
                HydrateFallback: Loading,
                element: <PrivateRoute><UserInfo/></PrivateRoute>
            },
        ]
    }
])

export default Router