import "./otp-component.scss"
import { useAppSelector } from "@/state/hooks";
import { useGetInvoiceDetailsQuery, useResendOTPMutation } from "@/state/slices/invoices/invoicesApiSlice";
import React, {
    LegacyRef,
    MutableRefObject,
    RefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as LeftArrow } from "@/assets/svgs/left-arrow.svg";
import { ReactComponent as Plam } from "@/assets/svgs/plam.svg";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { ReactComponent as List } from "@/assets/svgs/list.svg";
import axios from "axios";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import OffcanvasMobile from "@/components/OffcanvasMobile";
import { HOST, TOKEN_STORAGE } from "@/utils/constants";
import { useSetOpenNav } from "@pages/dashboard";
import { LoginUserContext } from "@/App";
import permissions from "@/ennum/permission";

export default function OTPHOLD() {
    const invoiceState = useAppSelector((state) => state.invoices);
    // console.log(invoiceState, "=====================")
    const { invoice_id } = useParams();
    // console.log(invoice_id)
    const { data: invoiceData, isLoading, refetch } = useGetInvoiceDetailsQuery(
        invoice_id,
        {
            // skip: isNaN(invoiceNo), // Skip the query if batchId is NaN
        }
    );
    const [resendOTP] = useResendOTPMutation()
    const navigate = useNavigate();
    const location = useLocation();
    const { setOpenNav } = useSetOpenNav();
    // console.log(invoiceData)
    const { goBackOrRedirect } = useGoBackOrRedirect();
    const authToken = localStorage.getItem(TOKEN_STORAGE);
    const [otpValue, setOtpValue] = useState<string>('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtpValue(e?.target?.value)
    }
    const [loadingMark, setLoadingMark] = useState<boolean>(false)
    const [loadingOtp, setLoadingOtp] = useState<boolean>(false);
    const context = useContext(LoginUserContext);

    useEffect(() => {
        if ((!location?.pathname?.includes("/collection") && invoiceData?.status == "3") || invoiceData?.status == "4") {
            navigate("/dashboard")
        }
    }, [invoiceData?.status]);
    const [userData, setUserData] = useState<any>({});
    useEffect(() => {
        // console.log("data changed", data);
        // console.log(context?.loginUserData, 'auth')
        if (context?.loginUserData && context?.loginUserData?.role_name) {
            setUserData({ ...context?.loginUserData }); // Update state when data is available
        }
    }, [context]);
    async function onMarkHold() {
        setLoadingMark(true)
        try {
            const response = await axios.post(
                `${HOST[process.env.NODE_ENV]}/api/invoices/update_status?id=${invoice_id}&status=${5}`, {},
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );
            // Define the API endpoint with query parameters for invoice ID and status
            // console.log(response)
            if (response) {
                const updatedInvoice = response.data?.message;
                alert(updatedInvoice)
                goBackOrRedirect()
            } else {
                console.error('Failed to update invoice status:', response);
            }
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
        finally {
            setLoadingMark(false)
        }
    }
    async function handleOtp() {
        if (otpValue) {
            setLoadingOtp(true);
            try {
                const response = await axios.post(
                    `${HOST[process.env.NODE_ENV]}/api/payments/otp?phone=${invoiceData?.buyer?.phone}&code=${otpValue}`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    }
                );
                console.log(response)
                if (response.data?.message === 'SUCCESS') {
                    const updatedInvoice = response.data;
                    response.data?.message == "FAIL" && alert(`Wrong OTP entered. Please try again.`);
                    const redirectPath = location?.pathname?.includes("/collection/")
                        ? "/dashboard/collection/payment_collection/"
                        : "/dashboard/delivery/payment_collection/";

                    response.data?.message == "SUCCESS" && navigate(`${redirectPath}${invoiceData?.id}`);
                } else {
                    alert(`Failed to update invoice status: ${response?.data?.message || 'Unknown error'}`);
                    console.error('Failed to update invoice status:', response.status);
                }

            } catch (error: any) {
                let errorMessage = 'An error occurred while updating the invoice status.';

                if (error.response) {
                    // The request was made and the server responded with a status code that falls out of the range of 2xx
                    errorMessage = `Error: ${error.response.data.message || 'An unexpected error occurred.'}`;
                    console.error('Error details:', error.response.status, error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    errorMessage = 'No response from server. Please try again later.';
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = `Request error: ${error.message}`;
                    console.error('Error setting up the request:', error.message);
                }

                alert(errorMessage);
            }
            finally {
                setLoadingOtp(false);
            }
        }
        // else {
        //     alert("Please Enter OTP")
        // }
    }

    const handleResendOTP = async () => {
        const { data , error }: any = await resendOTP({ id: invoiceData?.id })

        if(data?.message === 'OTP Sent') {
            alert(`OTP is sended to your phone number: ${invoiceData?.buyer?.phone}`)
        }

        if(error) {
            alert(error?.data?.message)
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleOtp();
        }
    };
    return (
        <>
            {
                isLoading ? <>
                    <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
                        <div>
                            <Loading className="loadingCircle" />
                        </div>
                    </div>
                </> : <>
                    <div className="d-flex justify-content-center align-items-center otp-main">
                        <div className="otp-component ">
                            <div className="d-flex justify-content-between d-block d-md-none">
                                <div className="d-flex align-self-center">
                                    <LeftArrow className="align-self-center" onClick={goBackOrRedirect} />
                                    <p className="text-start text-md-end nav-name m-0" style={{ padding: "10px 10px 10px 12px" }}>
                                        Invoice
                                        <span className="" style={{ color: "#0080FC" }}> {invoiceData?.invoice_number}</span>
                                    </p>
                                </div>
                                <div className="d-block d-md-none">
                                    {
                                        userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.delivery)) ||
                                            userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.collection))
                                            ?
                                            <OffcanvasMobile />
                                            :
                                            <List
                                                className="burgerh"
                                                onClick={() => setOpenNav(true)}
                                            />
                                    }
                                </div>
                            </div>
                            <ul className="list-unstyled m-0 p-0 pt-md-4 px-md-4">
                                <li className=" pb-md-3">
                                    <div className="row row-cols-1 row-cols-md-2 pt-4 pt-md-0" >
                                        <div className="col fw-bold align-self-center" >
                                            <p className="text-details text-start p-0 m-0" style={{ fontSize: "16px", fontWeight: "500" }}>Buyer</p>
                                            <p className="labeL m-0" style={{ fontSize: "16px", fontWeight: "500" }}>
                                                {invoiceData?.buyer?.name}
                                            </p>
                                        </div>
                                        <div className="col align-self-center">
                                            <p className="text-end d-none d-md-block nav-name " style={{ fontSize: "20px", fontWeight: "500", color: "#667085" }}>Invoice <span style={{ color: "#0080FC" }}>{invoiceData?.invoice_number}</span></p>
                                        </div>
                                    </div>
                                </li>
                                <li className="pb-4" style={{ fontSize: "14px", fontWeight: "400", paddingTop: "20px" }} >
                                    {/* <label htmlFor="otpHold" className="form-label">OTP</label> */}
                                    <input type="tel"  name="otpValue" value={otpValue} onChange={handleInputChange} onKeyDown={handleKeyDown} className="form-control otp-input" id="otpHold" placeholder="Enter OTP" />
                                    <span style={{ color: "#0080FC", fontWeight: "600", cursor: 'pointer' }} onClick={handleResendOTP} className="d-inline-block text-decoration-underline">Re-send OTP</span>
                                </li>
                            </ul>
                            <hr className="d-none d-md-block m-0" style={{ color: "#b9b9b9" }} />
                            <div className="btn-div">
                                <div className="row">
                                    <div className="col-12 col-md-4 order-2 order-md-1 align-self-center">
                                        <button type="button" disabled={loadingMark} className="btn-hold w-100" onClick={onMarkHold}>
                                            {loadingMark ?
                                                <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                                            }<Plam />&nbsp;
                                            Mark Hold
                                        </button>
                                    </div>
                                    <div className="col-12 col-md-4 offset-md-4 order-1 order-md-2 align-self-center">
                                        <button type="button" className="btn-otp px-md-4 w-100" disabled={loadingOtp} onClick={() => handleOtp()}>{loadingOtp ?
                                            <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                                        } Continue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
