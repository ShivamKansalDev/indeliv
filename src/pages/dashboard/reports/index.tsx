import "../batchs/details/batch-detail.scss";
import "../../dashboard/batchs/details/components/batchDetailsTable/batch-details-table.scss";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { ReactComponent as BurgerSvg } from "@/assets/svgs/burger.svg";
import { useGetAssociatesQuery, useGetBatchDetailByIdQuery, useGetBatchsMutation } from '@/state/slices/batchs/batchsApiSlice';
import React, { useEffect, useState, } from "react";
import { useSetOpenNav } from "@pages/dashboard"
import { Accordion, Modal, Table } from 'react-bootstrap';
import { ReactComponent as LeftArrow } from "../../../assets/svgs/arrow-left.svg";
import Batch from "@/types/Batch";
import { numberWithCommas } from "@/utils/helper";
import { ReactComponent as User } from '@/assets/svgs/user.svg';
import { BatchStatus } from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchUtils";
import { ReactComponent as Image } from "../../../assets/svgs/image.svg";
import { initialData } from "@pages/dashboard/invoices/(invoicesList)/collections";
import BatchDetails from "@/types/BatchDetails";
import { useVerifyPaymentMutation } from "@/state/slices/payments/paymentsApiSlice";
import { boolean } from "yup";
import { useVerifyInvoiceReturnMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";

export default function Reports() {
  const { data: AssosiateData, isLoading: isAssosiateLoading, isError: isAssosiateError } = useGetAssociatesQuery();
  const params = useParams();
  const [batch, setBatch] = useState<BatchDetails>();
  const [allPayments, setAllPayments] = useState<any>({ cash: [], online: [], cheque: [], credit: [], returns: [], cashTotal: 0, onlineTotal: 0, chequeTotal: 0, creditTotal: 0, returnTotal: 0 });
  const [paymentVerified, setPaymentVerified] = useState<boolean>(false);
  const [tabs, setTabs] = useState<any>([]);
  const { data: batchDetails, refetch: refetchBatch } = useGetBatchDetailByIdQuery(params?.batchNo, {
    // skip: isNaN(batchId), // Skip the query if batchId is NaN
  });
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
  //loading data
  const [loadingData, setLoadingData] = useState('');

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

  interface PaymentMethodProps {
    method: string;
    amount: string;
    count: number;
    completed: boolean;
  }

  const [totalAmountInBatch, settotalAmountInBatch] = useState<any>("")

  useEffect(() => {
    setBatch(batchDetails);

    if (batchDetails) {
      // Use flatMap to flatten the payments arrays from all invoices into a single array
      const paymentsArray1 = batchDetails.invoices.flatMap((invoice: any) =>
        invoice?.payments?.map((payment: any) => {
          console.log(payment?.is_verified ? true : false)
          setPaymentVerified(payment?.is_verified ? true : false);
          return {
            ...payment,
            invoice_number: invoice.invoice_number,
          }
        })
      );
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
      // Filter cash payments and determine if all are verified
      const cashPayments = paymentsArray?.filter((v) => v.method === "Cash");
      const onlinePayments = paymentsArray?.filter((v) => v.method === "Online");
      const chequePayments = paymentsArray?.filter((v) => v.method === "Cheque");
      const creditPayments = paymentsArray?.filter((v: any) => v.method === "Credit");
      const creditData = batchDetails?.invoices?.filter((v: any) => v.amount_due > 0);
      const creditFinal = creditData?.map((x: any, i: number) => {
        let creditImage = creditPayments?.find((credit: any) => credit?.invoice_id == x.id)
        return {
          ...x,
          credit_image: creditImage?.image_path ? creditImage?.image_path : ""
        }
      })

      const cashVerified = cashPayments?.length && cashPayments?.every((payment) => payment.is_verified);
      const onlineVerified = onlinePayments?.length && onlinePayments?.every((payment) => payment.is_verified);
      const chequeVerified = chequePayments?.length && chequePayments?.every((payment) => payment.is_verified);
      const creditVerified = creditPayments?.length && creditPayments?.every((payment) => payment.is_verified);
      const returnVerified = returnsArray?.length && returnsArray?.every((returns) => returns.is_verified);

      // Calculating totals for different payment methods
      const cashTotal = cashPayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const onlineTotal = onlinePayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const chequeTotal = chequePayments?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);
      const creditTotal = creditFinal?.reduce((total, payment) => total + parseFloat(payment?.amount_due), 0);
      const returnTotal = returnsArray?.reduce((total, payment) => total + parseFloat(payment?.amount), 0);

      // Set state with additional cashVerified attribute
      setAllPayments({
        cash: cashPayments,
        online: onlinePayments,
        cheque: chequePayments,
        // credit: creditPayments2,
        credit: creditFinal,
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
  // console.log(allPayments)
  // useEffect(() => {

  //   settotalAmountInBatch(batch?.invoices?.reduce((total, invoice,i) => total + parseFloat(invoice?.payments?.length ? invoice?.payments?.[i]?.amount : 0), 0));
  // },[batch]);

  useEffect(() => {
    setTabs([{
      name: invoiceMode ? "Report" : "Report ",
      value: batch?.associate?.name + " (" + batch?.batch_number + ") for " + `₹ ${numberWithCommas(totalAmountInBatch?.toString())}`,
      valueTitle: batch?.associate?.name + " (" + batch?.batch_number + ") for ",
      valueSubTitle: `₹ ${numberWithCommas(totalAmountInBatch?.toString())}`,
      icon: (active: boolean) => {
        return '/assets/Icon/left-arrow.svg';
      },
      link: pathname.includes("collections") ? `/dashboard/batches/collections/${batch?.batch_number}/${batch?.id}` : `/dashboard/batch/${batch?.batch_number}/${batch?.id}`,
    }]);
  }, [totalAmountInBatch]);


  // @ts-ignore

  //console.log(tabs,batch,totalAmountInBatch)
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
  const [VerifyReturn, { isLoading: isreturnLoading }] = useVerifyInvoiceReturnMutation();

  const [imageView, setImageView] = useState<string>("")
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const viewImage = (image: any) => {
    setImageView(image)
    handleShow()
  }

  // console.warn('allPayments', allPayments);
  // console.warn('batchDetails', batchDetails);

  const [totalCreditPayments, setTotalCreditPayments] = useState<any>([])
  const [totalCredit, setTotalCredit] = useState(0)
  const [creditLength, setCreditLength] = useState<number>(0)
  const [creditLoad, setCreditLoad] = useState(false)

  // console.warn('totalCredit', totalCredit);



  useEffect(() => {
    if (batchDetails && !creditLoad) {
      setCreditLoad(true)
      const collectCreditPayments: any[] = []
      batchDetails.payments?.map((val: any) => {
        if (val.method === 'Credit') {
          collectCreditPayments.push(val)
          setCreditLength(cred => cred + 1)
          setTotalCredit(cred => cred + parseFloat(val.amount))
        }
      })
      setTotalCreditPayments(collectCreditPayments)
    }
  }, [batchDetails])


  return (<><div className="batch-details-component report-component">

    <div className="desktop-only">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12">
          {tabs.map((tab: any, index: number) => (<NavLink
            to={tab.link}
            key={index}
            className={"text-decoration-none nav-link-cont"}>
            <li className={`navbar-link`}>
              <LeftArrow onClick={() => {
                setInvoiceMode(false);
              }} />
              <span className="report-nav-name align-middle">
                {tab.name}
                <User /><span className="report-nav-value">{tab.value}</span>
              </span>
            </li>
          </NavLink>))}
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
          {invoiceMode && <span className="d-flex flex-row mx-2">
            <BatchStatus
              batchStatus={
                batch?.status == "1" ? "Unassigned" : batch?.status == "2" ? "Ongoing" : batch?.status == "3" ? "Completed" : ""
              }
            />
          </span>}
        </div>
      </div>
    </div>
    <div className="mobile-only">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="text-12">
          {tabs.map((tab: any, index: number) => (<div>
            <div className="row report-nav-row">

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
            <div className="row report-nav-row">
              <div className="col-auto nav-user"><User /></div>
              <div className="col-8">
                <div className="row report-nav-value">{tab.valueTitle}</div>
                <div className="row report-nav-value">{tab.valueSubTitle}</div>
              </div>
              <div className="col-2 d-flex justify-content-end">
                <BatchStatus
                  batchStatus={
                    batch?.status == "1" ? "Unassigned" : batch?.status == "2" ? "Ongoing" : batch?.status == "3" ? "Completed" : ""

                  }
                />
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
            className={`mb-3 ${allPayments?.cashVerified ? 'invoice-completed' : 'invoice-pending'}`}
            activeKey={activeKey} // This state controls the active accordion item
            onSelect={(eventKey) => handleToggle("0")}>
            <Accordion.Item eventKey="0">

              <Accordion.Header>
                <div className="d-flex flex-row justify-content-between report-cash-label">
                  <span className="justify-content-start">
                    Cash
                    <span className='report-cash-value'>
                      ₹{numberWithCommas(allPayments?.cashTotal.toString() || '0')}
                    </span>

                    <span
                      className="report-cash-count">{allPayments?.cash.length || '0'}</span>
                  </span>

                  <span className="justify-content-end">
                    {
                      allPayments?.cash?.length ? (
                        <button className={`btn ${allPayments?.cashVerified ? 'invoice-completed-button' : 'invoice-mark-as-done'}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            toggleStatus('cash');
                            setLoadingData('cash')
                            if (!allPayments?.cashVerified && !isLoading) {
                              const notVerified = allPayments?.cash?.filter((data: any) => data?.is_verified == false);
                              const ids = notVerified?.map((payment: any) => payment.id).join(',');
                              console.log(ids);
                              await VerifyPayment({ payment_ids: ids, batch_id: batch?.id || 0 });
                              refetchBatch();
                              setLoadingData('')
                            }
                          }}>
                          {loadingData === 'cash' && !allPayments?.cashVerified ? <>
                            <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} />
                          </> : ""}
                          {allPayments?.cashVerified ? 'Completed' : 'Mark As Done'}</button>
                      ) : null
                    }

                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
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
                        {allPayments?.cash?.map((invoice: any, index: number) => (<tr key={invoice.id} className="report-table-row">
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
            className={`mb-3 ${allPayments?.onlineVerified ? 'invoice-completed' : 'invoice-pending'}`}
            activeKey={activeKey} // This state controls the active accordion item
            onSelect={(eventKey) => handleToggle("1")}>
            <Accordion.Item eventKey="1">

              <Accordion.Header>
                <div className="d-flex flex-row justify-content-between report-cash-label">
                  <span className="justify-content-start">
                    Online
                    <span className='report-cash-value'>
                      ₹{numberWithCommas(allPayments?.onlineTotal?.toString() || '0')}
                    </span>

                    <span
                      className="report-cash-count">{allPayments?.online?.length || '0'}</span>
                  </span>

                  <span className="justify-content-end">
                    {
                      allPayments?.online?.length ? (
                        <button className={`btn ${allPayments?.onlineVerified ? 'invoice-completed-button' : 'invoice-mark-as-done'}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            toggleStatus('online');
                            setLoadingData('online')
                            if (!allPayments?.onlineVerified && !isLoading) {
                              const notVerified = allPayments?.online?.filter((data: any) => data?.is_verified == false);
                              const ids = notVerified?.map((payment: any) => payment.id).join(',');
                              console.log(ids);
                              await VerifyPayment({ payment_ids: ids, batch_id: batch?.id || 0 });
                              refetchBatch();
                              setLoadingData('')
                            }
                          }}>
                          {loadingData === 'online' && !allPayments?.onlineVerified ? <>
                            <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} />
                          </> : ""}
                          {allPayments?.onlineVerified ? 'Completed' : 'Mark As Done'}</button>
                      ) : null
                    }

                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div>
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
                          <tr key={invoice.id}>
                            {/* <td className={`numeric-value`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                            <td>{invoice?.invoice_number}</td>
                            <td
                              className={`table-cash `}>{`₹${numberWithCommas(invoice?.amount)}`}</td>
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
            className={`mb-3 ${allPayments?.chequeVerified ? 'invoice-completed' : 'invoice-pending'}`}
            activeKey={activeKey} // This state controls the active accordion item
            onSelect={(eventKey) => handleToggle("2")}>
            <Accordion.Item eventKey="2">

              <Accordion.Header>
                <div className="d-flex flex-row justify-content-between report-cash-label">
                  <span className="justify-content-start">
                    Cheque
                    <span className='report-cash-value'>
                      ₹{numberWithCommas(allPayments?.chequeTotal?.toString() || '0')}
                    </span>

                    <span
                      className="report-cash-count">{allPayments?.cheque?.length || '0'}</span>
                  </span>

                  <span className="justify-content-end">
                    {
                      allPayments?.cheque?.length ? (
                        <button className={`btn ${allPayments?.chequeVerified ? 'invoice-completed-button' : 'invoice-mark-as-done'}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            toggleStatus('cheque');
                            setLoadingData('cheque')
                            if (!allPayments?.chequeVerified && !isLoading) {
                              const notVerified = allPayments?.cheque?.filter((data: any) => data?.is_verified == false);
                              const ids = notVerified?.map((payment: any) => payment.id).join(',');
                              console.log(ids);
                              await VerifyPayment({ payment_ids: ids, batch_id: batch?.id || 0 });
                              refetchBatch();
                              setLoadingData('')
                            }
                          }}>
                          {loadingData === 'cheque' && !allPayments?.chequeVerified ? <>
                            <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} />
                          </> : ""}
                          {allPayments?.chequeVerified ? 'Completed' : 'Mark As Done'}</button>
                      ) : null
                    }

                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
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
                          <tr key={invoice.id}>
                            {/* <td className={`numeric-value ${index === allPayments?.cheque?.length - 1 ? 'border-l-8' : ''}`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                            <td>{invoice?.invoice_number}</td>
                            <td
                              className={`table-cash `}>{`₹${numberWithCommas(invoice?.amount)}`}</td>
                            <td className={index === allPayments?.cheque?.length - 1 ? 'border-r-8' : ''}>
                              {
                                invoice?.image ?
                                  <img
                                    // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/cheques/${invoice?.image}`}
                                    src={invoice?.image_path}
                                    alt="image"
                                    className="img-fluid"
                                    height={50}
                                    width={50}
                                    onClick={() => viewImage(invoice?.image_path)}
                                    // onClick={() => viewImage(invoice?.image)}
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
            className={`mb-3 ${allPayments?.creditVerified ? 'invoice-completed' : 'invoice-pending'}`}
            activeKey={activeKey} // This state controls the active accordion item
            onSelect={(eventKey) => handleToggle("3")}>
            <Accordion.Item eventKey="3">

              <Accordion.Header>
                <div className="d-flex flex-row justify-content-between report-cash-label">
                  <span className="justify-content-start">
                    Credit
                    <span className='report-cash-value'>
                      {`₹ ${totalCredit.toString() || '0'}`}
                    </span>
                    <span
                      className="report-cash-count">{creditLength || '0'}</span>
                  </span>
                  <span className="justify-content-end">
                    <span className="justify-content-end">
                      {
                        totalCredit ? (
                          <button className={`btn ${allPayments?.creditVerified ? 'invoice-completed-button' : 'invoice-mark-as-done'}`}
                            onClick={async (e) => {
                              e.stopPropagation();
                              toggleStatus('credit');
                              setLoadingData('credit')
                              if (!allPayments?.creditVerified && !isLoading) {
                                const notVerified = batchDetails?.payments?.filter((data: any) => data?.is_verified == false);
                                const ids = notVerified?.map((payment: any) => payment.method === 'Credit' && payment.id).join(',');
                                const filterIds = ids?.toString().replaceAll('false,', '').replaceAll(',false', '')
                                await VerifyPayment({ payment_ids: filterIds || '0', batch_id: batch?.id || 0 });
                                refetchBatch();
                                setLoadingData('')
                              }
                            }}>
                            {loadingData === 'credit' && !allPayments?.creditVerified ? <>
                              <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} />
                            </> : ""}
                            {allPayments?.creditVerified ? 'Completed' : 'Mark As Done'}</button>
                        ) : null
                      }
                    </span>
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
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
                        {totalCreditPayments?.map((payment: any, index: any) => (<tr key={payment.id}>
                          {/* <td className={`numeric-value ${index === allPayments?.credit?.length - 1 ? 'border-l-8' : ''}`}>{(index + 1)?.toString().padStart(2, '0')}</td> */}
                          <td>
                            {batchDetails?.invoices.map(val => (
                              val.id === payment.invoice_id ? val.invoice_number : ''
                            ))}
                          </td>
                          <td
                            className={`table-cash `}>{`₹${numberWithCommas(payment?.amount)}`}</td>
                          <td className={index === allPayments?.credit?.length - 1 ? 'border-r-8' : ''}>
                            {
                              payment?.image_path ?
                                <img
                                  // src={`${(window.location.host.includes('.vercel.app') || process.env.NODE_ENV == "development" ? 'https://abc.indelivtest.in' : "https://" + window.location.host)}/tenants/abc/returns/${invoice?.image}`}
                                  src={payment?.image_path}
                                  alt="image"
                                  className="img-fluid"
                                  height={50}
                                  width={50}
                                  onClick={() => viewImage(payment?.image_path)}
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
          !pathname?.includes("/collection") ?
            <div className="payment-list-container">


              <Accordion
                className={`mb-3 ${allPayments?.returnVerified ? 'invoice-completed' : 'invoice-pending'}`}
                activeKey={activeKey} // This state controls the active accordion item
                onSelect={(eventKey) => handleToggle("4")}>
                <Accordion.Item eventKey="4">

                  <Accordion.Header>
                    <div className="d-flex flex-row justify-content-between report-cash-label">
                      <span className="justify-content-start">
                        Product Return
                        <span className='report-cash-value'>
                          {`₹${numberWithCommas(allPayments?.returnTotal?.toString() || '0')}`}
                        </span>

                        <span
                          className="report-cash-count">{allPayments?.returns?.length || '0'}</span>
                      </span>

                      <span className="justify-content-end">
                        {
                          allPayments?.returns?.length ?
                            <button className={`btn ${allPayments?.returnVerified ? 'invoice-completed-button' : 'invoice-mark-as-done'}`}
                              onClick={async (e) => {
                                e.stopPropagation();
                                toggleStatus('return');
                                setLoadingData('return')
                                if (!allPayments?.returnVerified && !isreturnLoading) {
                                  const notVerified = allPayments?.returns?.filter((data: any) => data?.is_verified == false)
                                  const ids = notVerified?.map((payment: any) => payment.id).join(',');
                                  console.log(ids);
                                  await VerifyReturn({ return_ids: ids, batch_id: batch?.id || 0 });
                                  refetchBatch();
                                  setLoadingData('')
                                }
                              }}>{isreturnLoading && !allPayments?.returnVerified ? <>
                                <Loading className="loadingCircle me-2" style={{ height: "20px", width: "20px" }} />
                              </> : ""}{allPayments?.returnVerified ? 'Completed' : 'Mark As Done'}</button>
                            : <></>
                        }

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
                                          onClick={() => viewImage(invoice?.image_path)}
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
            : <></>
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
  </>
  );
}
