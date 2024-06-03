import "./delivery-details-table.scss";
import React, { useState, useEffect, useMemo, FormHTMLAttributes } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { useBatchsListState } from "../../../(batchsList)/layout";
import Batch, {
    batchDetailsHead,
    getKeyFromHead,
    deliveryDetailsHeadings,
    CollectionDetailsKeyHeadMap,
    collectionDetailsHeadings,
} from "@/types/BatchDetails";
import LoadingTd from "@/components/LoadingTd";
import { SortingDir } from "@/utils/enums";
import DeliveryDetailsTableTh from "./../DeliveryDetailsTableTh";
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
import { ReactComponent as Remove } from "../../../../../assets/svgs/remove.svg";
import { ReactComponent as New } from "../../../../../assets/svgs/new.svg";
// import { ReactComponent as Remove } from "../../../../../../assets/svgs/remove.svg";
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
import { useBatchsListState } from "@/pages/dashboard/batchs/(batchsList)/layout";
import { el } from "date-fns/locale";
import permissions from "@/ennum/permission";
export type SortingState = Record<
    batchDetailsHead["head"],
    {
        dir: SortingDir;
        optionsOpen: boolean;
    }
>;
interface AscendingState {
    [key: string]: "asc" | "desc" | null;
}
const getVariant = (status: string) => {
    switch (status) {
        case 'Ongoing':
            return 'warning';
        case 'Out for Delivery':
            return 'warning';
        case 'On Going':
            return 'warning';
        case 'On Hold':
            return 'danger';
        case 'Completed':
            return 'success';
        case 'Delivered':
            return 'success';
        default:
            return 'secondary';
    }
};
export function BatchStatusDelivery({ batchStatus }: { batchStatus: string }) {
    const styles = {
        success: {
            backgroundColor: "#ECFDF3",
            border: '1px solid #12B76A',
            color: '#12B76A'
        },
        warning: {
            backgroundColor: "#FFFAEB",
            color: '#FDB022',
            border: '1px solid rgba(253, 176, 34, 1)',
        },
        danger: {
            backgroundColor: "#FEF3F2",
            color: '#F97066',
            border: '1px solid #F97066',
        },
        secondary: {
            backgroundColor: '#F9FAFB',
            border: '1px solid #EAECF0',
            color: "#475467",
        },
    };
    const variant = getVariant(batchStatus).toLowerCase();
    // @ts-ignore
    const currentStyle = styles[variant] || {};

    return (
        <span style={currentStyle}
            className={`badge rounded-pill fw-medium d-inline-flex justify-content-center flex-column  batch-status align-middle batch-status-badge`}><span className="status_delivery">{batchStatus}</span></span>
    )
}
export default function DeliveryDetailsTable({
    batchs,
    showCheckbox,
    setBatchs,
    loading = false,
    loadMoreBatchs,
    excludedHeadings = ["Due", "Overdue By", "Date"],
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
    // //console.log(sortingStates, "--------")
    const [showEdit, setShowEdit] = useState(false);
    const params = useParams();
    const batchId = params?.id || "0";
    // const { data: batchDetails, refetch: refetchBatch } =
    //     useGetBatchDetailByIdQuery(params?.batchNo, {
    //         //skip: isNaN(batchId), // Skip the query if batchId is NaN
    //     });
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const [showDelete, setShowDelete] = useState(false);
    // const [getInvoices, { data, isError, isLoading, error }] = useGetInvoicesMutation();
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (invoice: Invoice) => {
        setSelectedInvoiceId(invoice?.id); // Set the currently selected invoice ID
        setSelectedInvoice(invoice); // Set the currently selected invoice ID
        setShowDelete(true); // Show the modal
    };
    const [batch, setBatch] = useState(batchs);
    const [invoices, setInvoices] = useState<any>(batch?.invoices.map((invoice: any, index: number) => ({ ...invoice, index: index + 1 })));
    const [sortStack, setSortStack] = useState<batchDetailsHead["head"][]>([]);
    const moveToTop = (value: batchDetailsHead["head"]) => {
        setSortStack((prevStack) => {
            const filteredStack = prevStack.filter((item) => item !== value);
            return [value, ...filteredStack];
        });
    };
    const [getBatchs] = useGetBatchsMutation();
    const [deleteInvoiceFromBatch] = useDeleteInvoiceFromBatchMutation();
    const [sort, setSort] = useState<boolean>(false)
    const handleDeleteInvoices = async (invoiceId: number) => {
        handleCloseDelete();
        loading = true;
        try {
            await deleteInvoiceFromBatch({
                batchId: batchs?.id || 0,
                invoiceIds: [invoiceId],
            }).unwrap();
            // refetchBatch();

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
        if (isCollection) {
            return collectionDetailsHeadings.filter(
                (heading) =>
                    heading.head !== ""
            );
        }
        else {
            return deliveryDetailsHeadings.filter(
                (heading) =>
                    !excludedHeadings.includes(heading.head) && heading.head !== ""
            );
        }
    }, [excludedHeadings]);

    useEffect(() => {
        if (batch?.invoices.length == 0) {
            navigate("/dashboard/batches/deliveries");
        }
        setInvoices(batch?.invoices);
    }, [batch]);

    // useEffect(() => {
    //     setBatch(batchDetails);
    // }, [batchDetails]);
    useEffect(() => {
        let data = batch?.invoices.map((invoice: any, index: number) => ({ ...invoice, index: index + 1 }));
        setInvoices(data)
    }, [batch?.invoices])

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
    const [ascending, setAscending] = useState<AscendingState>({});

    const sortData = (field: string, comparator: (a: any, b: any) => number) => {
        const order = ascending[field] === "asc" ? "desc" : "asc";
        const sortedData = [...invoices].sort(comparator);
        setAscending({
            ...ascending,
            [field]: order
        });
        return sortedData;
    };
    // console.log(sortingStates, invoices, "jhkh")
    useEffect(() => {
        const sortedData = sortData("Invoice No.", (a, b) => {
            const invoiceNumberA = isNaN(+a.invoice_number) ? a.invoice_number : +a.invoice_number;
            const invoiceNumberB = isNaN(+b.invoice_number) ? b.invoice_number : +b.invoice_number;

            if (invoiceNumberA === invoiceNumberB) return 0;

            return ascending?.["Invoice No."] === "asc" ?
                (isNaN(invoiceNumberA) || isNaN(invoiceNumberB) ?
                    a.invoice_number.localeCompare(b.invoice_number) :
                    invoiceNumberA - invoiceNumberB) :
                (isNaN(invoiceNumberA) || isNaN(invoiceNumberB) ?
                    b.invoice_number.localeCompare(a.invoice_number) :
                    invoiceNumberB - invoiceNumberA);
        });

        setInvoices(sortedData);
    }, [sortingStates?.["Invoice No."]?.dir]);

    useEffect(() => {
        const sortedData = sortData("Buyer", (a, b) => {
            return ascending["Buyer"] === "asc" ?
                a.buyer.name.localeCompare(b.buyer.name) :
                b.buyer.name.localeCompare(a.buyer.name);
        });
        setInvoices(sortedData);
    }, [sortingStates["Buyer"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("Status", (a, b) => {
            const amountA = parseFloat(a?.status);
            const amountB = parseFloat(b?.status);

            if (amountA === amountB) return 0;

            return ascending["Status"] === "asc" ?
                amountA - amountB :
                amountB - amountA;
        });
        setInvoices(sortedData);
    }, [sortingStates["Status"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("Amount", (a, b) => {
            const amountA = parseFloat(a.invoice_amount);
            const amountB = parseFloat(b.invoice_amount);

            if (amountA === amountB) return 0;

            return ascending["Amount"] === "asc" ?
                amountA - amountB :
                amountB - amountA;
        });
        setInvoices(sortedData);
    }, [sortingStates["Amount"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("Due", (a, b) => {
            const amountA = parseInt(numberWithCommas(a?.amount_due));
            const amountB = parseInt(numberWithCommas(b?.amount_due));

            if (amountA === amountB) return 0;

            return ascending["Due"] === "asc" ?
                amountA - amountB :
                amountB - amountA;
        });
        setInvoices(sortedData);
    }, [sortingStates["Due"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("Date", (a, b) => {
            const dateA = new Date(a?.invoice_date).getTime();
            const dateB = new Date(b?.invoice_date).getTime();

            if (dateA === dateB) return 0;

            return ascending["Date"] === "asc" ?
                dateA - dateB :
                dateB - dateA;
        });
        setInvoices(sortedData);
    }, [sortingStates["Date"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("Overdue By", (a, b) => {
            const amountA = getDaysDifference(new Date(a?.invoice_date), new Date());
            const amountB = getDaysDifference(new Date(b?.invoice_date), new Date());

            if (amountA === amountB) return 0;

            return ascending["Overdue By"] === "asc" ?
                amountA - amountB :
                amountB - amountA;
        });
        setInvoices(sortedData);
    }, [sortingStates["Overdue By"]?.dir && sort]);

    useEffect(() => {
        const sortedData = sortData("#", (a, b) => {
            const amountA = parseFloat(a?.index);
            const amountB = parseFloat(b?.index);

            if (amountA === amountB) return 0;

            return ascending["#"] === "asc" ?
                amountA - amountB :
                amountB - amountA;
        });
        setInvoices(sortedData);
    }, [sortingStates["#"]?.dir && sort ]);

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
    function getDaysDifference(invoiceDate: Date, currentDate: Date): number {
        // Calculate the difference in milliseconds
        const difference = currentDate.getTime() - invoiceDate.getTime();
        // Convert the difference to days
        const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        return daysDifference;
    }
    const redirectOtp = (item: any) => {
        // console.log(item,"------")
        if ((!isCollection && item?.status == "3") || item?.status == "4") {
            console.log("Delivered")
        } else {
            navigate(`${isCollection ? "/dashboard/collection/otp_hold/" : "/dashboard/delivery/otp_hold/"}` + item?.id)
        }
    }
    // console.log(sort, "kljljlkkjljlkj")
    return (
        <>
            <table className="batch-table-component-delivery">
                <thead>
                    <tr>
                        {headings.map((heading) => (
                            <DeliveryDetailsTableTh
                                key={heading.head}
                                heading={heading}
                                sortingStates={sortingStates}
                                setSortingStates={setSortingStates}
                                moveToTop={moveToTop}
                                withSorting={true}
                                setSort={setSort}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {invoices?.map((invoiceItem: any, index: number) => (
                        <tr
                            key={index}
                            className="link-wrapper-delivery p-0"
                            onClick={() => redirectOtp(invoiceItem)}
                        >
                            {/*// onClick={() => navigate(detailLink("1"))}>*/}
                            <div className="link-wrapper-delivery desktop-only-delivery ">
                                <td className="">{invoiceItem?.index}</td>
                                <td className="">
                                    {invoiceItem?.invoice_number}
                                    {/* {index == 0 && <span className="" style={{ paddingLeft: "6px" }}><New /></span>} */}
                                </td>
                                <td style={{ width: "25%" }}>{invoiceItem?.buyer?.name}</td>

                                {isCollection ? (
                                    <td>
                                        ₹{numberWithCommas(invoiceItem?.amount_due)}
                                    </td>)
                                    : <td>₹{numberWithCommas(invoiceItem.invoice_amount)}</td>
                                }
                                {isCollection && (
                                    <td>
                                        {moment(invoiceItem?.invoice_date).format("DD MMM, YYYY")}
                                    </td>
                                )}
                                {isCollection &&
                                    <td>{invoiceItem?.status == "4" ? "0" : getDaysDifference(new Date(invoiceItem?.invoice_date), new Date())} Days</td>
                                    // <td>{invoiceItem?.payments && invoiceItem.payments[0]?.created_at && Math.round((new Date().getTime() - new Date(invoiceItem.payments[0].created_at).getTime()) / (1000 * 60 * 60 * 24))} Days</td>
                                }
                                {isCollection && (
                                    <td>
                                        ₹{numberWithCommas(invoiceItem.invoice_amount)}
                                    </td>
                                )}
                                <td style={{ paddingRight: "24px" }}>
                                    <BatchStatusDelivery
                                        batchStatus={
                                            invoiceItem.status == "1"
                                                ? "Pending"
                                                : invoiceItem.status == "2"
                                                    ? "Ongoing"
                                                    : invoiceItem.status == "5"
                                                        ? "On Hold"
                                                        : invoiceItem.status == "3"
                                                            ? "Delivered"
                                                            : invoiceItem.status == "4"
                                                                ? "Completed"
                                                                : ""
                                        }
                                    />
                                </td>

                            </div>
                            {
                                batch?.associate?.role_name?.includes(permissions?.role_name) ?
                                    <div
                                        className="link-wrapper-delivery mobile-only-delivery payment-row-delivery"
                                        style={{ position: "relative" }}
                                    >
                                        <div className="title-area-delivery" style={{ padding: "12px" }}>
                                            <div className="info d-flex justify-content-between w-100">
                                                <div className="d-flex flex-column " >
                                                    <p className="labeL" style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
                                                        {invoiceItem?.buyer?.name}
                                                        {/* {index == 0 && <span className="" style={{ paddingLeft: "6px" }}><New /></span>} */}
                                                    </p>
                                                </div>
                                                <div
                                                    className="text-details"
                                                    style={{ fontSize: "12px", fontWeight: "400", color: "#667085" }}
                                                >
                                                    {invoiceItem.invoice_number}
                                                </div>
                                            </div>

                                        </div>

                                        <div
                                            className="payment-dcc-delivery d-flex justify-content-between"
                                            style={{ padding: "12px", background: "#F9FAFB", borderTop: "none" }}
                                        >
                                            <div className="p-0 m-0">
                                                <p className="block-title m-0 align-items-start" style={{ color: "#667085", fontWeight: "400", fontSize: "12px" }}>Amount</p>
                                                <p className="block-value m-0" style={{ fontSize: "12px", fontWeight: "500" }}>
                                                    ₹{numberWithCommas(invoiceItem?.invoice_amount)}
                                                </p>
                                            </div>
                                            {/* <hr /> */}
                                            <div className="btns p-0 m-0" >
                                                <span className="">
                                                    <span className="edit-btn">
                                                        <BatchStatusDelivery
                                                            batchStatus={
                                                                invoiceItem.status == "1"
                                                                    ? "Pending"
                                                                    : invoiceItem.status == "2"
                                                                        ? "Ongoing"
                                                                        : invoiceItem.status == "5"
                                                                            ? "On Hold"
                                                                            : invoiceItem.status == "3"
                                                                                ? "Delivered"
                                                                                : invoiceItem.status == "4"
                                                                                    ? "Completed"
                                                                                    : ""
                                                            }
                                                        />
                                                    </span>

                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div
                                            className=" link-wrapper-delivery mobile-only-delivery payment-row-delivery"
                                            style={{ position: "relative", padding: "12px 12px 0 12px" }}
                                        >
                                            <div className="title-area-delivery" style={{}}>
                                                <div className="  w-100">
                                                    <div className="row" >
                                                        <div
                                                            className="col-7 col-sm-8"
                                                            style={{ fontSize: "12px", fontWeight: "500", alignSelf: "center", color: "#210D4A" }}
                                                        >
                                                            {invoiceItem.invoice_number}
                                                        </div>
                                                        <div className="col-5 col-sm-4 text-end btns p-0 m-0" style={{ fontWeight: "500", fontSize: "12px" }}>
                                                            <span className="" style={{ marginRight: "12px" }}>
                                                                <span className="edit-btn">
                                                                    <BatchStatusDelivery
                                                                        batchStatus={
                                                                            invoiceItem.status == "1"
                                                                                ? "Pending"
                                                                                : invoiceItem.status == "2"
                                                                                    ? "Ongoing"
                                                                                    : invoiceItem.status == "5"
                                                                                        ? "On Hold"
                                                                                        : invoiceItem.status == "3"
                                                                                            ? "Delivered"
                                                                                            : invoiceItem.status == "4"
                                                                                                ? "Completed"
                                                                                                : ""
                                                                        }
                                                                    />
                                                                </span>

                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="row text-end" style={{ marginTop: "6px" }}>
                                                        <p className="col-7 col-sm-8 labeL m-0 text-start"
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: "400",
                                                                margin: 0,
                                                                padding: "0 12px",
                                                                color: "#210D4A"
                                                            }}>
                                                            {invoiceItem?.buyer?.name}
                                                            {/* {index == 0 && <span className="" style={{ paddingLeft: "6px" }}><New /></span>} */}
                                                        </p>

                                                        <div className="col-5 col-sm-4 d-flex justify-content-end align-self-center">
                                                            <p className="block-value m-0" style={{ fontWeight: "400", alignItems: "center", fontSize: "12px" }}>
                                                                ₹{numberWithCommas(invoiceItem?.invoice_amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="payment-dcc-delivery d-flex justify-content-between border_delivery_top"
                                                style={{ fontWeight: "400" }}
                                            >
                                                <div className="p-0 m-0 text-center">
                                                    <p className="block-title m-0 " style={{ fontSize: "12px", color: "#667085", fontWeight: "400" }}>Due</p>
                                                    <p className="p-0 m-0" style={{ color: "#210D4A", fontSize: "12px", fontWeight: "500" }}>₹{numberWithCommas(invoiceItem?.amount_due)}</p>
                                                </div>
                                                <hr />
                                                <div className="p-0 m-0 text-center">
                                                    <p className="block-title m-0 " style={{ fontSize: "12px", color: "#667085", fontWeight: "400" }}>Date</p>
                                                    <p className="p-0 m-0" style={{ color: "#210D4A", fontSize: "12px", fontWeight: "500" }}>{moment(invoiceItem?.invoice_date).format("DD MMM, YYYY")}</p>
                                                </div>
                                                <hr />
                                                <div className="p-0 m-0 text-center">
                                                    <p className="block-title m-0 " style={{ fontSize: "12px", color: "#667085", fontWeight: "400" }}>Overdue By</p>
                                                    <p className="p-0 m-0" style={{ color: "#210D4A", fontSize: "12px", fontWeight: "500" }}>{invoiceItem?.status == "4" ? "0" : getDaysDifference(new Date(invoiceItem?.invoice_date), new Date())} Days</p>
                                                    {/* <p className="p-0 m-0" style={{ color: "#210D4A", fontSize: "12px", fontWeight: "500" }}>{invoiceItem?.payments && invoiceItem.payments[0]?.created_at && Math.round((new Date().getTime() - new Date(invoiceItem.payments[0].created_at).getTime()) / (1000 * 60 * 60 * 24))} Days</p> */}
                                                </div>

                                            </div>
                                        </div>
                                    </>
                            }
                        </tr>
                    ))}
                    {/* {loading && (
                        <tr className="loading-row">
                            <LoadingTd cols={headings.length + (showCheckbox ? 1 : 0)} />
                        </tr>
                    )} */}
                </tbody>
            </table>

            {/* Modals for Edit and Delete actions */}
            {/* ... */}
        </>
    );
}
