import "./payment-collection.scss";
import { useAppSelector } from "@/state/hooks";
import { useGetInvoiceDetailsQuery } from "@/state/slices/invoices/invoicesApiSlice";
import React, {
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as LeftArrow } from "./../../../assets/svgs/left-arrow.svg";
import { ReactComponent as Camera } from "@/assets/svgs/camera-non-checked.svg";
import { ReactComponent as BlueCamera } from "@/assets/svgs/camera-checked.svg";
import { ReactComponent as BlueCameraUnchecked } from "@/assets/svgs/camera-blue-unchecked.svg";
import { ReactComponent as Pen } from "@/assets/svgs/pen.svg";
import { ReactComponent as PenGray } from "@/assets/svgs/pen-gray.svg";
import { ReactComponent as UnitImage1 } from "@/assets/svgs/unit-img-1.svg";
import { ReactComponent as CloseXModel } from "@/assets/svgs/closemodal.svg";
import { ReactComponent as Download } from "@/assets/svgs/Download-svg.svg";
import { ReactComponent as CameraUpload } from "@/assets/svgs/camera.svg";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { ReactComponent as Close } from "@/assets/svgs/Close.svg";
import { Button, Container, Modal, Offcanvas } from "react-bootstrap";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import InvoiceTableTh from "../invoices/(invoicesList)/components/InvoiceTableTh";
import { numberWithCommas, userToken } from "@/utils/helper";
import axios from "axios";
import { HOST, TOKEN_STORAGE } from "@/utils/constants";
interface PaymentValues {
  cash?: number; // '?' allows this property to be optional
  online?: number; // Add other properties if needed
  cheque?: number; // Add other properties if needed
  credit?: number; // Add other properties if needed
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

interface ItemData {
  id: string;
  quantity: string;
  checked: boolean;
  image?: File;
}

interface productValueType {
  [key: string]: ItemData;
}

type ProductValueObj = Record<string, any>;
interface ProductReturn {
  setPrice: (value: string) => void;
  setReturnItem: (value: number) => void;
  setProductValue: React.Dispatch<React.SetStateAction<ProductValueObj>>;
  productValue: ProductValueObj;
}
const HandleModelReturn: React.FC<ProductReturn> = ({ setPrice, setReturnItem, setProductValue, productValue }) => {
  const all_data = [
    {
      id: 1,
      damaged_item: "test1",
      unit: {
        unit: 0,
        showUnit: false,
      },
      checked: false,
    },
    {
      id: 2,
      damaged_item: "test2",
      unit: {
        unit: 5,
        showUnit: true,
      },
      checked: true,
    },
    {
      id: 3,
      damaged_item: "test3",
      unit: {
        unit: 0,
        showUnit: false,
      },
      checked: false,
    },
  ];
  const product_data = [
    {
      head: "Damaged Item",
      sortable: false,
      key: "damaged_item",
    },
    {
      head: "Unit",
      sortable: false,
      key: "unit",
    },
    {
      head: "Price",
      sortable: false,
      key: "price",
    },
    {
      head: "Image",
      sortable: false,
      key: "image",
    },
  ];
  const invoiceState = useAppSelector((state) => state.invoices);
  const { invoice_id } = useParams();
  const {
    data: invoiceData,
    isLoading,
    refetch,
  } = useGetInvoiceDetailsQuery(invoice_id, {
    // skip: isNaN(invoiceNo), // Skip the query if batchId is NaN
  });
  const [values, setValues] = useState<PaymentValues>({});
  const [total, setTotal] = useState(0);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: Number(value), // Convert string to number
    });
  };
  const navigate = useNavigate()
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [productData, setProductData] = useState([...all_data]);
  const { goBackOrRedirect } = useGoBackOrRedirect();
  const [sortingStates, setSortingStates] = useState({
    sortBy: "",
    isAsc: true,
  });

  const [loadingReturn, setLoadingReturn] = useState<boolean>(false);

  const formatIndianCurrency = (value: number): string => {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR', // Indian Rupee
    });
  };

  useEffect(() => {
    if (Object.keys(productValue).length <= 0 || Object.keys(productValue).length == 0) {
      const updatedProductdata = invoiceData?.items?.map((invoice) => ({
        productId: invoice.item_id,
        id: invoice.item_id,
        quantity: Number(invoice?.quantity)?.toFixed(0),
        unit_price: invoice?.unit_price
      }));
      const data = updatedProductdata?.flatMap((item: any) => {
        return (invoiceData?.returns || []).filter((x: any) => {
          return x.item_id === item.productId;
        });
      });
      data?.map((value, i) => {
        setProductValue((prevproductValue) => ({
          ...prevproductValue,
          [value.item_id]: {
            ...(prevproductValue[value.item_id] || {}),
            checked: true,
            id: value.item_id,
            quantity: Number(value.quantity).toFixed(0),
            unit_price: parseFloat(value?.unit_price) || 0,
            total: Number(value?.unit_price) * (Boolean(value.quantity) ? Number(value.quantity) : 0),
            image: value?.image,
            // image_show: value?.image_path && (window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host) + "/tenants/abc/returns/" + value?.image
            image_show: value?.image_path
          },
        }));
      });
      let totalAmount = 0
      data?.map((p: any, index: any) => {
        let total = Number(p?.unit_price) * (Boolean(p.quantity) ? Number(p.quantity) : 0)
        totalAmount += total
      });
      if (totalAmount == 0) {
        setPrice("₹00.00");
      } else {
        const formattedAmount = formatIndianCurrency(totalAmount);
        setPrice(formattedAmount);
      }
    }
  }, [invoiceData?.returns]);

  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    const updatedProductdata = invoiceData?.items?.map((invoice: any) => ({
      productId: invoice.item_id,
      id: invoice.item_id,
      checked: checked,
      quantity: Number(invoice?.quantity)?.toFixed(0),
      unit_price: invoice?.unit_price
    }));
    // if (checked) {
    updatedProductdata?.map(data => {
      setProductValue((prevproductValue) => ({
        ...prevproductValue,
        [data.productId]: {
          ...(prevproductValue[data.productId] || {}),
          checked: data.checked,
          id: data.id,
          unit_price: parseFloat(data?.unit_price) || 0,
        },
      }));
    })
    // }
    // else {
    // updatedProductdata?.map(data => {
    //   delete productValue?.[data.productId]
    // })
    // setProductValue({ ...productValue })
    // }
    // setProductData([...updatedProductdata]);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, Id: number, productId: number, qty: number, unit_price: number) => {
    let checked = e.target?.checked
    // if (e.target?.checked) {
    setProductValue((prevproductValue) => ({
      ...prevproductValue,
      [productId]: {
        // Ensure other properties are maintained if they exist
        ...(prevproductValue[productId] || {}),
        checked: checked,
        id: Id,// 'unit' should be a defined value
        unit_price: Number(unit_price) || 0
      },
    }));
    // }
    // else {
    //   delete productValue?.[Id];
    //   setProductValue({ ...productValue })
    // setProductValue((prevproductValue) => ({
    //   ...prevproductValue,
    //   [productId]: {
    //     // Ensure other properties are maintained if they exist
    //     ...(prevproductValue[productId] || {}),
    //     checked: false,
    //     productId: "",
    //     quantity: ""// 'unit' should be a defined value
    //     // 'unit' should be a defined value
    //   },
    // }));
    // }
  };

  useEffect(() => {
    // let data = productData.filter((_el) => _el.checked);
    let qty = 0;
    for (const key in productValue) {
      const item = productValue[key];
      if (item.checked && item?.quantity > 0) {
        qty += Number(item?.quantity);
      }
    }
    setTotal(qty);
  }, [productValue]);

  const handlePenClick = (id: any) => {
    setEditMode((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleBlurReturn = (e: React.ChangeEvent<HTMLInputElement>, id: any) => {
    setEditMode((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }

  const [totalDue, setTotalDue] = useState(Number(invoiceData?.invoice_amount));
  useEffect(() => {
    const invoiceAmount = Number(invoiceData?.invoice_amount) ?? 0;

    // Calculate the sum of all payments, defaulting to 0 if undefined
    const cash = Number(values?.cash) || 0;
    const credit = Number(values?.credit) || 0;
    const cheque = Number(values?.cheque) || 0;
    const online = Number(values?.online) || 0;

    // Calculate the total paid
    const totalPaid = cash + credit + cheque + online;

    // Calculate the remaining balance
    const remainingBalance = invoiceAmount - totalPaid;
    setTotalDue(remainingBalance);
  }, [values]);

  const [isEditing, setIsEditing] = useState(false);
  const [unit, setUnit] = useState<number>();
  const [update, setupdated] = useState([]);

  const handleClick = () => {
    setIsEditing(true);
    // setUnit(productData); // Set initial value of input to the current unit value
  };

  const handleInputChanges = (productId: number, value: number, quantity: any) => {
    // if (!Number.isNaN(value)) {
    setUnit(Boolean(value) ? Number(value) : 0);
    // }
    let qty = parseInt(quantity);

    if (value > qty) {
      alert("Entered quantity is more than the original quantity in the invoice.");
    }
    else {
      setProductValue((prevproductValue) => ({
        ...prevproductValue,
        [productId]: {
          // Ensure other properties are maintained if they exist
          ...(prevproductValue[productId] || {}),
          quantity: Boolean(value) ? Number(value) : "",
          total: Number(productValue?.[productId]?.unit_price) * (Boolean(value) ? Number(value) : 0),
          // id: productId // 'unit' should be a defined value
        },
      }));
    }

    // setEditMode((prevState: any) => ({
    //   ...prevState,
    //   [productId]: !prevState[productId],
    // }));
  };
  // const handlekyedown = (event: any, productId: any) => {
  //   if (event.key === "Enter") {
  //     setProductValue((prevproductValue) => ({
  //       ...prevproductValue,
  //       [productId]: {
  //         // Ensure other properties are maintained if they exist
  //         ...(prevproductValue[productId] || {}),
  //         quantity: Boolean(unit) ? Number(unit) : 0,
  //         total: Number(productValue?.[productId]?.unit_price) * (Boolean(unit) ? Number(unit) : 0),
  //         // id: productId // 'unit' should be a defined value
  //       },
  //     }));
  //     setEditMode((prevState: any) => ({
  //       ...prevState,
  //       [productId]: !prevState[productId],
  //     }));
  //     setUnit(0);
  //   }
  // };


  // -------------image_upload----------
  const [isImageUpload, setisImageUpload] = useState<boolean>(false);
  const [imageName, setisImageName] = useState<string>("");
  const [triggerUpload, setTriggerUpload] = useState<boolean>(false);
  const handleUpload = () => {
    setisImageUpload(false);
  };
  const handleImageChange = () => {
    let img = document.getElementById("upload-image");
    img?.click();
  }
  function uploadImageClick(value: boolean, name: string) {
    handleImageChange()
    setisImageUpload(value);
    setisImageName(name);
    if (!productValue?.[name]?.image_show) {
      setTriggerUpload(value);
    }
  }
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    let file = e?.currentTarget?.files?.[0];

    if (file) {
      const base64 = await toBase64(file);
      setProductValue((prevproductValue) => ({
        ...prevproductValue,
        [Number(name)]: {
          // Ensure other properties are maintained if they exist
          ...(prevproductValue[Number(name)] || {}),
          image: file, // 'unit' should be a defined value
          image_show: base64,
        },
      }));
    }
  }
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
  function handleCancel(name: string) {
    setProductValue((prevproductValue) => ({
      ...prevproductValue,
      [Number(name)]: {
        // Ensure other properties are maintained if they exist
        ...(prevproductValue[Number(name)] || {}),
        image: "", // 'unit' should be a defined value
        image_show: "",
      },
    }));
  }
  useEffect(() => {
    if (triggerUpload) {
      const uploadInput = document.getElementById('upload-image');
      uploadInput?.click(); // Programmatically click the hidden input field
      setTriggerUpload(false); // Reset the trigger
    }
  }, [triggerUpload]);
  const generateRawQueryParams = (data: productValueType): string => {
    const queryParts: string[] = [];
    let index = 0;

    for (const key in data) {
      const item = data[key];
      if (item.checked) {
        queryParts.push(`item_ids[${index}]=${item.id}`);
        queryParts.push(`quantity[${index}]=${item.quantity}`);
        index++;
      }
    }

    return queryParts.join("&");
  };
  // console.log(productValue, "productValue===")
  const [qtyError, setQtyError] = useState<any>([])
  const handleReturnSubmit = async () => {
    var totalAmount = 0;
    var totalQuantity = 0;
    let qtyId = [];
    let allCheckedItemsHaveQuantity = true;
    for (const key in productValue) {
      const item = productValue[key];
      if (item.checked) {
        if (item?.quantity > 0) {
          totalQuantity += item?.quantity;
          if (item?.total) {
            totalAmount += item?.total;
          }
        }
        else {
          // console.log(item?.id, "item?.iditem?.iditem?.id")
          qtyId.push(item?.id);
          allCheckedItemsHaveQuantity = false;
        }
      }
    }
    setQtyError([...qtyId])
    const formattedAmount = formatIndianCurrency(totalAmount);
    setPrice(formattedAmount);
    setReturnItem(totalQuantity);
    // handleClose();
    if (allCheckedItemsHaveQuantity) {
      handleClose();
    }
  };
  // console.log(qtyError, "gkjasgAGKJ")
  return (
    <>
      <span
        className="col-2 text-decoration-underline align-self-center AddLink"
        onClick={handleShow}
      >
        {
          Object?.keys(productValue).length > 0 ? "Edit" : "Add"
        }
      </span>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="modal-bottom modal_payment"
      >
        {
          isImageUpload ?
            <div className="modal_container_mob">
              <div className="d-flex justify-content-center py-mb-3 mb-5 p-4 ">
                <div className="main-div">
                  <div className="header p-md-3">
                    <div className="d-flex">
                      <div className="back-link" onClick={handleUpload}>
                        <LeftArrow />
                      </div>
                      <span> Upload image</span>
                    </div>
                    <div className="download-btn-div">
                      <a
                        href={productValue?.[imageName]?.image_show}
                        download={imageName}
                      >
                        <Download />
                      </a>
                    </div>
                  </div>
                  <div className="body p-md-4 pt-4 return_upload_body">
                    <div className="position-relative return_container">
                      <div className="image image_return">
                        <div className="upload-image-div">
                          {
                            Boolean(productValue?.[imageName]?.image_show) ?
                              <>
                                <img src={productValue?.[imageName]?.image_show ? productValue?.[imageName]?.image_show : ""} className="img-fluid h-100 w-100" alt="" />
                                <div className="img-overlay"></div>
                              </>
                              :
                              <div className="upload-image-child" onClick={() => handleImageChange()}>
                                <input type="file" id="upload-image" className="d-none" name={imageName} onChange={(e) => handleChange(e, imageName)} />
                                <div className="text-center">
                                  <CameraUpload />
                                  <p>Camera</p>
                                </div>
                              </div>
                          }
                        </div>
                      </div>
                      {
                        productValue?.[imageName]?.image_show && productValue?.[imageName]?.image_show ?
                          <div className="close-btn-div" onClick={() => handleCancel(imageName)}>
                            <Close />
                          </div> : <></>
                      }
                    </div>
                    <div className="row mx-0 px-0 pt-4 bottom-btns">
                      <div className="col-6 p-0 pe-1 ">
                        <button type="button" className="w-100 btn-retake me-1" onClick={() => handleImageChange()}>
                          <input type="file" id="upload-image" name={imageName} className="d-none" onChange={(e) => handleChange(e, imageName)} />
                          Retake
                        </button>
                      </div>
                      <div className="col-6 p-0 ps-1">
                        {Boolean(productValue?.[imageName]?.image_show) ?
                          // <button type="button" className="w-100 btn-save" onClick={() => navigate(`${location?.pathname?.includes("/collection/") ? "/dashboard/collection/payment_collection/" : "/dashboard/payment_collection/"}` + invoiceData?.id)}>Save</button>
                          <button type="button" className="w-100 btn-save" onClick={handleUpload}>Save</button>
                          :
                          <button type="button" className="w-100 btn-save" style={{ background: "#98A2B3", color: "white" }}>Save</button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> :
            <>
              <Modal.Header className="modal_head_payment">
                <Modal.Title className="w-100">
                  <div className="back-link">
                    <span className="d-none d-md-block">
                      <div className="d-flex">
                        <LeftArrow onClick={handleClose} className="arrow_icon align-self-center" />{" "}
                        <span> Product Returns</span>
                        <span className="selectedItem d-flex justify-content-center" style={{ fontSize: "16px", fontWeight: "500" }}>
                          {total}
                        </span>
                      </div>
                    </span>
                    <div className="d-block d-md-none w-100">
                      <div className="d-flex justify-content-between">
                        <div className="modal_title">
                          Returns Selected
                          <span className="selectedItem d-flex justify-content-center" style={{ fontSize: "16px", fontWeight: "500" }}>{total}</span>
                        </div>
                        <div className="align-self-center">
                          <CloseXModel onClick={handleClose} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal_body">
                {/* <div className=""> */}
                <div className="pb-4 pb-md-0 d-block d-md-none product_return_mobile_modal overflow-scroll">
                  {invoiceData?.items?.map((product, index) => (
                    <div className="w-100 product_return mb-3" key={index}>
                      {/* --monile//// */}
                      <div className="d-flex justify-content-between">
                        <div className="d-flex product_mob_productValue" style={{ padding: "12px" }}>
                          <label htmlFor={`check-${product?.item_id}`}>
                            <input
                              type="checkbox"
                              checked={productValue?.[product?.item_id]?.checked ? productValue?.[product?.item_id]?.checked : false}
                              id={`check-${product?.item_id}`}
                              className={`ivdt-checked ${productValue?.[product?.item_id]?.checked && productValue?.[product?.item_id]?.checked && "active"
                                }`}
                              onChange={(e) => handleCheckboxChange(e, product?.item_id, product?.item_id, product?.quantity, product?.unit_price)}
                            />
                          </label>
                          <div className="product_name text-dark">
                            {product?.item_name}
                          </div>
                        </div>
                        <div className="p-2">₹{numberWithCommas(product?.unit_price)}</div>
                      </div>
                      {/* <hr className="m-0" style={{ color: "#b9b9b9" }} /> */}
                      <div className="d-flex justify-content-between align-items-center  product_mob_sec">
                        <div
                          className={`text-decoration-underline units_name d-flex`}
                          style={{
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            color: productValue?.[product?.item_id]?.checked
                              ? qtyError?.includes(product?.item_id) ? "red" : "#0080FC" : "text-gray-return"
                          }}
                        >
                          <> {editMode[product?.item_id] ? (
                            <input
                              type="number"
                              style={{
                                width: "50px",
                                border: "none",
                                outline: "none",
                                color: qtyError?.includes(product?.item_id) ? "red" : "#0080FC",
                                background: "#F9FAFB"
                              }}
                              className="form-control form-control-sm mobile-input-product-return"
                              id="colFormLabelSm"
                              // onChange={(e) =>
                              //   handleUnitChange(product.id, parseInt(e.target.value))
                              // }
                              value={productValue?.[product?.item_id]?.quantity}
                              onChange={(e) =>
                                handleInputChanges(
                                  product?.item_id,
                                  parseInt(e.target.value),
                                  product?.quantity
                                )
                              }
                              onBlur={(e) => handleBlurReturn(e, product?.item_id)}
                              // onKeyDown={(event) =>
                              //   handlekyedown(event, product?.item_id)
                              // }
                              autoFocus
                            />
                          ) :
                            productValue?.[product?.item_id]?.quantity ?
                              Number(productValue?.[product?.item_id]?.quantity).toFixed(1) :
                              "0.0"}
                            {" "} unit
                          </>
                          <span className="m-2">
                            {productValue?.[product?.item_id]?.checked ? (
                              <Pen onClick={() => handlePenClick(product?.item_id)} />
                            ) : (
                              <PenGray />
                            )}
                          </span>
                          {/* {editMode[product.id] && (
                      <input
                        type="number"
                        style={{ width: "50px" }}
                        className="form-control form-control-sm"
                        id="colFormLabelSm"
                        onChange={(e) =>
                          handleUnitChange(product.id, parseInt(e.target.value))
                        }
                      />
                    )} */}
                        </div>
                        <div>
                          <span
                            style={{
                              cursor: "pointer",
                              height: "31px",
                              width: "31px",
                            }}
                          >
                            {productValue?.[product?.item_id]?.checked ?
                              productValue?.[product?.item_id]?.image_show ?
                                <BlueCamera style={{ height: "31px", width: "31px" }} onClick={() => uploadImageClick(true, String(product?.item_id))} />
                                : <BlueCameraUnchecked style={{ height: "31px", width: "31px" }} onClick={() => uploadImageClick(true, String(product?.item_id))} />
                              : <Camera style={{ height: "31px", width: "31px" }} />}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-none d-md-block">
                  <table
                    className="invoice-table-component"
                  //   style={{ borderRadius: "12px" }}
                  >
                    <thead>
                      <tr>
                        {true && (
                          <th>
                            <input
                              placeholder="test"
                              type="checkbox"
                              className="checkbox"
                              checked={selectAllChecked}
                              onChange={handleSelectAllCheckbox}
                            />
                          </th>
                        )}

                        {product_data.map((heading) => (
                          <InvoiceTableTh
                            key={heading.head}
                            heading={heading}
                            setSortingStates={setSortingStates}
                            moveToTop={() => { }}
                          // withSorting={location?.pathname?.includes("batchs")?true:showCheckbox}
                          />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData?.items?.map((product, index) => (
                        <tr key={index} className={`${productValue?.[product?.item_id]?.checked}`}>
                          <td className="check align-self-center">
                            <label htmlFor={`check-${product?.item_id}`}>
                              <input
                                type="checkbox"
                                checked={productValue?.[product?.item_id]?.checked ? productValue?.[product?.item_id]?.checked : false}
                                id={`check-${product?.item_id}`}
                                className={`ivdt-checked ${productValue?.[product?.item_id]?.checked && productValue?.[product?.item_id]?.checked && "active"
                                  }`}
                                onChange={(e) => handleCheckboxChange(e, product?.item_id, product?.item_id, product?.quantity, product?.unit_price)}
                              />
                            </label>
                          </td>
                          <td className="company other">{product?.item_name}</td>
                          <td className="company other">
                            {productValue?.[product?.item_id]?.checked ? (
                              <Container
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  width: "60px",
                                  height: "36px",
                                  border: qtyError?.includes(product?.item_id) ? "1px dashed  red" : "1px dashed  #0080FC",
                                  borderRadius: "8px",
                                  padding: "10px 16px",
                                  margin: "0px",
                                  display: "inline-block"
                                }}
                                onClick={() => handlePenClick(product?.item_id)}
                              //   onClick={handleClick}
                              >
                                {/* {editMode[product?.item_id] ? ( */}
                                <input
                                  style={{
                                    width: "38px",
                                    height: "30px",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    color: "#0080FC",
                                    textAlign: "center"
                                  }}
                                  type="text"
                                  // value={unit}
                                  value={productValue?.[product?.item_id]?.quantity}
                                  onChange={(e) =>
                                    handleInputChanges(
                                      product?.item_id,
                                      parseInt(e.target.value),
                                      product?.quantity
                                    )
                                  }
                                  //   onChange={handleInputChanges}
                                  // onKeyDown={(event) =>
                                  //   handlekyedown(event, product?.item_id)
                                  // }
                                  autoFocus
                                />
                                {/* ) : (
                                <span
                                  style={{
                                    color: "#0080FC",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                  }}
                                >
                                  {productValue?.[product?.item_id]?.quantity && productValue?.[product?.item_id]?.quantity}
                                </span>
                                )} */}
                              </Container>
                            ) : (
                              <UnitImage1 style={{ cursor: "pointer" }} />
                            )}
                          </td>
                          <td>₹{numberWithCommas(product?.unit_price)}</td>
                          <td className="company other">
                            <span
                              style={{
                                cursor: "pointer",
                                height: "31px",
                                width: "31px",
                              }}
                            >
                              {productValue?.[product?.item_id]?.checked ?
                                productValue?.[product?.item_id]?.image_show ?
                                  <BlueCamera style={{ height: "31px", width: "31px" }} onClick={() => uploadImageClick(true, String(product?.item_id))} />
                                  : <BlueCameraUnchecked style={{ height: "31px", width: "31px" }} onClick={() => uploadImageClick(true, String(product?.item_id))} />
                                : <Camera style={{ height: "31px", width: "31px" }} />}
                            </span>
                          </td>
                        </tr>
                        //     <tr>
                        //   <td colSpan={product_data.length + 1}>rf</td>
                        //   </tr>
                      ))}
                      <tr className="last-row-tr">
                        <td colSpan={product_data.length + 1} className="last-row">
                          <button
                            className="btn-payment-return-footer d-none d-sm-block float-end"
                            onClick={handleReturnSubmit}
                            disabled={loadingReturn}
                          >
                            {loadingReturn ?
                              <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                            }
                            Save
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* </div> */}
              </Modal.Body>
              <div className="payment-footer-mob-modal d-block d-md-none w-100">
                <div className=" payment-footer-mob-btn-modal">
                  <button
                    className="btn btn-payment-return w-100"
                    onClick={handleReturnSubmit}
                    disabled={loadingReturn}
                  >
                    {loadingReturn ?
                      <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} /> : ""
                    }
                    Save
                  </button>
                </div>
              </div>
            </>
        }
      </Modal >
    </>
  );
}
export default HandleModelReturn;