import "./payment-collection.scss";
import { useAppSelector } from "@/state/hooks";
import { useGetInvoiceDetailsQuery } from "@/state/slices/invoices/invoicesApiSlice";
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
import { ReactComponent as LeftArrow } from "../../../assets/svgs/left-arrow.svg";
import { ReactComponent as CamaraChecked } from "@/assets/svgs/camera-checked.svg";
import { ReactComponent as Camera } from "@/assets/svgs/camera-non-checked.svg";
import { ReactComponent as BlueCamera } from "@/assets/svgs/camera-checked.svg";
import { ReactComponent as Pen } from "@/assets/svgs/pen.svg";
import { ReactComponent as PenGray } from "@/assets/svgs/pen-gray.svg";
import { ReactComponent as UnitImage1 } from "@/assets/svgs/unit-img-1.svg";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { ReactComponent as CloseX } from "@/assets/svgs/close-x.svg";
import { ReactComponent as CloseXModel } from "@/assets/svgs/closemodal.svg";
import { ReactComponent as ToBeCollected } from "@/assets/svgs/to-be-collected.svg";
import { ReactComponent as CameraUncheckedBlue } from "@/assets/svgs/camera-blue-unchecked.svg";
import { ReactComponent as UnitImage2 } from "@/assets/svgs/unit-img-2.svg";
import { ReactComponent as List } from "@/assets/svgs/list.svg";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import InvoiceTableTh from "../invoices/(invoicesList)/components/InvoiceTableTh";
import axios from "axios";
import { numberWithCommas, userToken } from "@/utils/helper";
import { HOST, TOKEN_STORAGE } from "@/utils/constants";
import HandleModelReturn from "./product_return";
import UploadImage from "../upload_image";
import OffcanvasMobile from "@/components/OffcanvasMobile";
import { useGetBatchsSingleDataMutation } from "@/state/slices/batchs/batchsApiSlice";
import { LoginUserContext } from "@/App";
import { useSetOpenNav } from "@pages/dashboard";
import permissions from "@/ennum/permission";
interface PaymentValues {
  cash?: string; // '?' allows this property to be optional
  online?: string; // Add other properties if needed
  cheque?: string; // Add other properties if needed
  credit?: string; // Add other properties if needed
  payment_return?: string; // Add other properties if needed
  credit_image?: File; // Credit image (if required)
  cheque_image?: File;
}
interface Product {
  id: number;
  checked: boolean;
  damaged_item: string;
}
interface ImageFiles {
  credit_image: string;
  cheque_image: string;
}
interface CurrencyDisplayProps {
  amount: number; // Input amount as a number
}
type AnyObject = {
  [key: string]: any;
};

export default function PaymentCollection() {

  const [getBatchsOne, { data: dataBatch, isLoading: isLoadingBatch, isError, error: batchError }] = useGetBatchsSingleDataMutation();
  const [batch, setBatch] = useState<any>(dataBatch);

  // const invoiceState = useAppSelector((state) => state.invoices);
  const { invoice_id } = useParams();
  const {
    data: invoiceData,
    isLoading,
    refetch,
  } = useGetInvoiceDetailsQuery(invoice_id, {
    // skip: isNaN(invoiceNo), // Skip the query if batchId is NaN
  });
  const [values, setValues] = useState<PaymentValues>({});
  const [valuesDue, setValuesDue] = useState<PaymentValues>({});
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     const numberValue = value.replace(/[^\d]/g, '');
  //     // const formattedValue = Number(numberValue)
  //     // .toLocaleString('en-IN', { maximumFractionDigits: 2 });
  //     setValues({
  //         ...values,
  //         [name]: numberValue,
  //     });
  // };
  useEffect(() => {
    // getBatchDetails();

    getBatchsOne({
      batch_type: 1,
      keyword: "",
      page: 1,
      to: "",
      from: ""
    });

  }, []);

  useEffect(() => {
    if (Boolean(dataBatch)) {
      setBatch(dataBatch);
    }
  }, [dataBatch]);

  useEffect(() => {
    if ((!location?.pathname?.includes("/collection") && invoiceData?.status == "3") || invoiceData?.status == "4") {
      navigate("/dashboard")
    }
  }, [invoiceData?.status])

  const [productValue, setProductValue] = useState<AnyObject>({}); //for product return

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow numbers and at most one decimal point
    const cleanedValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except '.'

    // Ensure only one decimal point exists
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      // More than one decimal point is invalid
      return;
    }

    let formattedValue = '';
    if (parts[0]) {
      // Format the whole number part with Indian-style commas
      const integerPart = parts[0];
      const length = integerPart.length;

      if (length > 3) {
        const firstPart = integerPart.slice(0, length - 3); // Everything before the last 3 digits
        const lastPart = integerPart.slice(length - 3); // Last 3 digits

        formattedValue = firstPart.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastPart;
      } else {
        formattedValue = integerPart;
      }
    }

    // If there's a decimal part, add it back and restrict to 2 decimal places
    if (parts.length === 2) {
      const decimalPart = parts[1].slice(0, 2); // Restricting to a maximum of 2 decimal places
      formattedValue += '.' + decimalPart;
    }

    // Update the state with the formatted value
    setValues({
      ...values,
      [name]: formattedValue,
    });
  };
  // console.log("hiti==>>", productValue)

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow numbers and at most one decimal point
    const cleanedValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except '.'

    // Ensure only one decimal point exists
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      // More than one decimal point is invalid
      return;
    }

    let formattedValue = '';
    if (parts[0]) {
      // Format the whole number part with Indian-style commas
      const integerPart = parts[0];
      const length = integerPart.length;

      if (length > 3) {
        const firstPart = integerPart.slice(0, length - 3); // Everything before the last 3 digits
        const lastPart = integerPart.slice(length - 3); // Last 3 digits

        formattedValue = firstPart.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastPart;
      } else {
        formattedValue = integerPart;
      }
    }

    // If there's a decimal part, add it back and restrict to 2 decimal places
    if (parts.length === 2) {
      const decimalPart = parts[1].slice(0, 2); // Restricting to a maximum of 2 decimal places
      formattedValue += '.' + decimalPart;
    }

    // Update the state with the formatted value
    setValuesDue({
      ...valuesDue,
      [name]: formattedValue,
    });
  }

  const { goBackOrRedirect } = useGoBackOrRedirect();

  const navigate = useNavigate();
  const location = useLocation();
  const [dueClose, setDueClose] = useState(false);
  const [error, seterror] = useState(false)
  const [isImageUpload, setisImageUpload] = useState<boolean>(false);
  const [triggerUpload, setTriggerUpload] = useState<boolean>(false);
  const context = useContext(LoginUserContext);
  const { setOpenNav } = useSetOpenNav();

  // const [fileImage, setFileImage] = useState<string>("");
  const [fileImage, setFileImage] = useState<ImageFiles>({
    credit_image: "",
    cheque_image: "",
  });
  const [imageName, setImageName] = useState<string>("");
  const [priceReturn, setPrice] = useState<string>("");
  const [returnItem, setReturnItem] = useState<number>(0);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    let file = e?.currentTarget?.files?.[0]
    setValues({
      ...values,
      [name]: e?.currentTarget?.files?.[0], // Convert string to number
    });
    if (file) {
      const base64 = await toBase64(file);
      setFileImage((prevFileImage) => ({
        ...prevFileImage,
        [name]: base64, // Update the specific image property
      }));
    }
    else {
      setFileImage({
        credit_image: "",
        cheque_image: "",
      });
    }
  }
  // console.log("productvalue", productValue)
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to Base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error occurred while reading the file'));
      };
    });
  };

  const uploadImageClick = (value: boolean, name: string) => {
    setisImageUpload(value);
    setImageName(name);
    if (name == "credit_image" && !fileImage?.credit_image) {
      setTriggerUpload(value);
    }
    if (name == "cheque_image" && !fileImage?.cheque_image) {
      setTriggerUpload(value);
    }
  }
  const generateRawQueryParams = (data: AnyObject): string => {
    const queryParts: string[] = [];
    let index = 0;

    for (const key in data) {
      const item = data[key];
      // if (item.checked && item?.quantity > 0) {
      queryParts.push(`item_ids[${index}]=${item.id}`);

      if (item.checked) {
        queryParts.push(`quantity[${index}]=${Boolean(item.quantity) ? item.quantity : 0}`);
      }
      else {
        queryParts.push(`quantity[${index}]=${0}`);
      }
      // if ( Boolean(item?.image) && typeof item?.image == "string") {
      //     queryParts.push(`image[${index}]=${item.image}`);
      // }
      index++;
      // }
    }

    return queryParts.join("&");
  };

  // =========product_return =======

  async function productReturnAPi() {
    setLoadingPay(true);
    const formData = new FormData();
    const itemArray = Object.values(productValue); // Convert object to array

    // Use index to append images to FormData
    itemArray.forEach((item, index) => {
      if (item.image) {
        formData.append(`image[${index}]`, item.image);
      }
      else {
        formData.append(`image[${index}]`, "null");
      }
    })

    const queryParams = generateRawQueryParams(productValue); // Generate query parameters
    const invoiceId = invoiceData?.id; // Example invoice ID
    const apiUrl = `${HOST[process.env.NODE_ENV]}/api/invoices/returns?invoice_id=${invoiceId}&${queryParams}`; // Base API with raw query

    const authToken = localStorage.getItem(TOKEN_STORAGE);
    // Simulating POST request
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      // alert(`Success: ${response.data?.message}`);
      if (values?.cash || values?.cheque || values?.online || values?.credit) {
        await paymentCollectionSubmit();
      } else {
        setLoadingPay(false);
        setPrice("");
        setReturnItem(0);
        // setProductValue({});
        await refetch();
        navigate(-2)
      }
    } catch (err: any) {
      let errorMessage = "An error occurred."; // Default message

      if (axios.isAxiosError(err)) {
        // If it's an Axios error, check for response and data
        errorMessage = err.response?.data?.message // Custom message from server
          ?? err.response?.statusText // HTTP status text
          ?? err.message; // General error message
      } else {
        // For non-Axios errors, use the generic message
        errorMessage = err.message || "Unknown error.";
      }

      // Display the error message in an alert
      window.alert(`Error: ${errorMessage}`);
    }
    finally {
      // setProductValue({})
      setLoadingPay(false);
    }
  };
  const [deliveryAmount, setDeliveryAmount] = useState<number>(Number(invoiceData?.invoice_amount) - Number(invoiceData?.amount_received));
  const [collectionAmount, setcollectionAmount] = useState<number>(Number(invoiceData?.amount_due));
  const [totalDue, setTotalDue] = useState<any>(location?.pathname?.includes("/collection") ? collectionAmount : deliveryAmount);
  useEffect(() => {
    if (Boolean(invoiceData)) {
      setDeliveryAmount(Number(invoiceData?.invoice_amount) - Number(invoiceData?.amount_received));
      setcollectionAmount(Number(invoiceData?.amount_due))
    }
  }, [invoiceData])

  useEffect(() => {
    const invoiceAmount = location?.pathname?.includes("/collection") ? collectionAmount : deliveryAmount;
    const items_quantity = Boolean(Number(invoiceData?.items_quantity)) ? Number(invoiceData?.items_quantity) : 0;

    // Calculate the sum of all payments, defaulting to 0 if undefined
    const cash = Number(valuesDue?.cash?.split(",").join("")) || 0;
    const credit = Number(valuesDue?.credit?.split(",").join("")) || 0;
    const cheque = Number(valuesDue?.cheque?.split(",").join("")) || 0;
    const online = Number(valuesDue?.online?.split(",").join("")) || 0;
    const productPrice = parseFloat(priceReturn.replace(/[^\d.-]/g, '')) || 0;
    // Calculate the total paid
    // console.log(cash, credit, cheque, online, productPrice)
    if ((items_quantity == returnItem) && (((invoiceAmount - productPrice) < 1) && ((invoiceAmount - productPrice) > -1)) && cash == 0 && credit == 0 && cheque == 0 && online == 0) {
      setTotalDue(0)
    }
    else {
      const totalPaid = cash + credit + productPrice + cheque + online;
      // Calculate the remaining balance
      const remainingBalance = invoiceAmount - totalPaid;
      // if (Number(remainingBalance) < 1 && Number(remainingBalance) > -1) {
      //   setTotalDue(0)
      // } else {
      setTotalDue(remainingBalance?.toFixed(2))
      // }
    }

  }, [valuesDue, priceReturn]);
  // const authToken = userToken();
  const [loadingPay, setLoadingPay] = useState<boolean>(false);

  async function paymentCollectionSubmit() {
    try {
      setLoadingPay(true)
      let formData = new FormData();
      if (fileImage) {
        if (values?.credit_image) {
          formData.append('credit_image', values?.credit_image);
        }
        if (values?.cheque_image) {
          formData.append('cheque_image', values?.cheque_image);
        }
      }

      const authToken = localStorage.getItem(TOKEN_STORAGE);
      let invoiceId = "&invoice_id=" + invoiceData?.id;
      let batchId = "?batch_id=" + batch?.id;
      let cash = values?.cash
        ? "&cash=" + Number(values?.cash?.split(",").join("")).toFixed(2)
        : "";
      let online = values?.online
        ? "&online=" + Number(values?.online?.split(",").join("")).toFixed(2)
        : "";
      let cheque = values?.cheque
        ? "&cheque=" + Number(values?.cheque?.split(",").join("")).toFixed(2)
        : "";
      let credit = values?.credit
        ? "&credit=" + Number(values?.credit?.split(",").join("")).toFixed(2)
        : "";
      const response = await axios.post(
        `${HOST[process.env.NODE_ENV]}/api/payments/create${batchId}${invoiceId}${cash}${online}${cheque}${credit}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      // alert(response?.data?.message)
      // window.alert(response?.data?.message); // Alert shown
      // After alert is closed, the following code executes
      navigate(-2);
    } catch (err: any) {
      let errorMessage = "An error occurred."; // Default message

      if (axios.isAxiosError(err)) {
        // If it's an Axios error, check for response and data
        errorMessage = err.response?.data?.message // Custom message from server
          ?? err.response?.statusText // HTTP status text
          ?? err.message; // General error message
      } else {
        // For non-Axios errors, use the generic message
        errorMessage = err.message || "Unknown error.";
      }

      // Display the error message in an alert
      window.alert(`Error: ${errorMessage}`);
    }
    finally {
      setLoadingPay(false);
      await refetch();
      setValues({});
      setValuesDue({});
      setFileImage({
        credit_image: "",
        cheque_image: "",
      });
      setDeliveryAmount(Number(invoiceData?.invoice_amount) - Number(invoiceData?.amount_received));
      setcollectionAmount(Number(invoiceData?.amount_due));
      setTotalDue(location?.pathname?.includes("/collection") ? collectionAmount : deliveryAmount);
    }
  }
  async function onSubmitPayment() {
    seterror(true);
    if (totalDue != 0) {
      window.scrollTo(0, document.body.scrollHeight);
      setDueClose(true)
    }
    else if (values?.cheque && !values?.cheque_image) {
      alert("No image uploaded for Cheque/Credit.")
    }
    else if (values?.credit && !values?.credit_image) {
      alert("No image uploaded for Cheque/Credit.")
    }
    else {
      if (location?.pathname?.includes("/collection")) {
        if (values?.cash || values?.cheque || values?.online || values?.credit) {
          await paymentCollectionSubmit();
        }
        else {
          navigate(-2);
        }
      }
      else {
        if (Object.keys(productValue).length > 0) {
          await productReturnAPi();
        }
        else {
          if (values?.cash || values?.cheque || values?.online || values?.credit) {
            await paymentCollectionSubmit();
          }
          else {
            navigate(-2);
          }
        }
      }

    }
  }
  useEffect(() => {
    if (triggerUpload) {
      const uploadInput = document.getElementById('upload-image');
      uploadInput?.click(); // Programmatically click the hidden input field
      setTriggerUpload(false); // Reset the trigger
    }
  }, [triggerUpload]);
  const [userData, setUserData] = useState<any>({});
  useEffect(() => {
    // console.log("data changed", data);
    // console.log(context?.loginUserData, 'auth')
    if (context?.loginUserData && context?.loginUserData?.role_name) {
      setUserData({ ...context?.loginUserData }); // Update state when data is available
    }
  }, [context]);
  
  return (
    <>
      {isLoading ? <>
        <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
          <div>
            <Loading className="loadingCircle" />
          </div>
        </div>;
      </> :
        isImageUpload ?
          <>
            <UploadImage
              setisImageUpload={setisImageUpload}
              handleChange={handleChange}
              fileImage={fileImage}
              setFileImage={setFileImage}
              imageName={imageName}
            />
          </>
          :
          <>
            <div className="d-flex justify-content-center align-items-center scroll-bottom-delivery">
              <div className="payment-main-component mb-5 mb-md-0 pb-5 pb-md-0">
                <div className="d-flex justify-content-between d-block d-md-none">
                  <div className="d-flex align-self-center">
                    <LeftArrow
                      className="align-self-center"
                      onClick={goBackOrRedirect}
                    />
                    <p
                      className="text-start text-md-end nav-name m-0"
                      style={{ padding: "10px 10px 10px 12px" }}
                    >
                      Invoice{" "}
                      <span className="" style={{ color: "#0080FC" }}>
                        {invoiceData?.invoice_number}
                      </span>
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
                <ul className="list-unstyled overflow-hidden">
                  <li className="payment-head">
                    <div className="row row-cols-1 row-cols-md-2 pt-md-0">
                      <div className="col fw-bold align-self-center">
                        <p
                          className="text-details text-start p-0 m-0 paymet-head-text"

                        >
                          Buyer
                        </p>
                        <p
                          className="labeL m-0 paymet-head-text"
                        >
                          {invoiceData?.buyer?.name
                            ? invoiceData?.buyer?.name
                            : "abcd ltd"}
                        </p>
                      </div>
                      <div className="col align-self-center">
                        <p className="text-end d-none d-md-block nav-name" style={{ fontSize: "20px" }}>
                          Invoice{" "}
                          <span className="invoice-text" style={{ fontSize: "20px", fontWeight: "500" }}>
                            {invoiceData?.invoice_number}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                  <hr
                    className="d-none d-md-block m-0"
                    style={{ color: "#b9b9b9" }}
                  />
                  <li className="p-0 p-md-4">
                    <div className="payment-body">
                      <div
                        className="to-be-collected d-flex justify-content-between payment-body-head p-3"
                        style={{ color: "#0080FC" }}
                      >
                        <div className="">
                          <span
                            className="align-self-center"
                           style={{fontWeight: "500"}}
                          >
                            To be collected
                          </span>
                          
                        </div>
                        <div>
                          <span>
                            {deliveryAmount && collectionAmount
                              ? location?.pathname?.includes("/collection") ? `₹${numberWithCommas(collectionAmount).trim()}` :
                                `₹${numberWithCommas(deliveryAmount).trim()}`
                              : "₹00.00"}
                          </span>
                        </div>
                      </div>
                      {/* ----for desktop */}
                      <div className="pb-3 d-none d-md-block">
                          <div
                            className="d-flex justify-content-between p-3"
                            style={{
                              color: "#1D2939",
                              background: "#F3F4F7",
                            }}
                          >
                            <div className="" style={{
                              fontSize: "16px",
                              fontWeight: "500"
                            }}>Balance Due</div>
                            <div>
                              ₹{isNaN(totalDue)
                                ? <span style={{ fontSize: "16px", fontWeight: "500" }}>
                                  {deliveryAmount && collectionAmount
                                    ? location?.pathname?.includes("/collection") ?
                                      numberWithCommas(collectionAmount).trim() :
                                      numberWithCommas(deliveryAmount).trim()
                                    : "00.00"}
                                </span>
                                : <span style={{ fontSize: "16px", fontWeight: "500" }}>
                                  {totalDue
                                    ? numberWithCommas(totalDue).trim() : "00.00"}
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                      {/* ---for mobile */}
                      <div
                        className="to-be-collected d-block d-md-none payment-body-head p-3"
                        style={{ color: "#1D2939", padding: "15px 12px" ,backgroundColor:"#F3F4F7"}}
                      >
                        <div
                          className="d-flex justify-content-between rounded-3"
                          style={{
                            color: "#1D2939",
                          }}
                        >
                          <div className="" style={{
                            fontSize: "16px",
                            fontWeight: "500",
                          }}>Balance Due</div>
                          <div>
                            ₹{isNaN(totalDue)
                              ? <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {deliveryAmount && collectionAmount
                                  ? location?.pathname?.includes("/collection") ?
                                    numberWithCommas(collectionAmount).trim() :
                                    numberWithCommas(deliveryAmount).trim()
                                  : "00.00"}
                              </span>

                              : <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                {(totalDue
                                  ? numberWithCommas(totalDue).trim() : "00.00")}
                              </span>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="p-3 pb-md-0">
                        <div className="pb-3">
                          <label htmlFor="cash" className="form-label" >
                            Cash
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="form-control payment-input"
                            id="cash"
                            placeholder={`₹00.00`}
                            name="cash"
                            value={values.cash !== undefined ? '₹' + values.cash : ''}
                            onChange={handleInputChange} // Attach the change handler
                            onBlur={handleBlur}
                          />
                        </div>
                        <div className="pb-3">
                          <label htmlFor="online" className="form-label">
                            Online
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="form-control payment-input"
                            id="online"
                            placeholder={`₹00.00`}
                            name="online"
                            value={values.online !== undefined ? '₹' + values.online : ''}
                            onChange={handleInputChange} // Attach the change handler
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="pb-3">
                          <label htmlFor="cheque" className="form-label">
                            Cheque
                          </label>
                          <div className="input-div">
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-control payment-input"
                              id="cheque"
                              placeholder="₹00.00"
                              name="cheque"
                              value={values.cheque !== undefined ? '₹' + values.cheque : ''} // No error, since 'cash' is now defined
                              onChange={handleInputChange} // Attach the change handler
                              onBlur={handleBlur}
                            // disabled={!values?.cheque_image}
                            />
                            {/* {error && !values?.cheque_image ?
                                                            <div style={{fontSize:"12px", color:"red"}}>First upload image of Cheque</div>
                                                            : ""
                                                        } */}
                            <span
                              className="input-camara-image"
                              style={{
                                cursor: "pointer",
                                height: "31px",
                                width: "31px",
                              }}
                            >
                              {
                                fileImage?.cheque_image ?
                                  <CamaraChecked
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={() => uploadImageClick(true, "cheque_image")}
                                  />
                                  :
                                  <CameraUncheckedBlue
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={() => uploadImageClick(true, "cheque_image")}
                                  />
                              }
                            </span>

                          </div>
                        </div>
                        <div className="pb-3">
                          <label htmlFor="credit" className="form-label">
                            Credit
                          </label>
                          <div className="input-div">
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-control payment-input"
                              id="credit"
                              placeholder="₹00.00"
                              name="credit"
                              value={values.credit !== undefined ? '₹' + values.credit : ''} // No error, since 'cash' is now defined
                              onChange={handleInputChange} // Attach the change handler
                              onBlur={handleBlur}
                            // disabled={!values?.credit_image}
                            />
                            {/* {error && !values?.credit_image ?
                                                            <div style={{fontSize:"12px", color:"red"}}>First upload image of credit</div>
                                                            : ""
                                                        } */}
                            <span
                              className="input-camara-image"
                              style={{
                                cursor: "pointer",
                                height: "31px",
                                width: "31px",
                              }}
                            >
                              {
                                fileImage?.credit_image ?
                                  <CamaraChecked
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={() => uploadImageClick(true, "credit_image")}
                                  />
                                  :
                                  <CameraUncheckedBlue
                                    style={{ height: "100%", width: "100%" }}
                                    onClick={() => uploadImageClick(true, "credit_image")}
                                  />
                              }
                            </span>
                          </div>
                        </div>
                        {!location.pathname.includes("/collection/") && (
                          <div className="pb-md-3">
                            <label htmlFor="payment_return" className="form-label">
                              Product Returns
                            </label>
                            <div className="row">
                              <div className="col-10 col-md-10">
                                <input
                                  type="text"
                                  className="form-control payment-input-productReturn"
                                  id="payment_return"
                                  name="payment_return"
                                  placeholder="₹00.00"
                                  value={priceReturn}
                                  // value={values.payment_return !== undefined ? '₹' + values.payment_return : ''}
                                  onChange={handleInputChange} // Attach the change handler
                                  disabled
                                />
                              </div>
                              <HandleModelReturn setPrice={setPrice} setReturnItem={setReturnItem} setProductValue={setProductValue} productValue={productValue} />
                            </div>
                          </div>
                        )}

                        {/* <div className="pb-3 d-none d-md-block">
                          <div
                            className="d-flex justify-content-between p-2 rounded-3"
                            style={{
                              color: "#0080FC",
                              background: "#ECF7FF",
                            }}
                          >
                            <div className="" style={{
                              fontSize: "16px",
                              fontWeight: "500"
                            }}>Balance Due</div>
                            <div>
                              ₹{isNaN(totalDue)
                                ? <span style={{ fontSize: "16px", fontWeight: "500" }}>
                                  {deliveryAmount && collectionAmount
                                    ? location?.pathname?.includes("/collection") ?
                                      numberWithCommas(collectionAmount).trim() :
                                      numberWithCommas(deliveryAmount).trim()
                                    : "00.00"}
                                </span>
                                : <span style={{ fontSize: "16px", fontWeight: "500" }}>
                                  {totalDue
                                    ? numberWithCommas(totalDue).trim() : "00.00"}
                                </span>
                              }
                            </div>
                          </div>
                        </div> */}
                        {totalDue != 0 && dueClose && (
                          <div className="d-none d-md-block">
                            <div
                              className="mx-3 mx-md-5 text-center py-2 due_amount_error"

                            >
                              Due amount must be ₹0 to save.{" "}
                              <CloseX style={{ cursor: "pointer" }} onClick={() => setDueClose(false)} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className=" payment-footer d-none d-md-block">
                        <div className="text-end d-flex justify-content-end">
                          <button
                            className={`d-flex ${totalDue == 0 ? "btn-payment-save-blue" : "btn-payment-save"}`}
                            onClick={onSubmitPayment}
                            disabled={loadingPay}
                          >
                            <div> {loadingPay ?
                              <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                            }</div>
                            <div >Save</div >
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className=" payment-footer-mob d-block d-md-none w-100">
                {totalDue != 0 && dueClose && (
                  <div className="d-block d-md-none">
                    <div
                      className="mx-0 px-2 mb-1 mx-md-5 text-center py-2 due_amount_error"
                    >
                      Due amount must be ₹0 to save.{" "}
                      <CloseX style={{ cursor: "pointer" }} onClick={() => setDueClose(false)} />
                    </div>
                  </div>
                )}
                <div className="p-3 payment-footer-mob-btn">
                  <button
                    className={`${totalDue == 0 ? "btn-payment-save-blue" : "btn-payment-save"} w-100`}
                    onClick={onSubmitPayment}
                    disabled={loadingPay}
                  >
                    {loadingPay ?
                      <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                    }
                    Save
                  </button>
                </div>
              </div>
            </div>

          </>
      }
    </>
  );
}
