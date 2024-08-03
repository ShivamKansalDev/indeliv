import "./batch-table.scss";
import { useState, useEffect, useMemo, FormHTMLAttributes } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBatchsListState } from "../../layout";
import Batch, {
  batchHead,
  getKeyFromHead,
  batchHeadings,
  batchKeyHeadMap,
} from "@/types/Batch";
import LoadingTd from "@/components/LoadingTd";
import { SortingDir } from "@/utils/enums";
import BatchTableTh from "../BatchTableTh";
import { formatDate, formatTime, numberWithCommas } from "@/utils/helper";
import { useAppSelector } from "@/state/hooks";
import {
  BatchAvatar,
  BatchProgress,
  BatchStatus,
  BatchAvatarMobile,
} from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchUtils";

export type SortingState = Record<
  batchHead["head"],
  {
    dir: SortingDir;
    optionsOpen: boolean;
  }
>;

export default function BatchTable({
  batchs,
  showCheckbox,
  setBatchs,
  loading = false,
  loadMoreBatchs,
  excludedHeadings = ["Due", "Overdue By"],
  getBatchSortBy
}: {
  batchs: Batch[];
  showCheckbox?: boolean;
  setBatchs: (batchs: Batch[]) => void;
  getBatchSortBy?: (stateData: { sortBy: string, isAsc: boolean }) => void;
  loading?: boolean;
  loadMoreBatchs?: (page: number) => void;
  excludedHeadings?: batchHead["head"][];
}) {
  const batchsState = useAppSelector((state) => state.batchs);
  const page = batchsState.page;
  // state for saving current state of batchs after sorting
  // const [sortedBatchs, setSortedBatchs] = useState(batchs);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // State for saving sorting states of table headigns
  //const [sortingStates, setSortingStates] = useState<SortingState>({});
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const [sortStack, setSortStack] = useState<batchHead["head"][]>([]);

  const [sortedBatch, setSortedBatch] = useState<[]>([]);


  const moveToTop = (value: batchHead["head"]) => {
    setSortStack((prevStack) => {
      const filteredStack = prevStack.filter((item) => item !== value);
      return [value, ...filteredStack];
    });
  };
  const totalAmountOnBatch = (batchId: number) => {
    const batch = batchs.find((b) => b.id === batchId);

    // If the batch is found and it has invoices, sum their amounts
    if (batch && batch?.invoices) {
      return lastSegment.includes("collections") ?
        batch?.total_amount :
        batch?.invoices
          ?.reduce((total, invoice) => total + Number(invoice?.invoice_amount), 0)
          .toString();
    }

    // If the batch is not found or there are no invoices, return 0
    return "0";
  };
  const detailLink = (batch: Batch): string => {
    if (lastSegment.includes("collections")) {
      return `/dashboard/batches/collections/${batch.batch_number}/${batch.id}`;
    }
    return `/dashboard/batch/${batch.batch_number}/${batch.id}`;
  };
  // Getting state coming from parent <Outlet />
  const { setSelectedCount } = useBatchsListState();

  // Creating headings from batchHeadings excluding excludedHeadings
  const headings = useMemo(() => {
    return batchHeadings.filter(
      (heading) =>
        !excludedHeadings.includes(heading.head) && heading.head !== ""
    );
  }, [excludedHeadings]);

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

  // // Sorting Batchs whenever sortingStates changes
  // useEffect(() => {
  //   const sortData = (a: Batch, b: Batch): number => {
  //     for (let i = 0; i < sortStack.length; i++) {
  //       const prop = getKeyFromHead(sortStack[i]);
  //       if (prop) {
  //         const heading = batchKeyHeadMap[prop]?.head;
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
  //   console.log(sortingStates);
  //   setBatchs([...batchs].sort(sortData));
  // }, [sortingStates]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    const updatedBatchs = batchs.map((batch) => ({
      ...batch,
      checked: checked,
    }));

    setBatchs(updatedBatchs);
    // setSortedBatchs(updatedSortedBatchs);
  };

  // handing checkbox changed action to update current batchs and parent ones
  // const handleCheckboxChange = (batch_number: string) => {
  //   const newBatchs = [...batchs];
  //   const fIndex = batchs.findIndex(
  //     (i) => i.batch_number === batch_number
  //   );
  //   const curBatch = { ...newBatchs[fIndex] };
  //   if (curBatch.checked && selectAllChecked) {
  //     setSelectAllChecked(false);
  //   }
  //   newBatchs.splice(fIndex, 1, {
  //     ...curBatch,
  //     checked: !curBatch.checked,
  //   });
  //
  //   setBatchs(newBatchs);
  // };

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

  let headingCollection = headings;
  if (location.pathname.includes("collections")) {
    headingCollection = headings.filter((x) => x.head !== "Vehicle type");
  }
  const [sortingStates, setSortingStates] = useState({ sortBy: "", isAsc: true });
  useEffect(() => {
    if (sortingStates.sortBy) {
      getBatchSortBy?.(sortingStates)
    }
  }, [sortingStates])


  // Sorting Batches -> Completed will be last 
  useEffect(() => {
    const sortedBatch = batchs.sort((a: any, b: any) => a.status - b.status);
    setSortedBatch(sortedBatch as any);
  }, [batchs])
  return (
    <>
      <table className="batch-table-component">
        <thead>
          <tr>
            {headingCollection.map((heading) => (
              <BatchTableTh
                key={heading.head}
                heading={heading}
                setSortingStates={setSortingStates}
                moveToTop={moveToTop}
                withSorting={true}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedBatch.map((batch: Batch, index: number) => (
            // const isLastRow = index === array.length - 1;
            <tr
              key={index}
              className="link-wrapper bg-white"
              onClick={() => navigate(detailLink(batch))}
            >
              <Link
                to={
                  lastSegment.includes("collections")
                    ? `/dashboard/batches/collections/${batch.batch_number}/${batch.id}`
                    : `/dashboard/batch/${batch.batch_number}/${batch.id}`}
                // to={`/dashboard/batch/${batch.batch_number}/${batch.id}`}
                className="link-wrapper desktop-only">
                <td className="avatar-status">
                  <BatchAvatar
                    avatar={batch?.associate}
                    name={batch?.associate?.name}
                    id={batch.batch_number}
                    time={formatTime(batch?.updated_at)}
                  ></BatchAvatar>

                </td>
                {location.pathname.includes("deliveries") && (
                  <td className="vehicle-type">
                    {batch?.vehicle?.vehicle_type || "--"}
                  </td>
                )}
                {/* {location.pathname.includes("batches/collections") && (
                  <td className="amount">₹{numberWithCommas("17458")}</td>
                )}
                {!location.pathname.includes("batches/collections") && ( */}
                <td className="amount">
                  ₹{numberWithCommas(totalAmountOnBatch(batch?.id))}
                </td>
                {/* )} */}
                <td>
                  {/*<BatchStatus batchStatus={batch?.associate != null ? "Ongoing" : "Unassigned"}/>*/}
                  <BatchStatus
                    batchStatus={
                      batch.status == "1" ? "Unassigned" : batch.status == "2" ? "Ongoing" : batch.status == "3" ? "Completed" : ""
                    }
                  />
                </td>
                <td className="progress-indicator">
                  <BatchProgress
                    // ((batch.complete_invoices ?? 0) + (batch.delivered_invoices ?? 0)) #logic for completed count
                    batchStatus={
                      batch.status == "1" ? "Unassigned" : batch.status == "2" ? "Ongoing" : batch.status == "3" ? "Completed" : ""
                    }
                    completedCount={
                      lastSegment === 'collections' ?
                        ((batch.attempted_invoices_without_product_returns ?? 0) ?? 0) :
                        lastSegment === 'deliveries' ? (((batch.complete_invoices ?? 0) + (batch.delivered_invoices ?? 0)) ?? 0)
                          : 0
                    }
                    totalCount={batch.total_invoices ?? 0}
                    type={lastSegment}
                  />
                </td>
              </Link>
              <div
                className="link-wrapper mobile-only payment-row"
                onClick={() => navigate(detailLink(batch))}
              >
                <div className="title-area">
                  <div className="info">
                    <BatchAvatarMobile
                      avatar={batch?.associate}
                      name={batch?.associate?.name}
                      id={batch.batch_number ?? 0}
                      time={formatTime(batch?.updated_at)}
                      vehicle={batch?.vehicle?.vehicle_type}
                      amount={numberWithCommas(totalAmountOnBatch(batch?.id))}
                      status={batch?.associate?.name ? "Ongoing" : "Unassigned"}
                    ></BatchAvatarMobile>
                  </div>
                  <div className="btns">
                    <span className="payments_btns mobile">
                      <span className="">
                        <BatchStatus
                          batchStatus={
                            batch.status == "1" ? "Unassigned" : batch.status == "2" ? "Ongoing" : batch.status == "3" ? "Completed" : ""
                          }
                        />
                      </span>
                    </span>
                  </div>
                </div>

                <div
                  className={`link-wrapper ${!batch?.associate?.name ? "desktop-only" : ""
                    }`}
                >
                  <div className="payment-dcc">
                    <p>
                      <span className="block-title">Assigned At</span>
                      <span className="block-value">{formatTime(batch?.updated_at)}</span>
                    </p>
                    <hr />
                    <p>
                      <span className="block-title">Total Amount</span>
                      <span className="block-value">
                        ₹
                        {numberWithCommas(totalAmountOnBatch(batch?.id) || "0")}
                      </span>
                    </p>
                  </div>
                  <div
                    style={{
                      height: "50px",
                      backgroundColor: "#F9FAFB",
                      width: "calc(100% + 24px)",
                      marginLeft: "-12px",
                      marginBottom: "-12px",
                      padding: "12px",
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      border: '1px solid #eaecf0',
                      borderTop: 0,
                      borderRightColor: "transparent",
                      borderLeftColor: "transparent",
                      background: '#F2F3F5'
                    }}
                  >
                    <BatchProgress
                      batchStatus={
                        batch.status == "1" ? "Unassigned" : batch.status == "2" ? "Ongoing" : batch.status == "3" ? "Completed" : ""
                      }
                      completedCount={
                        lastSegment === 'collections' ?
                          ((batch.attempted_invoices_without_product_returns ?? 0) ?? 0) :
                          lastSegment === 'deliveries' ? (((batch.complete_invoices ?? 0) + (batch.delivered_invoices ?? 0)) ?? 0)
                            : 0
                      }
                      totalCount={batch.total_invoices ?? 0}
                      type={lastSegment}
                    />
                  </div>
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
      {!loading && <span className="batchlist-table-footer">End of the list</span>}

      {/* Modals for Edit and Delete actions */}
      {/* ... */}
    </>
  );
}
