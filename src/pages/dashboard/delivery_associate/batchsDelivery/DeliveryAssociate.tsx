import "./delivery_associate.scss";
// import "./components/batchDetailsTable/batch-details-table.scss";
import "./deliveryDetailsTable/delivery-details-table.scss";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import { ReactComponent as List } from "@/assets/svgs/list.svg";

import {
  useGetAssociatesQuery,
  useGetBatchDetailByIdQuery,
  useGetBatchsSingleDataMutation,
} from "@/state/slices/batchs/batchsApiSlice";
// import BatchDetailsTable from "@pages/dashboard/batchs/details/components/batchDetailsTable/BatchDetailsTable";
import React, {
  LegacyRef,
  MutableRefObject,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useSetOpenNav } from "@pages/dashboard";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip,
  Offcanvas,
} from "react-bootstrap";
import { ReactComponent as PersonCircle } from "../../../../assets/svgs/Profile-circle.svg";
import InvoiceTable from "@pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ReactComponent as LeftArrow } from "../../../../assets/svgs/arrow-left.svg";
import { ReactComponent as Search } from "../../../../assets/svgs/Search.svg";
import { ReactComponent as CloseX } from "@/assets/svgs/close-x.svg";
import { useGetBatchsMutation } from "@/state/slices/batchs/batchsApiSlice";
import Batch, { Assosiate, Vehicle } from "@/types/Batch";
import { useAddInvoicesToBatchMutation } from "@/state/slices/batchs/batchsApiSlice";
import { useUpdateAssociateMutation } from "@/state/slices/batchs/batchsApiSlice";
import { setBatchDetails, setBatchs } from "@/state/slices/batchs/batchsSlice";
import Collections from "@pages/dashboard/invoices/(invoicesList)/collections";
import { useGetUserMutation, useLogoutMutation } from "@/state/slices/authApiSlice";
import Invoice from "@/types/Invoice";
import BatchDetails from "@/types/BatchDetails";
import useDebounce from "@/utils/hooks/debounce";
import DeliveryDetailsTable from "./deliveryDetailsTable/DeliveryDetailsTable";
import OffcanvasMobile from "@/components/OffcanvasMobile";
import axios from "axios";
import { HOST, TOKEN_STORAGE } from "@/utils/constants";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { LoginUserContext } from "@/App";
import permissions from "@/ennum/permission";

export default function DeliveryAssociate() {
  const batchsState = useAppSelector((state: any) => state.batchs);
  // const {
  //   data: AssosiateData,
  //   isLoading: isAssosiateLoading,
  //   isError: isAssosiateError,
  // } = useGetAssociatesQuery();

  const batchs = batchsState?.batchs;
  const params = useParams();

  // const { data: batchDetails, isLoading: isBatchLoading, refetch: refetchBatch } =
  //   useGetBatchDetailByIdQuery(params?.batchNo, {
  //     // skip: isNaN(batchId), // Skip the query if batchId is NaN
  //   });

  const [batch, setBatch] = useState<any>();

  const page = batchsState.page;
  const [searchTxt, setSearchTxt] = useState("");
  const [checkedData, setCheckedData] = useState<Invoice[]>([]);
  const { setOpenNav } = useSetOpenNav();
  //const {invoiceNo} = useParams();
  const invoicesState = useAppSelector((state: any) => state.invoices);
  const invoices = invoicesState.invoices;
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  // const [getUser, { data, isSuccess }] = useGetUserMutation();
  const lastSegment = segments[segments.length - 2];
  // const [getInvoices, { isLoading, error }] = useGetInvoicesMutation();
  const [getBatchs, { }] = useGetBatchsMutation();
  const context = useContext(LoginUserContext)
  const [getBatchsOne, { data: dataBatch, isLoading, isError, error }] = useGetBatchsSingleDataMutation();
  const [logout] = useLogoutMutation();
  const [invoiceMode, setInvoiceMode] = useState(false);
  const [updateAssociate] = useUpdateAssociateMutation();
  const [showReportButton, setShowReportButton] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [addInvoicesToBatch] = useAddInvoicesToBatchMutation();

  const handleInvoiceSelectionChange = (selectedIds: number[]) => {
    setSelectedInvoiceIds(selectedIds);
  };
  const authToken = localStorage.getItem(TOKEN_STORAGE);
  // const [loadingBatch, setLoadingBatch] = useState(false)

  // async function getBatchDetails() {
  //   setLoadingBatch(true);

  //   try {
  //     const response = await axios.post(
  //       `${HOST[process.env.NODE_ENV]}/api/batches?page=all`,
  //       {}, // No additional body data is passed
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           'Authorization': `Bearer ${authToken}`,
  //         },
  //       }
  //     );

  //     // If a response is returned successfully, update the batch data
  //     if (response && response.status === 200) { // Check status to ensure success
  //       setBatch({ ...response.data });
  //     } else {
  //       console.error('Unexpected response:', response);
  //     }
  //   } catch (error: any) {
  //     // Log the error details for debugging
  //     console.error('Error fetching batch data:', error);
  //   } finally {
  //     // End loading, whether successful or not
  //     setLoadingBatch(false);
  //   }
  // }
  const [userData, setUserData] = useState<any>({});
  useEffect(() => {
    // console.log("data changed", data);
    // console.log(context?.loginUserData, 'auth')
    if (context?.loginUserData && context?.loginUserData?.role_name) {
      setUserData({ ...context?.loginUserData }); // Update state when data is available
    }
  }, [context]);
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
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/login");
      context?.setAuthContext("");
      context?.setLoginUserData({});
    }
  }, [isError]);
  useEffect(() => {
    if (Boolean(dataBatch)) {
      setBatch(dataBatch);
    }
  }, [dataBatch])
  useEffect(() => {
    if (batch) {
      batch?.invoices?.map((v: any) => {
        if (v.status == "3" || v.status == "4") {

        } else {
          setShowReportButton(false);
        }
      });
    }
  }, [batch])

  // useEffect(() => {
  //   getUser();
  // }, [])

  // useEffect(() => {
  //   getInvoices({keyword: ""});
  // }, []);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);
  useEffect(() => {
    setCheckedData([]);
    dispatch(clearState());
    if (invoiceMode) {
      // getInvoices({
      //   keyword: "",
      //   status: location.pathname.includes("collections") ? 3 : 1,
      // });
    }
  }, [invoiceMode]);
  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  useEffect(() => {
    //setCheckedData(invoices.filter(v => v.checked === true))
    // getInvoices({
    //   keyword: debouncedSearchTerm,
    //   page:
    //     invoicesState.keyword ?? "" !== debouncedSearchTerm ?? ""
    //       ? 1
    //       : invoicesState.page,
    //   status: location.pathname.includes("collections") ? 3 : 1,
    // });
  }, [debouncedSearchTerm]);

  // useEffect(() => {
  //   setBatch(batchDetails);
  // }, [batchDetails]);
  //useEffect(() => {
  //if (invoiceNo && invoices) {
  //  const idx = invoices.findIndex((i) => i.invoice_number === invoiceNo);
  //  if (idx === -1) navigate("/");
  //  else setInvoice(invoices[idx]);
  //}
  // }, [invoiceNo, invoices]);

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [searchTextIn, setSearchTExtIn] = useState("");
  const tabs = [
    {
      name: invoiceMode ? "Add Invoice for Batch " : "Batch ",
      value: lastSegment,
      icon: (active: boolean) => {
        return "/assets/Icon/left-arrow.svg";
      },
      link: location?.pathname.includes("collections")
        ? invoiceMode
          ? ""
          : "/dashboard/batches/collections"
        : invoiceMode && !location?.pathname.includes("deliveries")
          ? ""
          : "/dashboard/batches/deliveries",
    },
  ];
  const dividerStyle = {
    height: "100%",
    width: "1px",
    backgroundColor: "#000",
    color: "#000",
    marginLeft: "10px",
    marginRight: "10px",
  };
  const backgroundColorWithOpacity = "rgba(0, 149, 255, 0.06)";
  const borderColorWithOpacity = "rgba(0, 149, 255, 0.1)";
  const dividerColor = "#D0D5DD";
  //   const Toolbar = ({batchInvoicesSearch}: {
  //     batchInvoicesSearch: any
  //   }) => {

  // useEffect(() => {
  // batchInvoicesSearch(searchTextIn)
  // },[searchTextIn])
  //     return (

  //     )
  //       ;
  //   };

  let excludedHeadings;
  if (location?.pathname?.includes("collections")) {
    excludedHeadings = ["Date"];
  } else if (!location?.pathname?.includes("collections")) {
    excludedHeadings = ["Payment", "Due Amount"];
  }

  const [lgOpen, setLgOpen] = useState(false);
  const [showMsg, setshowMsg] = useState(false)
  // console.log("batch", `https://abc.indelivtest.in/tenants/abc/users/${batch?.assignee?.image}`)
  return (
    <>{
      isLoading ? (
        <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
          <div>
            <Loading className="loadingCircle" />
          </div>
        </div>
      )
        :
        <>
          {
            batch?.batch_number &&
              (batch?.batch_type == "1" && location?.pathname?.includes("/delivery")) ||
              (batch?.batch_type == "2" && location?.pathname?.includes("/collection"))
              ?
              <>
                <div className="delivery-details-component">
                  <div className="nav-header-delivery">
                    <div
                      //onClick={() => setSearchTxt("")}
                      className="d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
                    >
                      {tabs.map((tab, index) => (
                        <NavLink
                          to={tab.link}
                          key={index}
                          className={"text-decoration-none nav-link-cont"}
                        >
                          <li className={`navbar-link-delivery  d-flex `}>
                            {/* <span style={{ alignSelf: "center" }}>
                  <LeftArrow
                    onClick={() => {
                      setInvoiceMode(false);
                    }}
                  />
                </span> */}
                            <span className="nav-name-delivery align-middle py-2 ps-2">
                              {tab.name} <span className="nav-value-delivery">{batch?.batch_number}</span>
                            </span>
                            <span className="desktop-only">
                              <span style={{
                                borderRight: "1px solid #D0D5DD",
                                padding: "0px",
                                height: "23px",
                                display: "inline-block",
                                marginLeft: "32px",
                                marginTop: "8px"
                              }}></span>
                          </span>

                          <span className="d-flex align-items-center justify-content-end" style={{}}>
                            <div className="desktop-only" style={{ paddingLeft: "32px" }}>
                              <div className="d-flex">
                                <span
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    background: "#ECF7FF"
                                  }}>
                                  {batch?.assignee?.image ?
                                    <img
                                      // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/users/${batch?.assignee?.image}`}
                                      src={batch?.assignee?.image_path}
                                      alt="User Avatar"
                                      className="assignee-avatar"
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover"
                                      }}
                                    />
                                    :
                                    <span> {batch?.assignee?.first_name?.charAt(0).toUpperCase()}{batch?.assignee?.last_name?.charAt(0).toUpperCase()}</span>
                                  }
                                  {/* <PersonCircle className="me-2" /> */}
                                </span>
                                <span style={{ paddingLeft: "12px", alignSelf: "center" }}>
                                  <div className="p-0 batch-label">Assigned By</div>
                                  {batch?.assignee?.name && (
                                    <div className="batch-value">{batch?.assignee?.name}</div>
                                  )}
                                  {!batch?.associate?.name && (
                                    <div className="batch-value">---</div>
                                  )}
                                </span>
                              </div>
                            </div>

                          </span>
                        </li>
                        </NavLink>
                      ))}
                    <div className="mobile-only">
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
                  <div className="desktop-only">
                    <div className="right-bar-delivery ">
                      {!invoiceMode && (
                        <span className="">
                          {
                            showReportButton ? (
                              <button
                                disabled={!batch?.associate?.name}
                                className={`btn btn-secondary ms-2 px-4 create-batch ${batch?.associate?.name ? "report-button" : "assign-button"
                                  } `}
                              >
                                {!batch?.associate?.name && <span className="">Report</span>}
                                {batch?.associate?.name && (
                                  <span
                                    className=""
                                    onClick={() => {
                                      if (location?.pathname?.includes("collection")) {
                                        navigate(
                                          "/dashboard/collection/report/" +
                                          batch?.batch_number +
                                          "/" +
                                          batch?.id
                                        );
                                      } else {
                                        navigate(
                                          "/dashboard/delivery/report/" +
                                          batch?.batch_number +
                                          "/" +
                                          batch?.id
                                        );
                                      }
                                    }}
                                  >
                                    Report
                                  </span>
                                )}
                              </button>
                            ) :
                              (
                                <OverlayTrigger placement="bottom" overlay={(props) => (
                                  <Tooltip {...props} >
                                    Please Complete your invoice to get the Report
                                  </Tooltip>
                                )}>
                                  <button
                                    className={`btn btn-secondary ms-2 px-4 create-batch assign-button`}
                                  >
                                    <span className="">Report</span>
                                  </button>
                                </OverlayTrigger>
                              )
                          }

                        </span>
                      )}

                    </div>
                  </div>

                </div>

                <div className="invoices-list-content pt-3 delivery_component_padding">
                  <div className="left-container-delivery left-container-flow">
                    {/* {location.pathname.includes("/collections") ? <div className="blinking-arrow"></div> : <></>} */}
                    <div className="payments-section-delivery">
                      {!invoiceMode && batch && (
                        <DeliveryDetailsTable
                          batchs={batch}
                          isCollection={location.pathname.includes("collection")}
                          showCheckbox={false}
                          // loading={isLoading}
                          loadMoreBatchs={() => setLoadMoreTrigger((i) => !i)}
                          setBatchs={(i: Batch[]) => dispatch(setBatchs(i))}
                          excludedHeadings={excludedHeadings}
                          searchTextIn={searchTextIn}
                        />
                      )}

                      {/* {!invoiceMode && location.pathname.includes("collections") &&
            <Collections invoiceMode={invoiceMode}/>
          } */}
                      {invoiceMode && (
                        <>
                          <div className="mobile-only">
                            <InputGroup
                              className="input-group"
                              style={{
                                minWidth: "100%",
                                marginBottom: "20px",
                                border: "1px solid #eaecf0",
                                borderRadius: "8px",
                              }}
                            >
                              <Button variant="button-white" id="button-addon1">
                                <Search />
                              </Button>
                              <FormControl
                                aria-label="Example text with button addon"
                                aria-describedby="basic-addon1"
                                placeholder="Search Invoice Number"
                                value={searchTxt}
                                type="search"
                                onChange={(e) => setSearchTxt(e.target.value)}
                              />
                            </InputGroup>
                          </div>
                          <InvoiceTable
                            invoices={[...checkedData, ...(invoices ?? [])]
                              .filter(
                                (obj, index, self) =>
                                  index === self.findIndex((t) => t.id === obj.id)
                              )
                              .filter(
                                (invoice) =>
                                  !batch?.invoices.some(
                                    (batchInvoice: any) =>
                                      batchInvoice?.invoice_number ===
                                      invoice?.invoice_number
                                  )
                              )}
                            checkedData={checkedData}
                            setInvoices={(i) => dispatch(setInvoices(i))}
                            showCheckbox={true}
                            // loading={isLoading}
                            setSearchTxt={setSearchTxt}
                            onSelectionChange={handleInvoiceSelectionChange}
                            loadMoreInvoices={() => setLoadMoreTrigger((i) => !i)}
                            invoiceMode={invoiceMode}
                            excludedHeadings={
                              location.pathname.includes("collections")
                                ? []
                                : ["Overdue By", "Due"]
                            }
                            setCheckedData={setCheckedData}
                          />
                        </>
                      )}
                      {/* {invoiceMode && location.pathname.includes("collections") &&
            <Collections invoiceMode={true}/>
          } */}

                    </div>
                  </div>
                </div>
              </div>
          <div className=" payment-footer-mob-delivery mobile-only w-100" >
            {showMsg ? <div className="payment_report_msg text-center" >
              Please Complete your invoice to get the Report <CloseX onClick={() => setshowMsg(false)} />
            </div> : <></>}
            <div className="p-3 payment-footer-mob-btn-delivery">
              {
                showReportButton ?
                  <button
                    className="btn btn-primary w-100"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                    onClick={() => {
                      if (location?.pathname?.includes("collection")) {
                        navigate(
                          "/dashboard/collection/report/" +
                          batch?.batch_number +
                          "/" +
                          batch?.id
                        );
                      } else {
                        navigate(
                          "/dashboard/delivery/report/" +
                          batch?.batch_number +
                          "/" +
                          batch?.id
                        );
                      }
                    }}
                  >
                    Report
                  </button>
                  :
                  <button className="btn btn-payment-save w-100" style={{
                    color: "#475467", fontSize: "14px",
                    fontWeight: "600"
                  }} onClick={() => setshowMsg(true)}>Report</button>
              }
            </div>
          </div>
        </> :
      <>
        <div >
          <div className="text-end">
            <div className="mobile-only">
              {
                userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.delivery)) ||
                  userData?.role?.permissions?.every((per: any) => per?.name.includes(permissions?.collection))
                  ?
                  <OffcanvasMobile />
                  :
                  <List
                    className="burger"
                    onClick={() => setOpenNav(true)}
                  />
              }
            </div>
          </div>
          <div style={{ height: "40vh", }} className="no_batch d-flex justify-content-center align-items-center" >
            No batch assigned
          </div>
        </div>
      </>
          }
    </>
    }
    </>
  );
}
