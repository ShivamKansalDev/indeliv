import "./batch-details-table.scss";
import React, { useState, useEffect, useMemo, FormHTMLAttributes } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBatchsListState } from "../../../(batchsList)/layout";
import Batch, {
  batchDetailsHead,
  getKeyFromHead,
  batchDetailsHeadings,
} from "@/types/BatchDetails";
import LoadingTd from "@/components/LoadingTd";
import { SortingDir } from "@/utils/enums";
import BatchDetailsTableTh from "@pages/dashboard/batchs/details/components/BatchDetailsTableTh";
import { formatDate, numberWithCommas } from "@/utils/helper";
import { useAppSelector } from "@/state/hooks";
import Button from "react-bootstrap/Button";
import { ProgressBar } from "react-bootstrap";
import BatchDetails, { batchDetailsKeyHeadMap } from "@/types/BatchDetails";
import { ReactComponent as CircleRed } from "@/assets/svgs/delete-circle.svg";
import {
  BatchAvatar,
  BatchAvatarMobile,
  BatchProgress,
  BatchStatus,
} from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchUtils";
import Invoice, { invoiceKeyHeadMap } from "@/types/Invoice";
import { ReactComponent as Remove } from "../../../../../../assets/svgs/remove.svg";
import Modal from "react-bootstrap/Modal";
import {
  useDeleteInvoiceFromBatchMutation,
  useGetBatchDetailByIdQuery,
  useGetBatchsMutation,
} from "@/state/slices/batchs/batchsApiSlice";
import { useGetPaymentsMutation } from "@/state/slices/payments/paymentsApiSlice";
import moment from "moment";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { batchKeyHeadMap } from "@/types/Batch";
export type SortingState = Record<
  batchDetailsHead["head"],
  {
    dir: SortingDir;
    optionsOpen: boolean;
  }
>;

export default function BatchDetailsTable({
  batchs,
  showCheckbox,
  setBatchs,
  loading = false,
  loadMoreBatchs,
  excludedHeadings = ["Due", "Overdue By"],
  searchTextIn,
  isCollection,
}: {
  batchs: BatchDetails | undefined;
  showCheckbox?: boolean;
  setBatchs: (batchs: BatchDetails[]) => void;
  loading?: boolean;
  loadMoreBatchs?: (page: number) => void;
  excludedHeadings?: batchDetailsHead["head"][];
  searchTextIn?: string;
  isCollection?: boolean;
}) {
  const batchsState = useAppSelector((state) => state.batchs);
  const page = batchsState.page;
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // state for saving current state of batchs after sorting
  // const [sortedBatchs, setSortedBatchs] = useState(batchs);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setSelectedCount(batchs.filter((i) => i.checked).length);
  //   // setSortedBatchs(batchs);
  // }, [batchs]);

  // State for saving sorting states of table headigns
  const [sortingStates, setSortingStates] = useState<SortingState>({});
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams();
  const batchId = params?.id || "0";
  const { data: batchDetails, refetch: refetchBatch } =
    useGetBatchDetailByIdQuery(params?.batchNo, {
      //skip: isNaN(batchId), // Skip the query if batchId is NaN
    });
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);
  const [getInvoices, { data, isError, isLoading, error }] =
    useGetInvoicesMutation();
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice?.id); // Set the currently selected invoice ID
    setSelectedInvoice(invoice); // Set the currently selected invoice ID
    setShowDelete(true); // Show the modal
  };
  const [batch, setBatch] = useState(batchs);
  const [invoices, setInvoices] = useState<any>(batch?.invoices);
  const [sortStack, setSortStack] = useState<batchDetailsHead["head"][]>([]);
  const moveToTop = (value: batchDetailsHead["head"]) => {
    setSortStack((prevStack) => {
      const filteredStack = prevStack.filter((item) => item !== value);
      return [value, ...filteredStack];
    });
  };
  const [getBatchs] = useGetBatchsMutation();
  const [deleteInvoiceFromBatch] = useDeleteInvoiceFromBatchMutation();
  const handleDeleteInvoices = async (invoiceId: number) => {
    handleCloseDelete();
    loading = true;
    try {
      await deleteInvoiceFromBatch({
        batchId: batchs?.id || 0,
        invoiceIds: [invoiceId],
      }).unwrap();
      refetchBatch();

      loading = false;
    } catch (err) { }
  };
  const dueBalanceCal = (tm: any, pr: any): string => {
    const invoiceAmount = parseInt(tm);
    const paymentReceived = parseInt(pr);
    return String(invoiceAmount - paymentReceived);
  };
  const { setSelectedCount } = useBatchsListState();

  const headings = useMemo(() => {
    return batchDetailsHeadings.filter(
      (heading) =>
        !excludedHeadings.includes(heading.head) && heading.head !== ""
    );
  }, [excludedHeadings]);

  useEffect(() => {
    if (batch?.invoices.length == 0) {
      navigate("/dashboard/batches/deliveries");
    }
    setInvoices(batch?.invoices);
  }, [batch]);

  useEffect(() => {
    setBatch(batchDetails);
  }, [batchDetails]);

  useEffect(() => {
    if (headings.length && !Object.keys(sortingStates).length) {
      const newSortingStates: typeof sortingStates = {};
      const newSortStack: typeof sortStack = [];
      headings.forEach((h) => {
        if (h.sortable) {
          newSortingStates[h.head] = {
            dir: SortingDir.ASC,
            optionsOpen: false,
          };
          newSortStack.push(h.head);
        }
      });
      setSortingStates(newSortingStates);
      setSortStack(newSortStack);
    }
  }, [headings]);

  useEffect(() => {
    const sortData = (a: any, b: any) => {
      for (let i = 0; i < sortStack.length; i++) {
        const prop = getKeyFromHead(sortStack[i]);
        // // console.log("prop",prop)
        if (prop) {
          const heading = batchDetailsKeyHeadMap[prop]?.head;
          let aVal = a[prop];
          let bVal = b[prop];

          if (prop == 'buyer_name') {
            aVal = a?.buyer?.name;
            bVal = b?.buyer?.name;
          }

          const asc = sortingStates[heading]?.dir === SortingDir.ASC;
          
          if (aVal === null && bVal === null) return 0;
          if (aVal === null) return asc ? 1 : -1;
          if (bVal === null) return asc ? -1 : 1;

          if (isNaN(aVal) || isNaN(bVal)) {
            if (aVal > bVal) return asc ? 1 : -1;
            if (aVal < bVal) return asc ? -1 : 1;
            return 0;
          } else {
            // // console.log(asc ? aVal - bVal : bVal - aVal);
            return asc ? aVal - bVal : bVal - aVal;
          }
        }
      }
      return 0;
    };
    // console.log(sortData.toString());
    setInvoices([...invoices].sort(sortData));

  }, [sortingStates]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    // setSelectAllChecked(checked);
    // const updatedBatchs = batchs.map((batch) => ({
    //   ...batch,
    //   checked: checked,
    // }));

    // setBatchs(updatedBatchs);
    // setSortedBatchs(updatedSortedBatchs);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has reached the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isAtBottom && loadMoreBatchs) {
        loadMoreBatchs(page + 1);
      }
    };
    // Attach the event listener to the scroll event
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  useEffect(() => {
    if (searchTextIn) {
      const query = searchTextIn.toLowerCase();

      setInvoices(
        invoices.filter((product: any) => {
          // Convert all searchable properties to lowercase for case-insensitive search
          const searchableProperties = [
            "buyer.name",
            "invoice_number",
            "invoice_amount",
            "invoice_date",
          ];

          // Check if any of the properties contain the search query
          return searchableProperties.some((property) => {
            const properties = property.split("."); // Splitting the property string by '.'
            let value = product;
            for (const prop of properties) {
              value = value[prop]; // Accessing nested properties
              if (value === undefined || value === null) {
                break; // If any intermediate property is undefined or null, break the loop
              }
            }
            value = value?.toString().toLowerCase(); // Optional chaining to handle null or undefined values
            return value?.includes(query); // Optional chaining to handle null or undefined values
          });
        })
      );
    } else {
      setInvoices(batch?.invoices);
    }
  }, [searchTextIn]);

  const getVariant = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "secondary";
    }
  };




  return (
    <>
      <table className="batch-table-component">
        <thead>
          <tr>
            {headings.map((heading) => {
              if (batch?.status == "3" && heading.head == "Action") {

              } else {
                return (
                  <BatchDetailsTableTh
                    key={heading.head}
                    heading={heading}
                    sortingStates={sortingStates}
                    setSortingStates={setSortingStates}
                    moveToTop={moveToTop}
                    withSorting={true}
                  />
                )
              }
            }

            )}
          </tr>
        </thead>
        <tbody>
          {invoices?.map((invoice: Invoice, index: number) => (
            <tr
              key={index}
              className="link-wrapper"
              onClick={() => navigate("/dashboard/invoices/" + invoice?.id)}
            >
              {/*// onClick={() => navigate(detailLink("1"))}>*/}
              <div className="link-wrapper desktop-only">
                <td className="invoice-text">{invoice?.invoice_number}</td>
                {!isCollection && (
                  <td>
                    {moment(invoice?.invoice_date).format("DD MMM, YYYY")}
                  </td>
                )}

                <td>{invoice?.buyer?.name}</td>
                <td>₹{numberWithCommas(invoice?.invoice_amount || "0")}</td>
                {isCollection && (
                  <td>₹{numberWithCommas(invoice?.amount_received || "0")}</td>
                )}
                {isCollection && (
                  <td>
                    ₹
                    {numberWithCommas(
                      invoice?.amount_due
                    )}
                  </td>
                )}
                <td>
                  <BatchStatus
                    batchStatus={
                      invoice.status == "1"
                        ? "Pending"
                        : invoice.status == "2"
                          ? "Out for Delivery"
                          : invoice.status == "5"
                            ? "On Hold"
                            : invoice.status == "4"
                              ? "Completed"
                              : invoice.status == "3"
                                ? "Delivered"
                                : ""
                    }
                  />
                </td>
                {
                  batch?.status != "3" ? (
                    <td
                      onClick={(e) => {
                        // Stop propagation to prevent the event from reaching the <tr> element
                        e.stopPropagation();
                      }}
                    >
                      <Remove onClick={() => handleShowDelete(invoice)} />
                    </td>
                  ) : null
                }
              </div>
              <div
                className="link-wrapper mobile-only payment-row"
                style={{ position: "relative" }}
              >
                <div className="title-area" style={batch?.status != "3" ? { paddingRight: 40 } : {}}>
                  <div className="info">
                    <div className="d-flex flex-column align-items-stretch">
                      <div
                        className=" fw-medium"
                        style={{ color: "#0080FC", fontSize: "14px" }}
                      >
                        {invoice.invoice_number}
                      </div>
                      <div className="d-flex flex-column " >
                        <p className="fw-light" style={{ fontSize: "14px", margin: 0 }}>
                          {invoice?.buyer?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="btns">
                    <span className="">
                      <span className="edit-btn">
                        <BatchStatus
                          batchStatus={
                            invoice.status == "1"
                              ? "Pending"
                              : invoice.status == "2"
                                ? "Out for Delivery"
                                : invoice.status == "5"
                                  ? "On Hold"
                                  : invoice.status == "4"
                                    ? "Completed"
                                    : invoice.status == "3"
                                      ? "Delivered"
                                      : ""
                          }
                        />
                      </span>
                      {
                        batch?.status != "3" ? (
                          <span
                            className="delete-btn mobile-delete-button"
                            onClick={(e) => {
                              // Stop propagation to prevent the event from reaching the <tr> element
                              e.stopPropagation();
                            }}
                          >
                            <Remove onClick={() => handleShowDelete(invoice)} />
                          </span>
                        ) : null
                      }
                    </span>
                  </div>
                </div>

                <div className="payment-dcc">
                  <p>
                    <span className="block-title">Amount</span>
                    <span className="block-value">
                      ₹{numberWithCommas(invoice?.invoice_amount)}
                    </span>
                  </p>
                  <hr />
                  {!isCollection ? (
                    <p>
                      <span className="block-title">Date</span>
                      <span className="block-value">
                        {invoice?.invoice_date}
                      </span>
                    </p>
                  ) : (
                    <>
                      <p>
                        <span className="block-title">Payment</span>
                        <span className="block-value">
                          {invoice?.amount_received}
                        </span>
                      </p>
                      <hr />
                      <p>
                        <span className="block-title">Due Amount</span>
                        <span className="block-value">
                          ₹
                          {numberWithCommas(
                            invoice?.amount_due
                          )}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </tr>
          ))}
          {loading && (
            <tr className="loading-row">
              <LoadingTd cols={headings.length + (showCheckbox ? 1 : 0)} />
            </tr>
          )}
        </tbody>
      </table>
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header style={{ borderBottom: "0px" }}>
          <Modal.Title
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <CircleRed />
              <span style={{ marginLeft: "10px", marginTop: 24 }}>
                You are about to remove
              </span>
              <span style={{ marginLeft: "10px" }}>
                {selectedInvoice?.invoice_number} -{" "}
                {selectedInvoice?.buyer?.name}
              </span>
              <span style={{ marginLeft: "10px" }}>
                Are you sure you wish to delete?{" "}
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer className={"delete-modal-footer"}>
          <button
            className={"btn btn-secondary ms-2 px-4 cancel-delete-button"}
            onClick={handleCloseDelete}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>No</span>
          </button>
          <Button
            variant="primary"
            className={"conform-delete-button"}
            onClick={() =>
              selectedInvoiceId && handleDeleteInvoices(selectedInvoiceId)
            }
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modals for Edit and Delete actions */}
      {/* ... */}
    </>
  );
}
