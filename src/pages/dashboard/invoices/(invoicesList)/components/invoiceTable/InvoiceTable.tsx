import "./invoice-table.scss";
import React, { useState, useEffect, useMemo, FormHTMLAttributes } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useInvoicesListState } from "../../layout";
import Invoice, {
  InvoiceHead,
  getKeyFromHead,
  invoiceHeadings,
  invoiceKeyHeadMap,
} from "@/types/Invoice";
import LoadingTd from "@/components/LoadingTd";
import { SortingDir } from "@/utils/enums";
import InvoiceTableTh from "../InvoiceTableTh";
import { formatDate, numberWithCommas } from "@/utils/helper";
import { useAppSelector } from "@/state/hooks";
import { ReactComponent as Remove } from "../../../../../../assets/svgs/remove.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ReactComponent as CircleRed } from '@/assets/svgs/delete-circle.svg';
import { BatchStatus } from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchUtils";
export type SortingState = Record<
  InvoiceHead["head"],
  {
    dir: SortingDir;
    optionsOpen: boolean;
  }
>;

export default function InvoiceTable({
  invoices,
  showCheckbox,
  setInvoices,
  loading = false,
  loadMoreInvoices,
  excludedHeadings = [],
  onSelectionChange,
  invoiceMode,
  setCheckedData,
  setSearchTxt,
  checkedData,
  getinvoicesSortBy,
  isCollection
}: {
  invoices: Invoice[];
  showCheckbox?: boolean;
  setInvoices: (invoices: Invoice[]) => void;
  loading?: boolean;
  loadMoreInvoices?: (page: number) => void;
  setSearchTxt?: (page: string) => void;
  excludedHeadings?: InvoiceHead["head"][];
  onSelectionChange?: (selectedIds: number[]) => void;
  invoiceMode?: boolean
  setCheckedData?: (invoices: Invoice[]) => void;
  checkedData: Invoice[];
  getinvoicesSortBy?: (stateData: { sortBy: string, isAsc: boolean }) => void;
  isCollection?: boolean
}) {
  const invoicesState = useAppSelector((state) => state.invoices);

  const page = invoicesState.page;
  // state for saving current state of invoices after sorting
  // const [sortedInvoices, setSortedInvoices] = useState(invoices);
  const navigate = useNavigate();
  const state = useInvoicesListState();
  const location = useLocation();
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => {
    setShowDelete(true); // Show the modal
  };
  const { setSelectedInvoiceIds } = useInvoicesListState();

  // useEffect(() => {
  //   setSelectedInvoiceIds([]);
  //   setInvoices([...invoices]);
  // },[])
  //this line has been removed to avoid screen freeze
  useEffect(() => {
    if (Array.isArray(invoices)) {
      const checkedCount = invoices.filter(i => i.checked).length;
      if (checkedCount == 0) { localStorage.removeItem("scrollPosition") }
      if (typeof state.setSelectedCount === 'function') {
        state.setSelectedCount(checkedCount);
      } else {
        console.error('setSelectedCount is not a function:', state);
      }
    }
  }, [invoices, state]);


  // State for saving sorting states of table headigns
  // const [sortingStates, setSortingStates] = useState({ sortBy: "", isAsc: true });
  const dueBalanceCal = (tm: any, pr: any): string => {
    const invoiceAmount = parseInt(tm);
    const paymentReceived = parseInt(pr);
    return String(invoiceAmount - paymentReceived);
  };
  const [sortingStates, setSortingStates] = useState({sortBy: "",isAsc: true});
  useEffect(() => {
    if (sortingStates.sortBy) {
      getinvoicesSortBy?.(sortingStates)
    }
  }, [sortingStates])

  const [sortStack, setSortStack] = useState < InvoiceHead["head"][] > ([]);
  const moveToTop = (value: InvoiceHead["head"]) => {
    setSortStack((prevStack) => {
      const filteredStack = prevStack.filter((item) => item !== value);
      return [value, ...filteredStack];
    });
  };

  // Getting state coming from parent <Outlet />
  const { setSelectedCount } = useInvoicesListState();
  if (!location?.pathname?.includes("batches/collections")) {
    showCheckbox = true;
    if (location?.pathname?.includes("invoices/deliveries") || location?.pathname?.includes("invoices/completed")) {
      excludedHeadings = ["Due", "Overdue By"];
      if (location?.pathname?.includes("completed")) {
        showCheckbox = false;
      }

    }

  }

  // Creating headings from invoiceHeadings excluding excludedHeadings
  const headings = useMemo(() => {
    return invoiceHeadings.filter(
      (heading) =>
        !excludedHeadings.includes(heading.head) && heading.head !== ""
    );
  }, [excludedHeadings]);

  if (location?.pathname?.includes("batchs") && !invoiceMode) {
    headings[3] = ({ head: "Payment", sortable: false })
    headings[4] = ({ head: "Due Amount", sortable: false })
    headings[5] = ({ head: "Status", sortable: false });
    headings[6] = ({ head: "Action", sortable: false })
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

  // Sorting Invoices whenever sortingStates changes
  // useEffect(() => {
  //   const sortData = (a: Invoice, b: Invoice): number => {
  //     for (let i = 0; i < sortStack.length; i++) {
  //       const prop = getKeyFromHead(sortStack[i]);
  //       if (prop) {
  //         const heading = invoiceKeyHeadMap[prop]?.head;
  //         const aVal: any = a[prop];
  //         const bVal: any = b[prop];
  //         const asc = sortingStates[heading]?.dir === SortingDir.ASC;

  //         // Check if both values are null
  //         if (aVal === null && bVal === null) return 0;

  //         // Null values should be placed at the end when sorting ASC
  //         if (aVal === null) return asc ? 1 : -1;
  //         if (bVal === null) return asc ? -1 : 1;

  //         // If the values are not numeric, use localeCompare for alphabetical sorting
  //         if (isNaN(aVal) || isNaN(bVal)) {
  //           if (aVal > bVal) return asc ? 1 : -1;
  //           if (aVal < bVal) return asc ? -1 : 1;
  //           return 0;
  //         } else {
  //           // If numeric, compare as numbers
  //           return asc ? aVal - bVal : bVal - aVal;
  //         }
  //       }
  //     }
  //     return 0;
  //   };
  //   setInvoices([...invoices].sort(sortData));
  // }, [sortingStates]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    const updatedInvoices = invoices.map((invoice) => ({
      ...invoice,
      checked: checked,
    }));

    setInvoices(updatedInvoices);
    const selectedIds = updatedInvoices.filter(invoice => invoice.checked).map(invoice => invoice.id);
    onSelectionChange?.(selectedIds);
    setCheckedData?.(updatedInvoices.filter(invoice => invoice.checked))
    console.log(typeof setSelectedInvoiceIds);
    if(!invoiceMode){
      setSelectedInvoiceIds(selectedIds);
    }
    // setSortedInvoices(updatedSortedInvoices);
  };

  // handing checkbox changed action to update current invoices and parent ones
  const handleCheckboxChange = (invoice_number: number) => {
    // setSearchTxt?.("")
    localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
    const newInvoices = [...invoices];
    const fIndex = invoices.findIndex(
      (i) => i.id === invoice_number
    );
    const curInvoice = { ...newInvoices[fIndex] };
    if (curInvoice.checked && selectAllChecked) {
      setSelectAllChecked(false);
    }
    newInvoices.splice(fIndex, 1, {
      ...curInvoice,
      checked: !curInvoice.checked,
    });

    setInvoices(newInvoices);
    const selectedIds = newInvoices.filter(invoice => invoice.checked).map(invoice => invoice.id);
    onSelectionChange?.(selectedIds);
    setCheckedData?.(newInvoices.filter(invoice => invoice.checked))
    // // console.log(typeof setSelectedInvoiceIds);
    if (!invoiceMode) {
      setSelectedInvoiceIds(selectedIds);
    }


  };
  let scrollPosition;
  const detailLink = (invoice: Invoice): string => {

    const path = location?.pathname?.includes("batchs")
      ? `/dashboard/invoices/1`
      : `/dashboard/invoices/${invoice.id}`;
    return path;
  };

  useEffect(() => {
    // // console.log("page: ", page)
    const handleScroll = () => {
      // Check if the user has reached the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isAtBottom && loadMoreInvoices) {
        loadMoreInvoices(page + 1);
      }
    };
    // Attach the event listener to the scroll event
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  function getDaysDifference(invoiceDate: Date, currentDate: Date): number {
    // Calculate the difference in milliseconds
    const difference = currentDate.getTime() - invoiceDate.getTime();
    // Convert the difference to days
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  return (
    <>
      <table className="invoice-table-component">
        <thead>
          <tr>
            {showCheckbox && (
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

            {headings.map((heading) => (
              <InvoiceTableTh
                key={heading.head}
                heading={heading}
                setSortingStates={setSortingStates}
                moveToTop={moveToTop}
                withSorting={location?.pathname?.includes("batchs") ? true : showCheckbox}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr
              key={index}
              className={`${invoice.checked && "active"}  ${!showCheckbox && "no-checkbox"
                }`}

            >
              {showCheckbox && (
                <td className="check">
                  <label htmlFor={`check-${invoice.id}`}>
                    <input

                      type="checkbox"
                      checked={invoice.checked}
                      id={`check-${invoice.id}`}
                      className={`ivdt-checked ${invoice.checked && "active"}`}
                      onChange={() =>
                        handleCheckboxChange(invoice.id)
                      }
                    />
                  </label>  
                </td>
              )}
              {!(location?.pathname?.match(/\/dashboard\/batchs\/collections\/\d+/) && window.innerWidth <= 700) &&
                <Link target={checkedData.length ? "_blank" : "_self"} to={location?.pathname?.includes("batchs")
                  ? `/dashboard/invoices/1`
                  : `/dashboard/invoices/${invoice.id}?hidebackbutton=${checkedData.length ? true : ''}`}
                  className="link-wrapper"
                  style={{ pointerEvents: "all" }}
                // onClick={() => {
                //   if (!location?.pathname?.includes("batchs")) {
                //     navigate(detailLink(invoice));
                //   }
                // }
                //}
                //removed local storage
                >

                  <td className={location?.pathname?.includes("batchs") ? "invoice-text" : "invoice-no"}>
                    <span onClick={() => {
                      if (location?.pathname?.includes("batchs")) {
                        navigate(detailLink(invoice));
                      }
                    }}>{invoice.invoice_number}</span>
                    <Link target={checkedData.length ? "_blank" : "_self"} to={location?.pathname?.includes("batchs")
                      ? `/dashboard/invoices/1`
                      : `/dashboard/invoices/${invoice.id}?hidebackbutton=${checkedData.length ? true : ''}`} className="view-detail">View Detail</Link>

                  </td>
                  {!(location.pathname.includes("batches/collections") && !invoiceMode) &&
                    <td className={`date other ${!headings.find(v => v.head == "Overdue By") && "last"}`}>
                      {formatDate(invoice.invoice_date)}
                    </td>
                  }

                  <td className="buyer">{invoice.buyer.name}</td>
                  {
                    !location.pathname.includes("batches/collections") &&
                    <td className="company other">{invoice?.company_name}</td>
                  }
                  {
                    location.pathname.includes("batches/collections") && invoiceMode &&
                    <td className="company other">{invoice?.company_name}</td>
                  }

                  <td className="amount">
                    ₹{numberWithCommas(invoice.invoice_amount)}
                  </td>
                  {headings.find(v => v.head == "Due") && <td className="due other"> ₹
                    {numberWithCommas( invoice?.amount_due
                    )}</td>}
                  {headings.find(v => v.head == "Overdue By") && <td className="overdue other last">{getDaysDifference(new Date(invoice.invoice_date), new Date())} Days</td>}
                  {invoice.overdueBy && location?.pathname?.includes("batchs") && !invoiceMode && (
                    <td className="overdue other last"> ₹{numberWithCommas("0")}</td>
                  )}
                  {invoice.overdueBy && !location?.pathname?.includes("batchs") && (
                    <td className="overdue other last">{invoice.overdueBy}</td>
                  )}
                  {/* {location.pathname.includes("batches/collections") && invoiceMode && (
                    <td className="overdue other last">{invoice.overdueBy}</td>
                )} */}

                  {location?.pathname?.includes("batchs") && !invoiceMode &&
                    <td><BatchStatus batchStatus={"Delivered"} /></td>}
                  {location?.pathname?.includes("batchs") && !invoiceMode &&
                    <td className="delete"><Remove onClick={handleShowDelete} /></td>}
                  <Modal show={showDelete} onHide={handleCloseDelete} centered>
                    <Modal.Header style={{ borderBottom: "0px" }}>
                      <Modal.Title
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: "center" }}>
                          <CircleRed />
                          <span style={{ marginLeft: '10px', marginTop: 24 }}>You are about to remove</span>
                          <span style={{ marginLeft: '10px' }}>A114455 - Moonstone Ventures LLP</span>
                          <span style={{ marginLeft: '10px' }}>Are you sure you wish to delete? </span>
                        </div>

                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body></Modal.Body>
                    <Modal.Footer className={"delete-modal-footer"}>
                      <button className={"btn btn-secondary ms-2 px-4 cancel-delete-button"} onClick={handleCloseDelete}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>No</span>
                      </button>
                      <Button variant="primary" className={'conform-delete-button'} onClick={() => handleCloseDelete}>
                        Yes
                      </Button>

                    </Modal.Footer>
                  </Modal>
                </Link>
              }



              {(location?.pathname?.match(/\/dashboard\/batchs\/collections\/\d+/) && window.innerWidth <= 700) &&
                <div>
                  <div className="link-wrapper mobile-only payment-row" style={{ position: 'relative' }}>
                    <div className="title-area" style={{ paddingRight: 40 }}>
                      <div className="info">
                        <div className="d-flex flex-column align-items-stretch">
                          <div className="p-1 fw-medium" style={{ color: "#0080FC" }}>
                            { }
                          </div>
                          <div className="d-flex flex-column p-1">
                            <p className="fw-light">{invoice?.buyer.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="btns">
                        <span className="">
                          <span className="edit-btn">
                            <BatchStatus
                              batchStatus={index === invoices.length - 1 ? "Delivered" : index === invoices.length - 2 ? "Ongoing" : "Pending"} />
                          </span>
                          <span className="delete-btn mobile-delete-button">
                            <Remove onClick={handleShowDelete} />
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="payment-dcc">
                      <p>
                        <span className="block-title">Amount</span>
                        <span className="block-value">₹{numberWithCommas(invoice?.invoice_amount)}</span>
                      </p>
                      <hr />
                      <p>
                        <span className="block-title">Date</span>
                        <span className="block-value">{invoice?.invoice_date}</span>
                      </p>

                    </div>
                  </div>
                </div>
              }
            </tr>
          ))}
          {loading && (
            <tr className="loading-row">
              <LoadingTd cols={headings.length + (showCheckbox ? 1 : 0)} />
            </tr>
          )}
        </tbody>
      </table>

    </>
  );
}
