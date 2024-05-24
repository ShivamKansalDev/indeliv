import "./batch-detail.scss";
import "./components/batchDetailsTable/batch-details-table.scss";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import {
  useGetAssociatesQuery,
  useGetBatchDetailByIdQuery,
} from "@/state/slices/batchs/batchsApiSlice";
import BatchDetailsTable from "@pages/dashboard/batchs/details/components/batchDetailsTable/BatchDetailsTable";
import React, {
  LegacyRef,
  MutableRefObject,
  RefObject,
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
} from "react-bootstrap";
import { ReactComponent as PersonCircle } from "../../../../assets/svgs/Profile-circle.svg";
import InvoiceTable from "@pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ReactComponent as LeftArrow } from "../../../../assets/svgs/arrow-left.svg";
import { ReactComponent as Search } from "../../../../assets/svgs/Search.svg";
import { useGetBatchsMutation } from "@/state/slices/batchs/batchsApiSlice";
import Batch, { Assosiate, Vehicle } from "@/types/Batch";
import { useAddInvoicesToBatchMutation } from "@/state/slices/batchs/batchsApiSlice";
import { useUpdateAssociateMutation } from "@/state/slices/batchs/batchsApiSlice";
import { setBatchDetails, setBatchs } from "@/state/slices/batchs/batchsSlice";
import Collections from "@pages/dashboard/invoices/(invoicesList)/collections";
import { useGetUserMutation } from "@/state/slices/authApiSlice";
import Invoice from "@/types/Invoice";
import BatchDetails from "@/types/BatchDetails";
import useDebounce from "@/utils/hooks/debounce";
import { Link } from "react-router-dom";

export default function BatchDetail() {
  const batchsState = useAppSelector((state) => state.batchs);
  const {
    data: AssosiateData,
    isLoading: isAssosiateLoading,
    isError: isAssosiateError,
  } = useGetAssociatesQuery();
  const batchs = batchsState.batchs;
  const params = useParams();

  const { data: batchDetails, refetch: refetchBatch } =
    useGetBatchDetailByIdQuery(params?.batchNo, {
      // skip: isNaN(batchId), // Skip the query if batchId is NaN
    });

  const [batch, setBatch] = useState<BatchDetails>();

  const page = batchsState.page;
  const [searchTxt, setSearchTxt] = useState("");
  const [checkedData, setCheckedData] = useState<Invoice[]>([]);
  // // console.log(searchTxt);
  const { setOpenNav } = useSetOpenNav();
  //const {invoiceNo} = useParams();
  const invoicesState = useAppSelector((state) => state.invoices);
  const invoices = invoicesState.invoices;
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const [getUser, { data, isSuccess }] = useGetUserMutation();
  const lastSegment = segments[segments.length - 2];
  const [getInvoices, { isLoading, error }] = useGetInvoicesMutation();
  const [getBatchs, { }] = useGetBatchsMutation();
  const [invoiceMode, setInvoiceMode] = useState(false);
  const [updateAssociate] = useUpdateAssociateMutation();
  const [selectedAssociateId, setSelectedAssociateId] = useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(0);
  const [showReportButton, setShowReportButton] = useState<boolean>(true);
  const [reportButtonText, setReportButtonText] = useState<string>("Please Complete your invoice to get the Report");

  const [assigned, setAssigned] = useState(false);
  const dispatch = useAppDispatch();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const handleShowAssignModal = () => {
    setShowAssignModal(true);
    setAssigned(true);
  };
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [addInvoicesToBatch] = useAddInvoicesToBatchMutation();

  const handleInvoiceSelectionChange = (selectedIds: number[]) => {
    setSelectedInvoiceIds(selectedIds);
  };
  const handleSubmit = async () => {
    if (
      (!selectedAssociateId || !selectedVehicleId) &&
      location.pathname.includes("deliveries")
    ) {
      alert("Please select both an associate and a vehicle.");
      return;
    }

    try {
      await updateAssociate({
        id: batch?.id || 0, // Assuming this is the batch ID you want to update
        user_id: selectedAssociateId,
        vehicle_id: selectedVehicleId,
      }).unwrap();

      // Optionally, refresh the data or give user feedback here
      const response = await getBatchs({ page: page, keyword: "" }).unwrap();
      setBatchs(response?.data);
      refetchBatch();
      setShowAssignModal(false);
      alert("Associate updated successfully");
    } catch (error: any) {
      console.error("Failed to update associate:", error);
      alert(error?.data?.message);
    }
  };
  useEffect(() => {
    setBatch(batchDetails as BatchDetails);

    if (batchDetails) {
      batchDetails?.invoices?.map((v) => {
        if (v.status == "3" || v.status == "4") {
          if (!location?.pathname?.includes("/collection") && (batchDetails.batch_type == "2" && v.amount_due > 0)) {
            setShowReportButton(false);
            setReportButtonText("All invoices are not fully paid");
          }
        } else {
          setShowReportButton(false);
          if (batchDetails.batch_type == "2") {
            setReportButtonText("All invoices are not fully paid");
          }
        }
      });
      const paymentsArray = batchDetails.invoices.flatMap((invoicee) =>
        invoicee?.payments?.map((paymentt) => {
          return {
            ...paymentt,
            invoice_number: invoicee.invoice_number,
          }
        })
      );
      if (!paymentsArray.length && batchDetails.batch_type == "2") {
        setShowReportButton(false);
        setReportButtonText("All invoices are not fully paid");
      }
    }
  }, [batchDetails]);
  useEffect(() => {
    console.log('src\pages\dashboard\batchs\details\index.tsx');
    getUser();
  }, []);

  const handleSave = async () => {
    if (!selectedInvoiceIds.length) return;
    try {
      await addInvoicesToBatch({
        id: batch?.id || 0,
        invoices: selectedInvoiceIds,
      }).unwrap();
      refetchBatch();
      setInvoiceMode(false);
      // Handle success here
    } catch (error) {
      // Handle error here
    }
  };
  const handleCloseAssignModal = () => setShowAssignModal(false);

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
      getInvoices({
        keyword: "",
        status: location.pathname.includes("collections") ? 3 : 1,
      });
    }
  }, [invoiceMode]);
  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  useEffect(() => {
    //setCheckedData(invoices.filter(v => v.checked === true))
    getInvoices({
      keyword: debouncedSearchTerm,
      page: 1,
      status: location.pathname.includes("collections") ? 3 : 1,
    });
  }, [debouncedSearchTerm]);
  const [stateDataSorting, setStateDataSorting] = useState({ sortBy: "invoice_number", isAsc: true });
  const getinvoicesSortBy = (stateData: { sortBy: string, isAsc: boolean }) => {
    console.log(stateData)
    dispatch(clearState());
    setStateDataSorting(stateData)
    getInvoices({
      sort_by: stateData.sortBy,
      sort_order: stateData.isAsc ? "ASC" : 'DESC'
    });
  }
  useEffect(() => {
    console.log(invoicesState.lastPageReached, invoicesState.page);
    if (!invoicesState.lastPageReached && loadMoreTrigger)
      getInvoices({
        status: location.pathname.includes("collections") ? 3 : 1, page: invoicesState.page + 1, keyword: searchTxt, sort_by: stateDataSorting.sortBy,
        sort_order: stateDataSorting.isAsc ? "ASC" : 'DESC'
      });
  }, [loadMoreTrigger]);

  useEffect(() => {
    setBatch(batchDetails);
  }, [batchDetails]);
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
  return (
    <div className="batch-details-component">
      <div className="nav-header">
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
              <li className={`navbar-link`}>
                <LeftArrow
                  onClick={() => {
                    setInvoiceMode(false);
                  }}
                />
                <span className="nav-name align-middle p-2">
                  {tab.name} <span className="nav-value">{tab.value}</span>
                </span>
              </li>
            </NavLink>
          ))}
        </div>
        <div className="right-bar">
          {!invoiceMode && (
            <span className="d-flex flex-row mx-2">
              <div className="desktop-only">
                <div className="search-bar-input mx-3">
                  <BurgerSvg
                    className="burger"
                    onClick={() => setOpenNav(true)}
                  />
                  <img
                    src={"/assets/Icon/Search.svg"}
                    className={"search-icon"}
                    alt="Search Icon"
                  />
                  <input
                    value={searchTextIn}
                    onChange={(e) => setSearchTExtIn(e.target.value)}
                    type="search"
                    className="search-bar-text"
                    placeholder="Search by Name or Invoice Number"
                  />
                </div>
              </div>
              {
                batch?.status == "3" ? null : !batch?.associate?.name ? (
                  <button
                    className="create-batch report-button"
                    onClick={() => handleShowAssignModal()}
                  >
                    <span>Assign</span>
                  </button>
                ) : (
                  <button
                    className="create-batch report-button"
                    style={{
                      border: '1px solid #D0D5DD',
                      backgroundColor: '#FFFFFF',
                      color: '#1D2939'
                    }}
                    onClick={() => handleShowAssignModal()}
                  >
                    <span>Reassign</span>
                  </button>
                )
              }
              {
                showReportButton && batch?.associate?.name ? (
                  <button
                    className={`btn btn-secondary ms-2 px-4 create-batch report-button ${batch?.status == "3" ? 'report-button-full' : ''}`}
                    onClick={() => {
                      if (location?.pathname?.includes("collections")) {
                        navigate(
                          "/dashboard/batches/collections/report/" +
                          params?.batchNo +
                          "/" +
                          params?.id
                        );
                      } else {
                        navigate(
                          "/dashboard/batches/report/" +
                          params?.batchNo +
                          "/" +
                          params?.id
                        );
                      }
                    }}
                  >
                    <span
                      className=""
                    >
                      Report
                    </span>
                  </button>
                ) :
                  (
                    <OverlayTrigger trigger={'focus'} placement="top" overlay={(props) => (
                      <Tooltip {...props} >
                        {reportButtonText}
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
          {invoiceMode && (
            <span className="d-flex flex-row mx-2">
              <div className="desktop-only">
                <div className="search-bar-input mx-3">
                  <BurgerSvg
                    className="burger"
                    onClick={() => setOpenNav(true)}
                  />
                  <img
                    src={"/assets/Icon/Search.svg"}
                    className={"search-icon"}
                    alt="Search Icon"
                  />
                  <input
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    type="search"
                    className="search-bar-text"
                    placeholder="Search by Name or Invoice Number"
                  />
                </div>
              </div>
              <button
                className="create-batch  me-2 px-4 bg-light text-dark assign-button"
                style={{ border: "1px solid #D0D5DD" }}
                onClick={() => setInvoiceMode(false)}
              >
                <span>Cancel</span>
              </button>
              <button
                className="report-button create-batch "
                onClick={handleSave}
              >
                <span>Save</span>
              </button>
            </span>
          )}
        </div>
      </div>
      {!invoiceMode && (
        <>
          <div
            className="mx-4 mt-3 mb-2 desktop-only"
            style={{
              backgroundColor: backgroundColorWithOpacity,
              border: `1px solid ${borderColorWithOpacity}`,
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-row">
                <span className="d-flex align-items-center justify-content-end">
                  <PersonCircle className="me-2" />
                  <div className="d-flex flex-column p-1">
                    <div className="p-0 batch-label">Associate</div>
                    {batch?.associate?.name && (
                      <div className="p-0 text-nowrap assigned-at batch-value">
                        {batch?.associate?.name}
                      </div>
                    )}
                    {!batch?.associate?.name && (
                      <div className="batch-value">---</div>
                    )}
                  </div>
                </span>
                <span
                  style={{
                    width: "1px",
                    height: "23px",
                    backgroundColor: dividerColor,
                    marginLeft: "15px",
                    marginRight: "15px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
                <span className="d-flex align-items-center justify-content-end">
                  <PersonCircle className="me-2" />
                  <div>
                    <div className="p-0 batch-label">Assigned By</div>
                    {batch?.associate?.name && (
                      <div className="batch-value">{data?.name}</div>
                    )}
                    {!batch?.associate?.name && (
                      <div className="batch-value">---</div>
                    )}
                  </div>
                </span>
              </div>
              <div>
                <div className="d-flex flex-row">
                  {
                    batch?.status != "3" ? (
                      <button
                        className="mx-2 create-batch "
                        onClick={() => {
                          setInvoiceMode(true);
                        }}
                      >
                        <span>Add Invoice</span>
                      </button>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 mb-2 mobile-only batch-profile">
            <div className="d-flex flex-column align-items-center justify-content-between">
              <div className="d-flex flex-row justify-content-between batch-title">
                <span className="d-flex align-items-center justify-content-end">
                  <PersonCircle className="me-2" />
                  <div>
                    <div className="batch-label">Associate</div>
                    <div className="batch-value">
                      {batch?.associate?.name || "---"}
                    </div>
                  </div>
                </span>
                <span
                  style={{
                    width: "1px",
                    height: "23px",
                    backgroundColor: dividerColor,
                    marginLeft: "15px",
                    marginRight: "15px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
                <span className="d-flex align-items-center">
                  <PersonCircle className="me-2" />
                  <span>
                    <div className="batch-label">Assigned By</div>
                    {batch?.associate?.name && (
                      <div className="batch-value">{data?.name}</div>
                    )}
                    {!batch?.associate?.name && (
                      <div className="batch-value">---</div>
                    )}
                  </span>
                </span>
              </div>
              <div className="batch-sub-title">
                <div className="d-flex flex-row gap-2">
                  <div className="input-row">
                    <InputGroup className="input-group">
                      <Button variant="button-white" id="button-addon1">
                        <Search />
                      </Button>
                      <FormControl
                        style={{ border: "0", borderRadius: "8px" }}
                        placeholder="Search Invoice Number"
                        value={searchTextIn}
                        type="search"
                        onChange={(e) => setSearchTExtIn(e.target.value)}
                      />
                    </InputGroup>
                  </div>

                  {
                    batch?.status != "3" ? (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setInvoiceMode(true);
                        }}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Add Invoice
                      </button>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="invoices-list-content">
        <div className="left-container">
          <div className="payments-section">
            {!invoiceMode && batch && (
              <BatchDetailsTable
                batchs={batch}
                isCollection={location.pathname.includes("collections")}
                showCheckbox={false}
                loading={isLoading}
                // loadMoreBatchs={() => setLoadMoreTrigger((i) => !i)}
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
                          (batchInvoice) =>
                            batchInvoice?.invoice_number ===
                            invoice?.invoice_number
                        )
                    )}
                  checkedData={checkedData}
                  setInvoices={(i) => dispatch(setInvoices(i))}
                  showCheckbox={true}
                  loading={isLoading}
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
                  getinvoicesSortBy={getinvoicesSortBy}
                />
              </>
            )}
            {/* {invoiceMode && location.pathname.includes("collections") &&
              <Collections invoiceMode={true}/>
            } */}
            <Modal
              show={showAssignModal}
              style={{ borderRadius: 12 }}
              onHide={handleCloseAssignModal}
              centered
            >
              <Modal.Header closeButton style={{ margin: 16, padding: 0 }}>
                <Modal.Title
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1D2939",
                  }}
                >
                  Assign
                </Modal.Title>
              </Modal.Header>
              <hr
                style={{
                  height: "1px",
                  margin: "0px 16px",
                  borderColor: "#EAECF0",
                  opacity: "1",
                }}
              />
              <Modal.Body style={{ paddingTop: "20px" }}>
                <Form>
                  <Form.Group className="mb-3" controlId="assignAssociate">
                    <Form.Label
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#210D4A",
                      }}
                    >
                      Associate
                    </Form.Label>
                    <Form.Control
                      className={"form-select"}
                      as="select"
                      defaultValue="Choose Assosiate"
                      style={{
                        color: "#667085",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                      onChange={(e) =>
                        setSelectedAssociateId(Number(e.target.value))
                      }
                    >
                      {/* Dynamically load options here */}
                      <option value="" selected hidden>
                        Associate
                      </option>
                      {batch?.associate?.name && <option
                        key={0}
                        value={0}
                        className="d-flex justify-content-between"
                        style={{
                          backgroundColor: "#F5F6F7",
                          color: "#33AAFF",
                        }}
                      >
                        Unassigned
                      </option>}
                      {AssosiateData?.associates?.map((associate, index) => (
                        <option
                          key={associate.id}
                          value={associate.id}
                          className="d-flex justify-content-between"
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#F5F6F7" : "white",
                            color: "#33AAFF",
                          }}
                        >
                          <span
                            className="option-highlighted"
                            style={{ backgroundColor: "red" }}
                          >
                            {associate.name}
                            {"  -  +"}
                          </span>
                          <span className="option-phone">
                            {associate.phone ?? ""}
                          </span>
                        </option>
                      ))}
                      {/* ... other options ... */}
                    </Form.Control>
                  </Form.Group>
                  {!location.pathname.includes("collections") && (
                    <Form.Group className="mb-3" controlId="assignVehicle">
                      <Form.Label
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#210D4A",
                        }}
                      >
                        Vehicle
                      </Form.Label>
                      <Form.Control
                        className={"form-select"}
                        as="select"
                        defaultValue="Choose Vehicle"
                        style={{
                          color: "#667085",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                        aria-label="Select Vehicle"
                        onChange={(e) =>
                          setSelectedVehicleId(Number(e.target.value))
                        }
                      >
                        {/* Dynamically load options here */}
                        <option selected hidden>
                          Vehicles
                        </option>
                        {AssosiateData?.vehicles?.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle?.type?.name}
                            {"  -  "}
                            <span className="vehicle-option-gap"></span>{" "}
                            {/* Add the gap element */}
                            License Plate: {vehicle.id}
                          </option>
                        ))}

                        {/* ... other options ... */}
                      </Form.Control>
                    </Form.Group>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer style={{ borderTop: 0, paddingTop: 0 }}>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
