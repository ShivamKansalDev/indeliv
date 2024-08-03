import "./payment-table.scss";
import React, { useState, useEffect, useMemo, FormHTMLAttributes, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePaymentsListState } from "../../layout";
import Form from 'react-bootstrap/Form';
import Payment, {
  paymentHead,
  getKeyFromHead,
  paymentHeadings,
  paymentKeyHeadMap,
} from "@/types/Payment";
import LoadingTd from "@/components/LoadingTd";
import { SortingDir } from "@/utils/enums";
import PaymentTableTh from "../PaymentTableTh";
import { formatDate, numberWithCommas } from "@/utils/helper";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { ReactComponent as Edit } from '@/assets/svgs/edit.svg';
import { ReactComponent as Delete } from '@/assets/svgs/delete.svg';
import { ReactComponent as View } from '@/assets/svgs/view.svg';
import { ReactComponent as CircleRed } from '@/assets/svgs/circle.svg';
import debounce from 'lodash/debounce';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import {
  paymentsApiSlice,
  useAddPaymentMutation,
  useDeletePaymentMutation,
  useEditPaymentMutation, useGetPaymentsMutation
} from "@/state/slices/payments/paymentsApiSlice";
import { useGetUnpaidInvoiceMutation } from '@/state/slices/invoices/invoicesApiSlice'
import { clearState } from "@/state/slices/payments/paymentsSlice";
export type SortingState = Record<
  paymentHead["head"],
  {
    dir: SortingDir;
    optionsOpen: boolean;
  }
>;

export default function PaymentTable({
  payments,
  showCheckbox,
  setPayments,
  loading = false,
  loadMorePayments,
  excludedHeadings = ["Due", "Overdue By"],
  getPaymentsSortBy,
  showAddPaymentModal,
  setShowAddPaymentModal
}: {
  payments: Payment[];
  showCheckbox?: boolean;
  setPayments: (payments: Payment[]) => void;
  loading?: boolean;
  loadMorePayments?: (page: number) => void;
  excludedHeadings?: paymentHead["head"][];
  getPaymentsSortBy?: (stateData: { sortBy: string, isAsc: boolean }) => void;
  showAddPaymentModal?: boolean | undefined;
  setShowAddPaymentModal?: any;
}) {

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: 10,
      border: state.isFocused ? '1px solid #86b7fe' : '',
      boxShadow: state.isFocused ? '0 0 0 0.25rem #b9d5ff' : '',
      fontSize: 14,
      '&:hover': {
        border: '1px solid hsl(0, 0%, 80%);',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: 14,
      color: state.isSelected ? "white" : "rgb(93, 111, 129)"
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      fontSize: 14,
      color: "rgb(33, 37, 41)",
    }),
  };
  const paymentsState = useAppSelector((state) => state.payments);
  const page = paymentsState.page;
  const navigate = useNavigate();

  const [paymentAmountUpdated, setPaymentAmountUpdated] = useState('');
  const [selectedId, setSelecetedId] = useState(0);
  const [showImage, setShowImage] = useState(false)
  const [selectedAmount, setSelecetedAmount] = useState("");
  const [selectedAmountDue, setSelecetedAmountDue] = useState('');
  const [selectedInvoiceNo, setSelecetedInvoiceNo] = useState('');

  const [paymentData, setPaymentData] = useState({
    invoiceNumber: '',
    paymentMethod: '',
    amount: ''
  });


  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmountUpdated(event.target.value);
  };

  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseImageModal = () => setShowImage(false)
  const [imagePath, setImagePath] = useState('')
  const handleShowEdit = (paymentId: number, amount: string, amount_due: number, invoice_number: string) => {
    setShowEdit(true);
    setSelecetedId(paymentId);
    setSelecetedAmount(amount);
    setSelecetedAmountDue(amount_due.toString());
    setSelecetedInvoiceNo(invoice_number)
  };
  const [showDelete, setShowDelete] = useState(false);
  const [unPaidInvoice, setUnPaidInvoice] = useState<any>([])
  const [sortingStates, setSortingStates] = useState({ sortBy: "id", isAsc: false });
  const [getUnpaidInvoice, { isLoading: isInvoiceLoading }]: any = useGetUnpaidInvoiceMutation();
  const [invoicePage, setInvoicePage] = useState(1)
  const getUnpaidInvoices = async () => {
    const { data: { data } }: any = await getUnpaidInvoice({ page: invoicePage, keyword: '' });
    setUnPaidInvoice(data)
  }
  useEffect(() => {
    getUnpaidInvoices();
  }, [])

  const [selectedCompany, setSelectedCompany] = useState(null);

  const companyOptions = unPaidInvoice.map((invoice: any) => ({
    value: invoice.id,
    label: `${invoice.invoice_number} ${invoice.buyer_name}`,
  }));

  const handleScrollInvoice = async () => {
    const { data: { data } }: any = await getUnpaidInvoice({ page: invoicePage + 1, keyword: '' })
    setUnPaidInvoice([...unPaidInvoice, ...data])
    setInvoicePage(invoicePage + 1)

  }

  useEffect(() => {
    if (sortingStates.sortBy) {
      getPaymentsSortBy?.(sortingStates)
    }
  }, [sortingStates])

  const handleCloseDelete = () => {
    setShowDelete(false);
  };
  const handleShowDelete = (id: any) => { setSelecetedId(id); setShowDelete(true) };
  const [sortStack, setSortStack] = useState<paymentHead["head"][]>([]);
  const moveToTop = (value: paymentHead["head"]) => {
    setSortStack((prevStack) => {
      const filteredStack = prevStack.filter((item) => item !== value);
      return [value, ...filteredStack];
    });
  };

  // Getting state coming from parent <Outlet />
  const { searchTxt, setSelectedCount } = usePaymentsListState();

  // Creating headings from paymentHeadings excluding excludedHeadings
  const headings = useMemo(() => {
    return paymentHeadings.filter(
      (heading) =>
        !excludedHeadings.includes(heading.head) && heading.head !== ""
    );
  }, [excludedHeadings]);
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [editPayment, { isLoading: isEditing }] = useEditPaymentMutation();
  const [addPayment, { isLoading: isAdding, isError: paymentError }] = useAddPaymentMutation();

  const handleDelete = async () => {
    try {
      console.log('selectedId', selectedId)
      await deletePayment({ payment: selectedId }).unwrap();
      const response = await getPayments({ page: 1, keyword: searchTxt ? searchTxt : '' }).unwrap();
      // Assuming the response is in the expected format for setPayments
      (setPayments(response.data));
      // Optionally show a success message
    } catch (error) {
      // Handle or display the error
    }
  };
  const [getPayments, { data, isError, isLoading, error }] =
    useGetPaymentsMutation();
  const dispatch = useAppDispatch();
  const handleEdit = async (paymentId: number | string, amount: string) => {
    if (parseInt(amount) > parseInt(selectedAmountDue)) {
      alert(`Amount entered is more than balance due in the invoice ${selectedInvoiceNo}`)
    } else {
      try {
        await editPayment({ payment_id: paymentId, amount: amount }).unwrap()
        const response = await getPayments({ page: 1, keyword: searchTxt ? searchTxt : '' }).unwrap();
        // Assuming the response is in the expected format for setPayments
        (setPayments(response.data));
        // Optionally show a success message
      } catch (error) {
        // Handle or display the error
      }
    }
  };

  const handleChange = (e: any) => {
    if (e.value) {
      setPaymentData({ ...paymentData, invoiceNumber: e.value });
    } else {
      const { name, value } = e.target;
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { invoiceNumber, amount, paymentMethod } = paymentData

    if (parseInt(amount) <= 0) {
      alert(`Amount entered can not be zero.`)
    }
    else {
      try {
        const { data, error }: any = await addPayment({ invoice_id: invoiceNumber, amount: amount, method: paymentMethod })
        if (data?.message?.amount) {
          return alert(data?.message?.amount[0])
        }
        if (error) {
          return alert(error?.data?.message)
        } else {
          dispatch(clearState());
          closePaymentModal();
          await getPayments({ page: 1, keyword: '' })
        }
      } catch (error) {
        // Handle or display the error
      }
    }
  };

  const closePaymentModal = () => {
    setPaymentData({
      invoiceNumber: '',
      paymentMethod: '',
      amount: ''
    });
    setShowAddPaymentModal(false);
  }

  // Initializing Sorting States such that all headings are asc and options closed
  // useEffect(() => {
  //   if (headings.length && !Object.keys(sortingStates).length) {
  //     const newSortingStates: typeof sortingStates = {};
  //     const newSortStack: typeof sortStack = [];
  //     headings.forEach((h) => {
  //       if (h.sortable) {
  //         newSortingStates[h.head] = {
  //           dir: SortingDir.ASC,
  //           optionsOpen: false,
  //         };
  //         newSortStack.push(h.head);
  //       }
  //     });
  //     setSortingStates(newSortingStates);
  //     setSortStack(newSortStack);
  //   }
  // }, [headings]);

  // Sorting Payments whenever sortingStates changes
  // useEffect(() => {
  //   const sortData = (a: Payment, b: Payment): number => {
  //     for (let i = 0; i < sortStack.length; i++) {
  //       const prop = getKeyFromHead(sortStack[i]);
  //       if (prop) {
  //         let aVal;
  //         let bVal;
  //         const heading = paymentKeyHeadMap[prop].head;
  //         if(heading==="Invoice No."){
  //           aVal = a?.invoice?.invoice_number;
  //           bVal = b?.invoice?.invoice_number;
  //         }
  //           else if(heading==="Buyer"){
  //           aVal = a?.invoice?.buyer?.name;
  //           bVal = b?.invoice?.buyer?.name;
  //         }
  //             else
  //         {aVal = a[prop]  || "";
  //         bVal = b[prop]  || "";}
  //         const asc = sortingStates[heading]?.dir === SortingDir.ASC;
  //         if (heading !== "" && sortingStates[heading]) {
  //           if (aVal > bVal) return asc ? 1 : -1;
  //           else if (aVal < bVal) return asc ? -1 : 1;
  //         }
  //       }
  //     }
  //     return 0;
  //   };
  //   setPayments([...payments].sort(sortData));
  // }, [sortingStates]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [updatedPayment, setUpdatedPayment] = useState([])
  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    const updatedPayments = payments.map((payment) => ({
      ...payment,
      checked: checked,
    }));

    setPayments(updatedPayments);
    // setSortedPayments(updatedSortedPayments);
  };

  // handing checkbox changed action to update current payments and parent ones
  // const handleCheckboxChange = (payment_number: string) => {
  //   const newPayments = [...payments];
  //   const fIndex = payments.findIndex(
  //     (i) => i.payment_number === payment_number
  //   );
  //   const curPayment = { ...newPayments[fIndex] };
  //   if (curPayment.checked && selectAllChecked) {
  //     setSelectAllChecked(false);
  //   }
  //   newPayments.splice(fIndex, 1, {
  //     ...curPayment,
  //     checked: !curPayment.checked,
  //   });
  //
  //   setPayments(newPayments);
  // };

  // const detailLink = (payment: Payment): string => {
  //   return `/dashboard/payments/${payment.payment_number}`;
  // };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has reached the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isAtBottom && loadMorePayments) {
        loadMorePayments(page + 1);
      }
    };
    // Attach the event listener to the scroll event
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  const searchUnpaidInvoice = useCallback(
    debounce(async (e: any) => {
      try {
        const { data: { data } } = await getUnpaidInvoice({ page: 1, keyword: e?.target?.value || '' });
        return setUnPaidInvoice(data)
      } catch (error) {
        return false; // Return false to exclude the option in case of error
      }
    }, 1000), // Delay of 1 second (1000 milliseconds)
    []
  );


  return (
    <>
      <table className="payment-table-component">
        <thead>
          <tr>
            {headings.map((heading) => (
              <PaymentTableTh
                key={heading.head}
                heading={heading}
                setSortingStates={setSortingStates}
                moveToTop={moveToTop}
                withSorting={showCheckbox}
              />
            ))}
            <th><span className="unsorted">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any, index: any) => (
            <tr
              key={index}
              className={`" bg-white active"  ${!showCheckbox && "no-checkbox"
                }`}
            >
              {/* {showCheckbox && (
                
              )} */}
              <div className="link-wrapper mobile-only payment-row">
                <div className="title-area">
                  <div className="info"> 
                    <Link to={`/dashboard/invoices/${payment?.invoice_id}`} className="buyer-name" style={{ color: '#0080FC !important' }}>{"ID# "} {payment.id}</Link>
                    <span
                      className={`payment-amount`}>₹{numberWithCommas(payment.amount)} <span>({payment?.method || "Cash"})</span>
                    </span>
                  </div>
                  <div className="btns">
                    <span className="payments_btns mobile">
                    {payment?.payment?.image_path ? 
                      <span className="edit-btn">
                        <View onClick={() => { setImagePath(payment?.payment?.image_path); setShowImage(true) }} />
                      </span> : ''}
                      <span className="edit-btn">
                        <Edit onClick={() => handleShowEdit(payment.id, payment.amount, payment?.invoice?.amount_due, payment.invoice.invoice_number)} />
                      </span>
                      <span className="delete-btn">
                        <Delete onClick={() => handleShowDelete({ id: payment.method === 'Product Return' ? payment.invoice_id : payment.id, method: payment.method })} />
                      </span>
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="buyer-name2">{payment?.buyer_name}</p>
                  {/* <a className="buyer-name" href="">{payment?.invoice?.invoice_number}</a> */}
                </div>

                <div className="payment-dcc">
                  <p>
                    <span className="block-title">Date</span>
                    <span className="block-value">{formatDate(payment?.created_at)}</span>
                  </p>
                  <hr />
                  <p>
                    <span className="block-title">Collected By</span>
                    <span className="block-value">{payment?.user_name || "JohnDoe"}</span>
                  </p>
                  <hr />
                  <p>
                    <span className="block-title">Company</span>
                    <span className="block-value">{payment?.company_name}</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/dashboard/invoices/${payment?.invoice_id}`}
                className="link-wrapper desktop-only"
              // onClick={() => navigate(detailLink(payment))}
              >
                <td className={`payment-no align-middle`}>
                  <span className="buyer-name" style={{ color: '#0080FC !important' }}> {payment.id}</span>
                </td>
                <td className={`payment-no align-middle`}>
                  <span>{formatDate(payment?.created_at)}</span>
                  {/*<Link to={detailLink(payment)} className="view-detail">*/}
                  {/*  View Detail*/}
                  {/*</Link>*/}
                </td>
                {/*<td className={`date other ${!payment.overdueBy && "last"}`}>*/}
                <td className={`date other last align-middle`}>
                  {payment?.company_name}
                </td>
                <td className="buyer align-middle">{payment?.user_name || "Jane Doe"}</td>
                <td className="company other align-middle">{payment?.invoice?.invoice_number}</td>
                <td className="amount align-middle">
                  {payment?.buyer_name}
                </td>
                <td className="company other align-middle">{payment?.method ? payment?.method === "Return" ? "Product Return" : payment?.method : "Cash"}</td>
                <td className="company other align-middle">₹{numberWithCommas(payment.amount)}</td>

              </Link>
              <td className="align-middle desktop-only" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="d-flex justify-content-around">
                  <span style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    {(payment?.method !== "Product Return" && payment?.payment?.image_path) ? <View onClick={() => { setImagePath(payment?.payment?.image_path); setShowImage(true) }} /> : ''}
                  </span>
                  <span style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <Edit onClick={() => handleShowEdit(payment.id, payment.amount, payment.invoice.amount_due, payment.invoice.invoice_number)} />
                  </span>
                  <span style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <Delete onClick={() => handleShowDelete({ id: payment.method === 'Product Return' ? payment.invoice_id : payment.id, method: payment.method })} />
                  </span>
                </div>
              </td>
            </tr>
          ))}
          {loading && (
            <tr className="loading-row">
              <LoadingTd cols={headings.length + (showCheckbox ? 1 : 0)} />
            </tr>
          )}
        </tbody>
      </table>

      <Modal className="custom-modal" show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton style={{ margin: 24, padding: 0, paddingBottom: 16 }}>
          <Modal.Title>Edit Payment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Payment Amount</p>
          <Form.Control type="text" placeholder={`₹${numberWithCommas(selectedAmount)}`}
            onChange={handleChangeAmount} />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleEdit(selectedId, paymentAmountUpdated); setShowEdit(false); }}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header>
          <Modal.Title style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: "center" }}>
              <CircleRed />
              <span style={{ marginLeft: '10px', marginTop: 24 }}>Are you sure you want to delete this Payment?</span>
            </div>

          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer className={"delete-modal-footer"} >
          <button className={"btn btn-secondary ms-2 px-4 cancel-delete-button"} onClick={handleCloseDelete}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>No</span>
          </button>
          <Button variant="primary" className="conform-delete-button" onClick={() => { handleDelete(); setShowDelete(false); }}>
            Yes
          </Button>

        </Modal.Footer>
      </Modal>

      <Modal className="custom-modal" show={showAddPaymentModal} onHide={closePaymentModal} centered>
        <Modal.Header closeButton style={{ margin: '20px 16px 24px 16px', padding: 0, paddingBottom: 2 }}>
          <Modal.Title>Add Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Select Invoice Number</Form.Label>
              <Select
                options={companyOptions}
                onChange={handleChange}
                value={companyOptions.find((option: any) => option.value === paymentData.invoiceNumber)}
                placeholder="Select Invoice"
                onMenuScrollToBottom={handleScrollInvoice}
                isLoading={isInvoiceLoading}
                styles={customStyles}
                onKeyDown={searchUnpaidInvoice as any}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleChange}
                style={{ fontSize: '14px', color: !paymentData.paymentMethod ? '#5d6f81' : '#212529' }}
              >
                <option key={-1} disabled value={''}>Select Payment Method</option>
                {['Cash', 'Online', 'Cheque'].map((type, index) => (
                  <option style={{ color: '#5d6f81' }} key={index} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                value={paymentData.amount}
                onChange={handleChange}
                placeholder={`₹00.00`}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer" style={{ border: 'none', paddingTop: '0' }}>
          <Button variant={Object.values(paymentData).some(value => value === '') ? "secondary" : "primary"} style={{ padding: '6px 16px !important' }} disabled={Object.values(paymentData).some(value => value === '')} onClick={handleSubmit} >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showImage} onHide={handleCloseImageModal} size="lg" style={{ background: "#02020278", height: "100%" }}>
        <Modal.Header closeButton style={{ padding: "15px 20px" }}>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-content-center">

            <img
              src={imagePath}
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
