import {
  Navigate,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./pages/dashboard";
import Forgot from "./pages/(auth)/forgot-password";
import Login from "./pages/(auth)/login";
import Reset from "./pages/(auth)/reset-password";
import LogoLayout from "./components/forms/LogoLayout/LogoLayout";
import InvoiceDeliveries from "@/pages/dashboard/invoices/(invoicesList)/deliveries";
import PaymentDeliveries from "@/pages/dashboard/payments/(paymentsList)/deliveries";
import Collections from "@/pages/dashboard/invoices/(invoicesList)/collections";
import Completed from "@/pages/dashboard/invoices/(invoicesList)/completed";
import InvoicesList from "./pages/dashboard/invoices/(invoicesList)/layout";
import InvoiceDetails from "@/pages/dashboard/invoices/details";
import PaymentDetails from "@/pages/dashboard/payments/details";
import PublicRoute from "./components/publicRoute";
import PaymentsList from "@pages/dashboard/payments/(paymentsList)/layout";
import BatchDetails from "@pages/dashboard/batchs/details";
import DeliveryAssociate from "@pages/dashboard/delivery_associate/batchsDelivery/DeliveryAssociate";
import BatchDeliveries from "@pages/dashboard/batchs/(batchsList)/batchDeliveries";
import BatchCollections from "@pages/dashboard/batchs/(batchsList)/batchCollections";
import BatchsList from "@pages/dashboard/batchs/(batchsList)/layout";
import Reports from "@pages/dashboard/reports";
import OTPHOLD from "./pages/dashboard/otp_hold";
import PaymentCollection from "./pages/dashboard/payment_collection";
import { useGetUserMutation } from "./state/slices/authApiSlice";
import { useContext, useEffect, useState } from "react";
import DeliveryDetailsTable from "./pages/dashboard/delivery_associate/batchsDelivery/deliveryDetailsTable/DeliveryDetailsTable";
import permissions from "./ennum/permission";
import UploadImage from "./pages/dashboard/upload_image";
import DeliveryReports from "./pages/dashboard/deliveryReports";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { isLoggedIn } from "./utils/helper";
import { TOKEN_STORAGE } from "./utils/constants";
import { LoginUserContext } from "./App";
import Users from "./pages/dashboard/employees/users/Users";
import Roles from "./pages/dashboard/employees/roles/Roles";
import Vehicles from "./pages/dashboard/vehicles";

// User data fetching and role determination
interface User {
  id?: number;
  name?: string;
  email?: string;
  role_name?: string;
}
// const useRoleName = () => {
//     const [getUser, { data, isSuccess }] = useGetUserMutation();
//     const [userData, setUserData] = useState<User>({});

//     useEffect(() => {
//         getUser(); // Fetch user data on component mount
//     }, []);

//     useEffect(() => {
//         if (data) {
//             setUserData(data); // Update state when data is available
//         }
//     }, [data, isSuccess]);

//     // Return the role name, with undefined check
//     const roleName = userData?.role_name;
//     return roleName;
// };
// // Role-based conditional component
// const RoleBasedComponent = () => {
//     const roleName = useRoleName(); // Custom hook to get the role name

//     if (roleName === undefined) {
//         return <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
//             <div>
//                 <Loading className="loadingCircle" />
//             </div>
//         </div>; // Return a loading indicator if data isn't ready
//     }
//     // console.log(roleName)
//     return roleName == permissions?.role_name ? <DeliveryAssociate /> : <BatchDeliveries />; // Conditionally render based on roleName
// };
// const RoleBasedComponentReport = () => {
//     const roleName = useRoleName(); // Custom hook to get the role name

//     if (roleName === undefined) {
//         return <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
//             <div>
//                 <Loading className="loadingCircle" />
//             </div>
//         </div>; // Return a loading indicator if data isn't ready
//     }
//     // console.log(roleName)
//     return roleName == permissions?.role_name || roleName == permissions?.role_collection? <DeliveryReports /> : <Reports />; // Conditionally render based on roleName
// };

let router = createHashRouter(
  [
    {
      path: "",
      element: <Navigate to="/login" />,
    },
    {
      path: "",
      element: (
        <PublicRoute>
          <LogoLayout />
        </PublicRoute>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <Forgot />,
        },
        {
          path: "reset-password",
          element: <Reset />,
        },
      ],
    },
    {
      path: "dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
      children: [
        {
          path: "invoices",
          // element: <Invoice />,
          children: [
            {
              path: "",
              element: <InvoicesList />,
              children: [
                {
                  path: "",
                  element: <Navigate to="/dashboard/invoices/deliveries" />,
                },
                {
                  path: "deliveries",
                  element: <InvoiceDeliveries />,
                },
                {
                  path: "collections",
                  element: <Collections />,
                },
                {
                  path: "completed",
                  element: <Completed />,
                },
              ],
            },
            {
              path: ":invoiceNo",
              element: <InvoiceDetails />,
            },
          ],
        },
        {
          path: "batch/:batchNo/:id",
          element: <BatchDetails />,
        },
        {
          path: "batches",
          // element: <Invoice />,
          children: [
            {
              path: "",
              element: <BatchsList />,
              children: [
                {
                  path: "",
                  element: <Navigate to="/dashboard/batches/deliveries" />,
                },
                {
                  path: "deliveries",
                  element: <BatchDeliveries />,
                },
                {
                  path: "collections",
                  element: <BatchCollections />,
                },
                {
                  path: "completed",
                  element: <Completed />,
                },
              ],
            },

            {
              path: "collections/:batchNo/:id",
              element: <BatchDetails />,
            },
          ],
        },
        {
          path: "payments",
          // element: <Invoice />,
          children: [
            {
              path: "",
              element: <PaymentsList />,
              children: [
                {
                  path: "",
                  element: <Navigate to="/dashboard/payments/deliveries" />,
                },
                {
                  path: "deliveries",
                  element: <PaymentDeliveries />,
                },
                {
                  path: "collections",
                  element: <Collections />,
                },
                {
                  path: "completed",
                  element: <Completed />,
                },
              ],
            },
            {
              path: ":paymentNo",
              element: <PaymentDetails />,
            },
          ],
        },
        {
          path: "employees",
          children: [
            {
              path: "users",
              element: <Users />,
            },
            {
              path: "roles",
              element: <Roles />,
            },
          ],
        },
        {
          path: "vehicles",
          element: <Vehicles />,
        },
        {
          path: "otp_hold/:invoice_id",
          element: <OTPHOLD />,
        },
        {
          path: "collection/otp_hold/:invoice_id",
          element: <OTPHOLD />,
        },
        {
          path: "payment_collection/:invoice_id",
          element: <PaymentCollection />,
        },
        {
          path: "collection/payment_collection/:invoice_id",
          element: <PaymentCollection />,
        },
        // {
        //     path: "collection/upload_image/:id",
        //     element: <UploadImage />,
        // },
        // {
        //     path: "upload_image/:id",
        //     element: <UploadImage />,
        // },
        {
          path: "batches/report/:batchNo/:id",
          element: <Reports />,
        },
        {
          path: "batches/collections/report/:batchNo/:id",
          element: <Reports />,
        },
        // {
        //     path: "/dashboard/batches/deliveries_associate",
        //     element: <DeliveryAssociate />,
        // },
        // {
        //     path: "/dashboard/batches/collections_associate",
        //     element: <DeliveryAssociate />,
        // },
        // {
        //     path: "batches/collections/report_associate/:batchNo/:id",
        //     element: <RoleBasedComponentReport />,
        // },
        // {
        //     path: "batches/report_associate/:batchNo/:id",
        //     element: <RoleBasedComponentReport />,
        // },
      ],
    },
  ]
  // {
  // basename: "/indeliv2/public",
  // }
);
let routerDelivery = createHashRouter([
  {
    path: "",
    element: <Navigate to="/login" />,
  },
  {
    path: "",
    element: (
      <PublicRoute>
        <LogoLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <Forgot />,
      },
      {
        path: "reset-password",
        element: <Reset />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "batches",
        // element: <DeliveryAssociate />, // This should be correct
        children: [
          {
            path: "",
            element: <Navigate to="/dashboard/batches/deliveries" />,
          },
          {
            path: "deliveries",
            element: <DeliveryAssociate />, // Make sure this component is correct
          },
        ],
      },
      {
        path: "otp_hold/:invoice_id",
        element: <OTPHOLD />,
      },
      {
        path: "payment_collection/:invoice_id",
        element: <PaymentCollection />,
      },
      {
        path: "batches/report/:batchNo/:id",
        element: <DeliveryReports />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" />,
      },
    ],
  },
]);
let routercollection = createHashRouter([
  {
    path: "",
    element: <Navigate to="/login" />,
  },
  {
    path: "",
    element: (
      <PublicRoute>
        <LogoLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <Forgot />,
      },
      {
        path: "reset-password",
        element: <Reset />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "batches",
        // element: <DeliveryAssociate />, // This should be correct
        children: [
          {
            path: "",
            element: <Navigate to="/dashboard/batches/collections" />,
          },
          {
            path: "collections",
            element: <DeliveryAssociate />, // Make sure this component is correct
          },
        ],
      },
      {
        path: "collection/otp_hold/:invoice_id",
        element: <OTPHOLD />,
      },
      {
        path: "collection/payment_collection/:invoice_id",
        element: <PaymentCollection />,
      },
      {
        path: "batches/collections/report/:batchNo/:id",
        element: <DeliveryReports />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" />,
      },
    ],
  },
]);
export default function MyRouter() {
  const [getUser, { data, isSuccess }] = useGetUserMutation();
  const context = useContext(LoginUserContext);
  const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
  const [userData, setUserData] = useState<User>({});
  const authToken = localStorage.getItem(TOKEN_STORAGE);
  // useEffect(() => {
  //     if (authToken) {
  //         getUser();
  //     }
  // }, [authToken]);
  // console.log(data, "0980980980890")
  useEffect(() => {
    // console.log("data changed", data);
    // console.log(context?.loginUserData, 'auth')
    if (context?.loginUserData && context?.loginUserData?.role_name) {
      setUserData({ ...context?.loginUserData }); // Update state when data is available
    }
  }, [context]);
  return (
    <>
      {
        // userData?.role_name ?
        userData?.role_name?.includes(permissions?.role_name) ? (
          <RouterProvider router={routerDelivery} />
        ) : userData?.role_name?.includes(permissions?.role_collection) ? (
          <RouterProvider router={routercollection} />
        ) : (
          <RouterProvider router={router} />
        )
        // < RouterProvider router={loginUserData?.role_name == permissions?.role_name ? routerDelivery : loginUserData?.role_name == permissions?.role_collection ? routercollection : router} />
        // :
        // <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
        //     <div>
        //         <Loading className="loadingCircle" />
        //     </div>
        // </div>
      }
    </>
  );
}
