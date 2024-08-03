import {
    BrowserRouter,
    Navigate,
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
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
import { useCallback, useContext, useEffect, useState } from "react";
import DeliveryDetailsTable from "./pages/dashboard/delivery_associate/batchsDelivery/deliveryDetailsTable/DeliveryDetailsTable";
import permissions from "./ennum/permission";
import UploadImage from "./pages/dashboard/upload_image";
import DeliveryReports from "./pages/dashboard/deliveryReports";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { isLoggedIn } from "./utils/helper";
import { TOKEN_STORAGE } from "./utils/constants";
import { LoginUserContext } from "./App";
import NotFound from "./pages/dashboard/NotFound";
import ValidatedRoute from "./components/validatedRoute";
import Users from "./pages/dashboard/employees/users/Users";
import Roles from "./pages/dashboard/employees/roles/Roles";
import Vehicles from "./pages/dashboard/vehicles";
import Register from "./pages/(auth)/register";
import OtpVerification from "./pages/(auth)/otp-verification";
import SubDomainRoute from "./components/subDomainRoute";
import LogsList from "./pages/dashboard/logs/(logsList)/layout"
import Activity from "./pages/dashboard/logs/(logsList)/activity"
import SMS from "./pages/dashboard/logs/(logsList)/sms"

function RoutesSimple() {
    const [getUser, { data, isSuccess }] = useGetUserMutation();
    const context = useContext(LoginUserContext)
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const [userData, setUserData] = useState<any>({});
    const authToken = localStorage.getItem(TOKEN_STORAGE);
    // useEffect(() => {
    //     if (authToken) {
    //         getUser();
    //     }
    // }, [authToken]);
    // console.log(data, "0980980980890")
    const hasAccess = useCallback(
        (module: string) => !!userData?.role?.permissions?.find((e: any) => e?.name?.includes(module)),
        [userData?.role?.permissions]
    );
    useEffect(() => {
        // console.log("data changed", data);
        // console.log(context?.loginUserData, 'auth')
        if (context?.loginUserData && context?.loginUserData?.role_name) {
            setUserData({ ...context?.loginUserData }); // Update state when data is available
        }
    }, [context]);
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ValidatedRoute><LogoLayout /></ValidatedRoute>}>
                        <Route path="/" element={<PublicRoute><PrivateRoute><SubDomainRoute><Register /></SubDomainRoute></PrivateRoute></PublicRoute>} />
                        <Route path="otp-verification" element={<PublicRoute><PrivateRoute><OtpVerification /></PrivateRoute></PublicRoute>} />
                        <Route path="login" element={<ValidatedRoute><Login /></ValidatedRoute>} />
                        <Route path="forgot-password" element={<PrivateRoute><Forgot /></PrivateRoute>} />
                        <Route path="reset-password" element={<PrivateRoute><Reset /></PrivateRoute>} />
                    </Route>
                    <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                        {hasAccess("invoice") &&
                            <Route path="invoices" element={<InvoicesList />}>
                                <Route index element={<Navigate to="deliveries" />} />
                                <Route path="deliveries" element={<InvoiceDeliveries />} />
                                <Route path="collections" element={<Collections />} />
                                <Route path="completed" element={<Completed />} />
                            </Route>
                        }
                        {hasAccess("log") &&
                            <Route path="logs" element={<LogsList />}>
                                <Route index element={<Navigate to="activity" />} />
                                <Route path="activity" element={<Activity />} />
                                <Route path="sms" element={<SMS />} />
                            </Route>
                        }
                        {hasAccess("invoice") &&
                            <Route path="invoices/:invoiceNo" element={<InvoiceDetails />} />
                        }

                        {hasAccess("batches") &&
                            <Route path="batch/:batchNo/:id" element={<BatchDetails />} />
                        }
                        {hasAccess("batches") &&
                            <Route path="batches" element={<BatchsList />}>
                                <Route index element={<Navigate to="deliveries" />} />
                                <Route path="deliveries" element={<BatchDeliveries />} />
                                <Route path="collections" element={<BatchCollections />} />
                                <Route path="completed" element={<Completed />} />
                            </Route>
                        }
                        {hasAccess("batches") &&
                            <Route path="batches/collections/:batchNo/:id" element={<BatchDetails />} />
                        }


                        {hasAccess("payments") &&
                            <Route path="payments" element={<PaymentsList />}>
                                <Route index element={<Navigate to="deliveries" />} />
                                <Route path="deliveries" element={<PaymentDeliveries />} />
                                <Route path="collections" element={<Collections />} />
                                <Route path="completed" element={<Completed />} />
                            </Route>
                        }

                        {hasAccess("payments") &&
                            <Route path="payments/:paymentNo" element={<PaymentDetails />} />
                        }

                        {/* {hasAccess("employees") && (
                            <Route path="employees">
                                <Route index path="users" element={<Users />} />
                                <Route path="roles" element={<Roles />} />
                            </Route>
                        )} */}
                        {hasAccess("employees") && (
                            <Route path="employees">
                                {hasAccess("employees_users_view") && (
                                    <Route index path="users" element={<Users />} />
                                )}
                                {hasAccess("employees_roles_view") && (
                                <Route path="roles" element={<Roles />} />
                                )}
                            </Route>
                        )}

                        {hasAccess("vehicles") && (
                            <Route path="vehicles" element={<Vehicles />} />
                        )}

                        <Route path="batches/report/:batchNo/:id" element={<Reports />} />
                        <Route path="batches/collections/report/:batchNo/:id" element={<Reports />} />

                        {/* =============delivery-associates-------- */}
                        {hasAccess("delivery") &&
                            <Route path="delivery" element={<DeliveryAssociate />}>
                                <Route index element={<Navigate to="associates" />} />
                                <Route path="associates" element={<DeliveryAssociate />} />
                            </Route>
                        }

                        {hasAccess("delivery") &&
                            <Route path="/dashboard/delivery/otp_hold/:invoice_id" element={<OTPHOLD />} />
                        }

                        {hasAccess("delivery") &&
                            <Route path="/dashboard/delivery/payment_collection/:invoice_id" element={<PaymentCollection />} />
                        }

                        {hasAccess("delivery") &&
                            <Route path="/dashboard/delivery/report/:batchNo/:id" element={<DeliveryReports />} />
                        }
                        {/* =============collection-associates-------- */}
                        {hasAccess("collection") &&
                            <Route path="collection" element={<DeliveryAssociate />}>
                                <Route index element={<Navigate to="associates" />} />
                                <Route path="associates" element={<DeliveryAssociate />} />
                            </Route>
                        }

                        {hasAccess("collection") &&
                            <Route path="/dashboard/collection/otp_hold/:invoice_id" element={<OTPHOLD />} />
                        }

                        {hasAccess("collection") &&
                            <Route path="/dashboard/collection/payment_collection/:invoice_id" element={<PaymentCollection />} />
                        }

                        {hasAccess("collection") &&
                            <Route path="/dashboard/collection/report/:batchNo/:id" element={<DeliveryReports />} />
                        }
                        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default RoutesSimple
