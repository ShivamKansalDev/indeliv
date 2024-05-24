import "../batchs/details/batch-detail.scss";
import "./delivery_report.scss";
import "../../dashboard/batchs/details/components/batchDetailsTable/batch-details-table.scss";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import { useGetAssociatesQuery, useGetBatchDetailByIdQuery, useGetBatchsMutation } from '@/state/slices/batchs/batchsApiSlice';
import React, { useContext, useEffect, useState, } from "react";
import { useSetOpenNav } from "@pages/dashboard"
import { Accordion, Button, Modal, Table } from 'react-bootstrap';
import { ReactComponent as LeftArrow } from "../../../assets/svgs/arrow-left.svg";
import { ReactComponent as PersonCircle } from "@/assets/svgs/Profile-circle.svg";
import Batch from "@/types/Batch";
import { numberWithCommas } from "@/utils/helper";
import { ReactComponent as User } from '@/assets/svgs/user.svg';
import { BatchStatus } from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchUtils";
import { ReactComponent as Image } from "../../../assets/svgs/image.svg";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { initialData } from "@pages/dashboard/invoices/(invoicesList)/collections";
import BatchDetails from "@/types/BatchDetails";
import { useVerifyPaymentMutation } from "@/state/slices/payments/paymentsApiSlice";
import { boolean } from "yup";
import { useGetUserMutation } from "@/state/slices/authApiSlice";
import { LoginUserContext } from "@/App";
interface anyObg {
  [key: string]: any;
}
export default function DeliveryReports() {
  // const { data: AssosiateData, isLoading: isAssosiateLoading, isError: isAssosiateError } = useGetAssociatesQuery();
  const params = useParams();
  const [batch, setBatch] = useState<BatchDetails>();
  // const [allPayments, setAllPayments] = useState<any>([]);
  const [paymentVerified, setPaymentVerified] = useState<boolean>(false);
  const [tabs, setTabs] = useState<any>([]);
  const { data: batchDetails, refetch: refetchBatch } = useGetBatchDetailByIdQuery(params?.batchNo, {
    // skip: isNaN(batchId), // Skip the query if batchId is NaN
  });
  // const [getUser, { data: userData, isSuccess }] = useGetUserMutation();
  const context = useContext(LoginUserContext)
  const [getBatchs, { }] = useGetBatchsMutation();
  const [searchTxt, setSearchTxt] = useState("");
  const { setOpenNav } = useSetOpenNav();
  const location = useLocation();
  const pathname = location.pathname;
  const [invoiceMode, setInvoiceMode] = useState(true);
  const [assigned, setAssigned] = useState(false);
  const [cashDone, setCashDone] = useState(false);
  const [onlineDone, setOnlineDone] = useState(false);
  const [chequeDone, setChequeDone] = useState(false);
  const [creditDone, setCreditDone] = useState(false);
  const [returnDone, setReturnDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refetchBatch()
  }, [pathname])

  const toggleStatus = (method: string) => {
    switch (method) {
      case 'cash':
        setCashDone(!cashDone);
        break;
      case 'online':
        setOnlineDone(!onlineDone);
        break;
      case 'cheque':
        setChequeDone(!chequeDone);
        break;
      case 'credit':
        setCreditDone(!creditDone);
        break;
      case 'return':
        setReturnDone(!returnDone);
        break;
      default:
      // Handle unknown method
    }
  };
  // useEffect(() => {
  //   if (batchDetails) {
  //     batchDetails?.invoices?.map((v: any) => {
  //       if (v.status == "3" || v.status == "4") {
  //       } else {
  //         navigate("/dashboard")
  //         // setShowReportButton(false);
  //       }
  //     });
  //   }
  // }, [batchDetails])
  interface PaymentMethodProps {
    method: string;
    amount: string;
    count: number;
    completed: boolean;
  }

  const [totalAmountInBatch, settotalAmountInBatch] = useState<any>("");
  const [allPayments, setAllPayments] = useState<any>({ cash: [], online: [], cheque: [], credit: [], returns: [], cashTotal: 0, onlineTotal: 0, chequeTotal: 0, creditTotal: 0, returnTotal: 0 });


  useEffect(() => {
    setBatch(batchDetails);

    if (batchDetails) {
      // Use flatMap to flatten the payments arrays from all invoices into a single array
      const paymentsArray1 = batchDetails.invoices.flatMap((invoice: any) => {

        return (invoice?.payments || []).map((payment: any) => {
          const isVerified = payment?.is_verified || false;
          setPaymentVerified(isVerified);
          return {
            ...payment,
            invoice_number: invoice.invoice_number,
          };
        });
      });

      const paymentsArray = batchDetails?.payments?.map((invoice: any) => {
        const isVerified = invoice?.is_verified || false;
        setPaymentVerified(isVerified);
        let data = batchDetails?.invoices?.find((x: any) => x.id == invoice.invoice_id);
        return {
          ...invoice,
          invoice_number: data?.invoice_number,
        };
      });
      const returnsArray = batchDetails.invoices.flatMap((invoice: any) => {
        return (invoice?.returns || []).map((returnItem: any) => {
          const isVerified = returnItem?.is_verified || false;

          return {
            ...returnItem,
            invoice_number: invoice.invoice_number,
          };
        });
      });
      // setAllPayments(paymentsArray);

      const cashPayments = paymentsArray?.filter((v: any) => v.method === "Cash");
      const onlinePayments = paymentsArray?.filter((v: any) => v.method === "Online");
      const chequePayments = paymentsArray?.filter((v: any) => v.method === "Cheque");
      const creditPayments = paymentsArray?.filter((v: any) => v.method === "Credit");
      const creditData = batchDetails?.invoices?.filter((v: any) => v.amount_due > 0);
      const creditFinal = creditData?.map((x: any, i: number) => {
        let creditImage = creditPayments?.find((credit: any) => credit?.invoice_id == x.id)
        return {
          ...x,
          credit_image: creditImage?.image_path ? creditImage?.image_path : ""
        }
      })

      // const creditPayments = paymentsArray?.filter((v) => v.method === "Credit");
      // const creditPayments = batchDetails?.invoices?.filter((v: any) => v.amount_due > 0);
      // const creditPayments2 = creditPayments?.map((x: any, i: number) => {
      //   let data = x.payments?.find((credit: any) => credit?.method == "Credit");
      //   return {
      //     ...x,
      //     credit_image: data?.image_path ? data?.image_path : ""
      //   }
      // });

      const cashVerified = cashPayments?.length && cashPayments?.every((payment) => payment.is_verified);
      const onlineVerified = onlinePayments?.length && onlinePayments?.every((payment) => payment.is_verified);
      const chequeVerified = chequePayments?.length && chequePayments?.every((payment) => payment.is_verified);
      const creditVerified = creditPayments?.length && creditPayments?.every((payment) => payment.is_verified);
      const returnVerified = returnsArray?.length && returnsArray.every((payment) => payment.is_verified);

      // Calculating totals for different payment methods
      const cashTotal = cashPayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const onlineTotal = onlinePayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const chequeTotal = chequePayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const creditTotal = creditFinal?.reduce((total, payment) => total + parseFloat(payment?.amount_due), 0);
      const returnTotal = returnsArray?.reduce((total, payment) => total + (Number(payment?.quantity) * Number(payment?.unit_price)), 0);
      // console.log(returnsArray, "jjghg")
      // Set state with additional cashVerified attribute
      setAllPayments({
        cash: cashPayments,
        online: onlinePayments,
        cheque: chequePayments,
        // credit: creditPayments2,
        credit: creditFinal,
        // credit: batchDetails?.invoices,
        returns: returnsArray,

        cashTotal,
        onlineTotal,
        chequeTotal,
        creditTotal,
        returnTotal,

        cashVerified,
        onlineVerified,
        chequeVerified,
        creditVerified,
        returnVerified
      });

      settotalAmountInBatch(paymentsArray?.reduce((total: any, payment: any) => total + parseFloat(payment?.amount), 0))
    }

  }, [batchDetails]);
  // useEffect(() => {

  //   settotalAmountInBatch(batch?.invoices?.reduce((total, invoice,i) => total + parseInt(invoice?.payments?.length ? invoice?.payments?.[i]?.amount : 0), 0));
  // },[batch]);
  // useEffect(() => {
  //     getUser();
  // }, [])


  useEffect(() => {
    setTabs([{
      name: invoiceMode ? "Report" : "Report ",
      value: batch?.associate?.name + " (" + batch?.batch_number + ") for " + `₹ ${numberWithCommas(totalAmountInBatch?.toString())}`,
      valueTitle: "Batch",
      valueSubTitle: `Assigned By: ${batch?.assignee?.name}`,
      icon: (active: boolean) => {
        return '/assets/Icon/left-arrow.svg';
      },
      link: pathname.includes("collection") ? `/dashboard/collection/associates` : `/dashboard/delivery/associates`,
    }]);
  }, [totalAmountInBatch]);


  // @ts-ignore


  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleToggle = (selectedKey: string | null) => {
    setActiveKey(activeKey === selectedKey ? null : selectedKey);
  };

  const dividerStyle = {
    height: '100%', width: '1px', backgroundColor: '#000', color: "#000", marginLeft: '10px', marginRight: '10px',
  };

  const [showAssignModal, setShowAssignModal] = useState(false); // Assuming you're using a modal for assigning
  // Function to handle the assignment modal show state
  const handleShowAssignModal = () => {
    setShowAssignModal(true);
  };

  const [VerifyPayment, { isLoading }] = useVerifyPaymentMutation();

  const [imageView, setImageView] = useState<string>("")
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const viewImage = (image: any, name: any) => {
    setImageView(`${image}`)
    handleShow()
  }
  return (
    <>
      {
        batchDetails?.id ?
          <>
            <div className="batch-details-component report-component">

              <div className="desktop-only">
                <div className="nav-header">
                  <div
                    onClick={() => setSearchTxt("")}
                    className="d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12">
                    {tabs.map((tab: any, index: number) => (
                      <NavLink
                        to={tab.link}
                        key={index}
                        className={"text-decoration-none nav-link-cont"}
                      >
                        <li className={`navbar-link d-flex `}>
                          <span style={{ alignSelf: "center" }}>
                            <LeftArrow
                              onClick={() => {
                                setInvoiceMode(false);
                              }}
                            />
                          </span>
                          <span className="nav-name align-middle py-2 ps-2">
                            {tab.name} <span className="nav-value">{batch?.batch_number}</span>
                          </span>
                          <span className="d-none d-md-block" style={{
                            borderRight: "1px solid #D0D5DD",
                            padding: "0px",
                            height: "23px",
                            display: "inline-block",
                            alignSelf: "center",
                            marginLeft: "32px",
                          }}></span>
                          <span className="d-flex align-items-center justify-content-end" style={{}}>
                            <div className="d-none d-md-block" style={{ paddingLeft: "32px" }}>
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
                  </div>
                  <div className="right-bar">

                    {!invoiceMode && <span className="d-flex flex-row mx-2">
                      <div className="search-bar-input mx-3">
                        <BurgerSvg
                          className="burger"
                          onClick={() => setOpenNav(true)} />
                        <img
                          src={'/assets/Icon/Search.svg'}
                          className={'search-icon'}
                          alt="Search Icon" />
                        <input
                          value={searchTxt}
                          onChange={(e) => setSearchTxt(e.target.value)}
                          type="search"
                          className="search-bar-text"
                          placeholder="Search by Name or Invoice Number" />
                      </div>
                      {!assigned && <button className="create-batch assign-button" onClick={() => handleShowAssignModal()}>
                        <span>Assign</span>
                      </button>}
                      {assigned && <button className="create-batch  me-2 px-4 bg-light text-dark assign-button"
                        onClick={() => handleShowAssignModal()}>
                        <span>Reassign</span>
                      </button>}
                      <button className="btn btn-secondary ms-2 px-4 create-batch report-button">
                        <span className="">Report</span>
                      </button>
                    </span>}
                  </div>
                </div>

              </div>
              <div className="mobile-only">
                <div className="nav-header pb-0" style={{paddingTop:"6px"}}>
                  <div
                    onClick={() => setSearchTxt("")}
                    className="text-12">
                    {tabs.map((tab: any, index: number) => (
                      <div key={index}>
                        <div className="row report-nav-row pt-0" >
                          <NavLink
                            to={tab.link}
                            key={index}
                            className={"text-decoration-none nav-link-cont"}>
                            <li className={`navbar-link`}>
                              <LeftArrow onClick={() => {
                                setInvoiceMode(false);
                              }} />
                              <span className="report-nav-name align-middle">
                                {tab.name}
                              </span>
                            </li>
                          </NavLink>
                        </div>
                        <div className="row report-nav-row pb-0">
                          <div className="col-auto align-self-center">
                            <img src={batch?.assignee?.image_path} alt="" className="img-fluid mobile-user-report" />
                          </div>
                          <div className="col-8">
                            <div className="row report-nav-value">
                              <span className="col-auto p-0">{tab.valueTitle}</span>
                              <span className="col p-0 ps-1" style={{ color: "#0080FC" }}>{batch?.batch_number}</span>
                            </div>
                            <div className="row report-nav-value">{tab.valueSubTitle}</div>
                          </div>

                        </div>
                      </div>))}
                  </div>
                </div>

              </div>

              <div className="invoices-list-content">
                <div className="batchs-list-content">
                  <div className="payment-list-container">
                    <Accordion
                      activeKey={activeKey} // This state controls the active accordion item
                      onSelect={(eventKey) => handleToggle("0")}
                      className={`mb-3 ${allPayments?.cashVerified ? "invoice-completed" : "invoice-pending"}`}
                      defaultActiveKey={['0']}
                    >
                      <Accordion.Item eventKey="0">

                        <Accordion.Header>
                          <div className="d-flex flex-row justify-content-between report-cash-label">
                            <span className="justify-content-start">
                              <span className="report_accordian_name">Cash</span>
                              <span className={`${allPayments?.cashVerified ? 'report-cash-value-associate' : 'report-cash-value-associate-pending'}`}>
                                <span style={{ fontWeight: "100" }}>₹</span><span>{numberWithCommas(allPayments?.cashTotal?.toString() || '0')}</span>
                                <span
                                  className="report-cash-value-total m-0 p-0 ps-1">({allPayments?.cash.length || '0'})
                                </span>
                              </span>

                            </span>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="overflow-hidden">
                          <div >
                            <div className="payment-method-info">
                              <Table hover className="table">
                                <thead className="report-header">
                                  <tr>
                                    {/* <th>#</th> */}
                                    <th>Invoice No.</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allPayments?.cash?.map((invoice: any, index: number) => (
                                    <tr key={index} className={`${allPayments?.cash?.length - 1 == index ? "no-border-bottom" : ""}`}>
                                      {/* <td className={`numeric-value`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                                      <td>{invoice?.invoice_number}</td>
                                      <td
                                        className={`table-cash`}>₹{`${numberWithCommas(invoice?.amount)}`}</td>
                                    </tr>))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>


                  </div>
                  <div className="payment-list-container">
                    <Accordion
                      className={`mb-3 ${allPayments?.onlineVerified ? "invoice-completed" : "invoice-pending"}`}
                      activeKey={activeKey} // This state controls the active accordion item
                      onSelect={(eventKey) => handleToggle("1")}
                    >
                      <Accordion.Item eventKey="1">

                        <Accordion.Header>
                          <div className="d-flex flex-row justify-content-between report-cash-label">
                            <span className="justify-content-start">
                              <span className="report_accordian_name">Online</span>
                              <span className={`${allPayments?.onlineVerified ? 'report-cash-value-associate' : 'report-cash-value-associate-pending'}`}>
                                <span style={{ fontWeight: "100" }}>₹</span>{`${numberWithCommas(allPayments?.onlineTotal?.toString() || '0')}`}
                                <span
                                  className="report-cash-value-total m-0 ps-1 p-0">({allPayments?.online?.length || '0'})
                                </span>
                              </span>

                            </span>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="overflow-hidden">
                          <div
                          >
                            <div className="payment-method-info">
                              <Table hover className="table">
                                <thead className="report-header">
                                  <tr>
                                    {/* <th>#</th> */}
                                    <th>Invoice No.</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allPayments?.online?.map((invoice: any, index: any) => (
                                    <tr key={index} className={index === allPayments?.online?.length - 1 ? 'no-border-bottom' : ''}>
                                      {/* <td className={`numeric-value ${index === allPayments?.online?.length - 1 ? 'border-l-8' : ''}`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                                      <td
                                        className={`align-middle `}>{invoice?.invoice_number}</td>
                                      <td
                                        className={`align-middle table-cash `}>{`₹${numberWithCommas(invoice?.amount)}`}</td>
                                    </tr>))}
                                </tbody>
                              </Table>
                            </div>
                          </div>

                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>


                  </div>
                  <div className="payment-list-container">
                    <Accordion
                      className={`mb-3 ${allPayments?.chequeVerified ? "invoice-completed" : "invoice-pending"}`}
                      activeKey={activeKey} // This state controls the active accordion item
                      onSelect={(eventKey) => handleToggle("2")}
                    >
                      <Accordion.Item eventKey="2">

                        <Accordion.Header>
                          <div className="d-flex flex-row justify-content-between report-cash-label">
                            <span className="justify-content-start">
                              <span className="report_accordian_name">Cheque</span>
                              <span className={`${allPayments?.chequeVerified ? 'report-cash-value-associate' : 'report-cash-value-associate-pending'}`}>
                                <span style={{ fontWeight: "100" }}>₹</span>{`${numberWithCommas(allPayments?.chequeTotal?.toString() || '0')}`}
                                <span
                                  className="report-cash-value-total ps-1 m-0 p-0">({allPayments?.cheque?.length || '0'})
                                </span>
                              </span>
                            </span>

                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="overflow-hidden">
                          <div>
                            <div className="payment-method-info">
                              <Table hover className="table">
                                <thead className="report-header">
                                  <tr>
                                    {/* <th>Payments</th> */}
                                    <th>Invoice No.</th>
                                    <th>Amount</th>
                                    <th>Image</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allPayments?.cheque?.map((invoice: any, index: any) => (
                                    <tr key={index} className={`align-middle ${index === allPayments?.cheque?.length - 1 ? 'no-border-bottom' : ''}`}>
                                      {/* <td className={`numeric-value ${index === allPayments?.cheque?.length - 1 ? 'border-l-8' : ''}`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                                      <td
                                        className={`align-middle `}>{invoice?.invoice_number}</td>
                                      <td
                                        className={`align-middle table-cash `}>{`₹${numberWithCommas(invoice?.amount)}`}</td>
                                      <td className={`align-middle `}>
                                        {
                                          invoice?.image ?
                                            <img
                                              // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/cheques/${invoice?.image}`}
                                              src={invoice?.image_path}
                                              alt="image"
                                              className="img-fluid"
                                              height={50}
                                              width={50}
                                              onClick={() => viewImage(invoice?.image_path, "cheques")}
                                              style={{ cursor: "pointer" }}
                                            />
                                            :
                                            <Image />
                                        }
                                      </td>
                                    </tr>))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>


                  </div>

                  <div className="payment-list-container">
                    <Accordion
                      className={`mb-3 ${allPayments?.creditVerified ? "invoice-completed" : "invoice-pending"}`}
                      activeKey={activeKey} // This state controls the active accordion item
                      onSelect={(eventKey) => handleToggle("3")}
                    >
                      <Accordion.Item eventKey="3">

                        <Accordion.Header>
                          <div className="d-flex flex-row justify-content-between report-cash-label">
                            <span className="justify-content-start">
                              <span className="report_accordian_name">Credit</span>
                              <span className={`${allPayments?.creditVerified ? 'report-cash-value-associate' : 'report-cash-value-associate-pending'}`}>
                                <span style={{ fontWeight: "100" }}>₹</span>{`${numberWithCommas(allPayments?.creditTotal?.toString() || '0')}`}
                                <span
                                  className="report-cash-value-total ps-1 m-0 p-0">({allPayments?.credit?.length || '0'})
                                </span>
                              </span>
                            </span>


                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="overflow-hidden">
                          <div>
                            <div className="payment-method-info">
                              <Table hover className="table image-table">
                                <thead className="report-header">
                                  <tr>
                                    {/* <th>#</th> */}
                                    <th>Invoice No.</th>
                                    <th>Amount</th>
                                    <th>View Image</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allPayments?.credit?.map((invoice: any, index: any) => (
                                    <tr key={index} className={`align-middle ${index === allPayments?.credit?.length - 1 ? 'no-border-bottom' : ''}`}>
                                      {/* <td className={`numeric-value ${index === allPayments?.credit?.length - 1 ? 'border-l-8' : ''}`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                                      <td
                                        className={`align-middle ${index === allPayments?.credit?.length - 1 ? 'border-c-8' : ''}`}>{invoice?.invoice_number}</td>
                                      <td
                                        className={`align-middle table-cash ${index === allPayments?.credit?.length - 1 ? 'border-r-8' : ''}`}>{`₹${numberWithCommas(invoice?.amount_due)}`}</td>
                                      <td className={`align-middle ${index === allPayments?.credit?.length - 1 ? 'border-r-8' : ''}`}>
                                        {
                                          invoice?.credit_image ?
                                            <img
                                              // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/returns/${invoice?.image}`}
                                              src={invoice?.credit_image}
                                              alt="image"
                                              className="img-fluid"
                                              height={50}
                                              width={50}
                                              onClick={() => viewImage(invoice?.credit_image, "credit")}
                                              style={{ cursor: "pointer" }}
                                            />
                                            :
                                            <Image />
                                        }
                                      </td>
                                    </tr>))}
                                </tbody>
                              </Table>
                            </div>
                          </div>

                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>


                  </div>
                  {
                    !pathname?.includes("/collection") && <>
                      <div className="payment-list-container">
                        <Accordion
                          className={`mb-3 ${allPayments?.returnVerified ? 'invoice-completed' : 'invoice-pending'}`}
                          activeKey={activeKey} // This state controls the active accordion item
                          onSelect={(eventKey) => handleToggle("4")}
                        >

                          <Accordion.Item eventKey="4">

                            <Accordion.Header>
                              <div className="d-flex flex-row justify-content-between report-cash-label">
                                <span className="justify-content-start">
                                  <span className="report_accordian_name">Product Return</span>
                                  <span className={`${allPayments?.returnVerified ? 'report-cash-value-associate' : 'report-cash-value-associate-pending'}`}>
                                    <span style={{ fontWeight: "100" }}>₹</span>{`${numberWithCommas(allPayments?.returnTotal?.toString() || '0')}`}
                                    <span
                                      className="report-cash-value-total ps-1 m-0 p-0">({allPayments?.returns?.length || '0'})
                                    </span>
                                  </span>

                                </span>

                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="overflow-hidden">
                              <div>
                                <div className="payment-method-info">
                                  <Table hover className="table image-table">
                                    <thead className="report-header">
                                      <tr>
                                        <th>Invoice No.</th>
                                        <th>Product Name</th>
                                        <th>Qty</th>
                                        {/* <th>Amount</th> */}
                                        <th>View Image</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {allPayments?.returns?.map((invoice: any, index: any) => (
                                        <tr key={index} className={`${index === allPayments?.returns?.length - 1 ? 'no-border-bottom' : ''} align-middle`}>
                                          <td
                                            style={{}}
                                            className={`product_td_width  align-middle`}>
                                            <div className="pe-2">
                                              {invoice.invoice_number}
                                            </div>
                                          </td>
                                          <td className={`product_td_width  align-middle`}>
                                            <div className="pe-2">
                                              {invoice?.item_name}
                                            </div>
                                          </td>
                                          <td className={`product_td_width_qty align-middle`}>
                                            <div className="pe-2">
                                              <span className="selectedItemReport d-flex justify-content-center p-2">
                                                {Number(invoice?.quantity).toFixed(0)}
                                              </span>
                                            </div>
                                          </td>
                                          {/* <td
                                            className={`table-cash align-middle`}>
                                            ₹{
                                              (() => {
                                                const quantity = Number(invoice?.quantity);
                                                const unitPrice = Number(invoice?.unit_price);

                                                // Ensure both quantity and unitPrice are valid numbers before performing the multiplication
                                                if (!isNaN(quantity) && !isNaN(unitPrice)) {
                                                  return (quantity * unitPrice).toFixed(2);
                                                } else {
                                                  return 0; // or some default value or error handling
                                                }
                                              })()
                                            }
                                          </td> */}
                                          <td className={`product_td_width  align-middle`}>
                                            <div className="text-center">
                                              {
                                                invoice?.image ?
                                                  <img
                                                    // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/returns/${invoice?.image}`}
                                                    src={invoice?.image_path}
                                                    alt="image"
                                                    className="img-fluid"
                                                    height={50}
                                                    width={50}
                                                    onClick={() => viewImage(invoice?.image_path, "returns")}
                                                    style={{ cursor: "pointer" }}
                                                  />
                                                  :
                                                  <Image />
                                              }
                                            </div>
                                          </td>
                                        </tr>))}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>

                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
            <Modal show={show} onHide={handleClose} size="lg" style={{ background: "#02020278", height: "100%" }}>
              <Modal.Header closeButton style={{ padding: "15px 20px" }}>
              </Modal.Header>
              <Modal.Body>
                <div className="d-flex justify-content-center align-content-center">

                  <img
                    // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/${imageView}`}
                    src={imageView}
                    alt="image"
                    className="img-fluid"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>

              </Modal.Body>
            </Modal>
          </> : <>
            <div style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
              <div>
                <Loading className="loadingCircle" />
              </div>
            </div>
          </>
      }
    </>

  );
}
