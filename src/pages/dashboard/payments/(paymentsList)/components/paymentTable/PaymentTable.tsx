import "./payment-table.scss";
import React, { useState, useEffect, useMemo, FormHTMLAttributes } from "react";
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
import { ReactComponent as CircleRed } from '@/assets/svgs/circle.svg';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
  paymentsApiSlice,
  useDeletePaymentMutation,
  useEditPaymentMutation, useGetPaymentsMutation
} from "@/state/slices/payments/paymentsApiSlice";
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
  getPaymentsSortBy
}: {
  payments: Payment[];
  showCheckbox?: boolean;
  setPayments: (payments: Payment[]) => void;
  loading?: boolean;
  loadMorePayments?: (page: number) => void;
  excludedHeadings?: paymentHead["head"][];
  getPaymentsSortBy?: (stateData: { sortBy: string, isAsc: boolean }) => void;
}) {
  const paymentsState = useAppSelector((state) => state.payments);
  const page = paymentsState.page;
  const navigate = useNavigate();

  const [paymentAmountUpdated, setPaymentAmountUpdated] = useState('');
  const [selectedId, setSelecetedId] = useState(0);
  const [selectedAmount, setSelecetedAmount] = useState("");
  const [selectedAmountDue, setSelecetedAmountDue] = useState('');
  const [selectedInvoiceNo, setSelecetedInvoiceNo] = useState('');

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmountUpdated(event.target.value);
  };

  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (paymentId: number, amount: string, amount_due: number, invoice_number: string) => {
    setShowEdit(true);
    setSelecetedId(paymentId);
    setSelecetedAmount(amount);
    setSelecetedAmountDue(amount_due.toString());
    setSelecetedInvoiceNo(invoice_number)
  };
  const [showDelete, setShowDelete] = useState(false);
  const [sortingStates, setSortingStates] = useState({ sortBy: "", isAsc: false });
  useEffect(() => {
    if (sortingStates.sortBy) {
      getPaymentsSortBy?.(sortingStates)
    }
  }, [sortingStates])

  const handleCloseDelete = () => {
    setShowDelete(false);
  };
  const handleShowDelete = (id: number) => { setSelecetedId(id); setShowDelete(true) };
  const [sortStack, setSortStack] = useState<paymentHead["head"][]>([]);
  const moveToTop = (value: paymentHead["head"]) => {
    setSortStack((prevStack) => {
      const filteredStack = prevStack.filter((item) => item !== value);
      return [value, ...filteredStack];
    });
  };

  // Getting state coming from parent <Outlet />
  const { setSelectedCount } = usePaymentsListState();

  // Creating headings from paymentHeadings excluding excludedHeadings
  const headings = useMemo(() => {
    return paymentHeadings.filter(
      (heading) =>
        !excludedHeadings.includes(heading.head) && heading.head !== ""
    );
  }, [excludedHeadings]);
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [editPayment, { isLoading: isEditing }] = useEditPaymentMutation();
  const handleDelete = async () => {
    try {
      await deletePayment({ id: selectedId }).unwrap();
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
        const response = await getPayments({ page: 1, keyword: '' }).unwrap();
        // Assuming the response is in the expected format for setPayments
        (setPayments(response.data));
        // Optionally show a success message
      } catch (error) {
        // Handle or display the error
      }
    }
  };

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
          {payments.map((payment, index) => (
            <tr
              key={index}
              className={`"active"  ${!showCheckbox && "no-checkbox"
                }`}
            >
              {/* {showCheckbox && (
                
              )} */}
              <div className="link-wrapper mobile-only payment-row">
                <div className="title-area">
                  <div className="info">
                    <Link to={`/dashboard/invoices/${payment?.invoice?.id}`} className="buyer-name" style={{ color: '#0080FC !important' }}>{"ID# "} {payment.id}</Link>
                    <span
                      className={`payment-amount`}>₹{numberWithCommas(payment.amount)} <span>({payment?.method || "Cash"})</span>
                    </span>
                  </div>
                  <div className="btns">
                    <span className="payments_btns mobile">
                      <span className="edit-btn">
                        <Edit onClick={() => handleShowEdit(payment.id, payment.amount, payment.invoice.amount_due, payment.invoice.invoice_number)} />
                      </span>
                      <span className="delete-btn">
                        <Delete onClick={() => handleShowDelete(payment.id)} />
                      </span>
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="buyer-name2">{payment?.invoice?.buyer?.name}</p>
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
                    <span className="block-value">{payment?.invoice?.company_name}</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/dashboard/invoices/${payment?.invoice?.id}`}
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
                  {payment?.invoice?.company_name}
                </td>
                <td className="buyer align-middle">{payment?.user_name || "Jane Doe"}</td>
                <td className="company other align-middle">{payment?.invoice?.invoice_number}</td>
                <td className="amount align-middle">
                  {payment?.invoice?.buyer?.name}
                </td>
                <td className="company other align-middle">{payment?.method || "Cash"}</td>
                <td className="company other align-middle">₹{numberWithCommas(payment.amount)}</td>

              </Link>
              <td className="align-middle desktop-only" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="d-flex justify-content-around">
                  <Edit onClick={() => handleShowEdit(payment.id, payment.amount, payment.invoice.amount_due, payment.invoice.invoice_number)} />
                  <Delete onClick={() => handleShowDelete(payment.id)} />
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
    </>
  );
}
