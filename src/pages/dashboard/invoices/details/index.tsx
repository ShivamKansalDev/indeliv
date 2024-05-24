import "./invoice-detail.scss";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ContentSection from "./components/content-section/ContentSection";
import { ReactComponent as LeftArrow } from "@/assets/svgs/left-arrow.svg";
import DataTable from "./components/data-table/DataTable";
import { Payment, PaymentMethods } from "@/types/InvoiceDetail";
import DetailLine from "./components/detail-line/DetailLine";
import HistoryLine from "./components/history-line/HistoryLine";
import { MoreVertical } from "lucide-react";
import {
  LegacyRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Invoice, { InvoiceItem } from "@/types/Invoice";
import { useGetInvoiceDetailsQuery } from "@/state/slices/invoices/invoicesApiSlice";
import { formatDate, numberWithCommas } from "@/utils/helper";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import { useAppSelector } from "@/state/hooks";
import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";
import { number } from "yup";

const payments: Payment[] = [
  {
    date: "20 Jan, 2023",
    id: "DD235",
    associate: "Vijay Kumar",
    payment_method: PaymentMethods.Cash,
    amount: "8,729.00",
  },
  {
    date: "20 Jan, 2023",
    id: "DD265",
    associate: "Kiran",
    payment_method: PaymentMethods.Cash,
    amount: "8,729.00",
  },
];

export default function InvoiceDetail() {
  const invoiceState = useAppSelector((state) => state.invoices);
  const [moreOpen, setMoreOpen] = useState(false);
  const productsRef = useRef<null | HTMLDivElement>(null);
  const detailsRef = useRef<null | HTMLDivElement>(null);
  const historyRef = useRef<null | HTMLDivElement>(null);
  const producst = useState<InvoiceItem[]>([]);
  const { goBackOrRedirect } = useGoBackOrRedirect();
  const { invoiceNo } = useParams();

  const [searchParams] = useSearchParams();

  const hidebackbutton = searchParams.get("hidebackbutton");
  const { data: invoiceData, isLoading, refetch } = useGetInvoiceDetailsQuery(
    invoiceNo,
    {
      // skip: isNaN(invoiceNo), // Skip the query if batchId is NaN
    }
  );
  // const invoices = useAppSelector((state) => state.invoices.invoices);

  const [invoice, setInvoice] = useState<any>();
  const navigate = useNavigate();
  //const invoices = data?.data;
  const invoices = invoiceState?.invoices;

  // useEffect(() => {
  //   getInvoices({ keyword: invoiceNo });
  // }, []);
  // const [getInvoiceDetails, { data, isError, isLoading, error }] =
  // useGetInvoiceDetailsMutation();
  // const getInvoiceDetailsFetch = async () => {
  //   const res = await getInvoiceDetails({id:invoiceNo}).unwrap();
  //   setInvoice(res);
  // }

  function getDaysDifference(invoiceDate: Date, currentDate: Date): number {
    // Calculate the difference in milliseconds
    const difference = currentDate.getTime() - invoiceDate.getTime();
    // Convert the difference to days
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  useEffect(() => {
    refetch()
    setInvoice(invoiceData);
  }, [invoiceData, invoiceNo]);
  const dueBalanceCal = (tm: any, pr: any): string => {
    const invoiceAmount = parseInt(tm);
    const paymentReceived = parseInt(pr);
    return String(invoiceAmount - paymentReceived);
  };
  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const details = [
    {
      icon: "/assets/Icon/Date.svg",
      title: "Date",
      value: "20 Jan, 2024",
    },
    {
      icon: "/assets/image/calendar.svg",
      title: "Overdue By",
      value: "10 Days",
    },
    {
      icon: "/assets/Icon/Address.svg",
      title: "Address",
      value: "c/o Biotech",
    },
    {
      icon: "/assets/Icon/OTP Number.svg",
      title: "OTP Number",
      value: <a href="tel:+91 7836067476">+91 7836067476</a>,
      className: "tel",
    },
  ];

  const dataList = [
    {
      title: "Tally to indeliv",
      timestamp: "20 Jan, 2024 , 6:00am",
      imagePath: "/assets/Icon/Tally.svg",
    },
    {
      title: "Tally to indeliv",
      timestamp: "20 Jan, 2024 , 6:00am",
      imagePath: "/assets/Icon/Cube.svg",
    },
    {
      title: "Invoice removed from Batch 110012 by Vidya",
      timestamp: "20 Jan, 2024 , 6:00am",
      imagePath: "/assets/Icon/Minus.svg",
    },
  ];
  function convertDateFormat(dateString: string): string {
    const dateObj = new Date(dateString);
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
  return (
    <div className="invoice-detail-page">
      {/* {isLoading && (
             
           
           
          )} */}
      <div className="header">
        <div className="header-left">
          {
            !hidebackbutton ? (
              <div className="back-link" onClick={() => goBackOrRedirect()}>
                <LeftArrow />
              </div>
            ) : null
          }

          <span className="text-12">{invoice?.invoice_number}</span>
          <span className="dash"></span>
          <span className="text-primary text-16 text-12">
            {invoice?.buyer.name}
          </span>
          <div
            onClick={() => setMoreOpen((o) => !o)}
            className={`more ${moreOpen && "open"}`}
          >
            <MoreVertical />
            <div className="more-menu">
              <div onClick={() => scrollTo(productsRef)}>
                Product, Quantity & Price
              </div>
              <div onClick={() => scrollTo(detailsRef)}>Details</div>
              <div onClick={() => scrollTo(historyRef)}>History</div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="info-card">
            <span className="text-14">Total Amount</span>
            <p className="m-0 text-primary price">
              ₹{numberWithCommas(invoice?.invoice_amount)}
            </p>
          </div>
          <div className="info-card">
            <span className="text-14">Payments</span>
            <p className="m-0 price">
              ₹{numberWithCommas(invoice?.amount_received)}
            </p>
          </div>
          <div className="info-card">
            <span className="text-14 ">Balance Due</span>
            <p className="m-0 price">
              ₹
              {numberWithCommas(invoice?.amount_due)}
            </p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <Loading />
        </div>
      ) : (
        <div className="content">
          <div className="left-container">
            <ContentSection
              title={
                <div className="payments-count">
                  Payment received <span>{invoice?.payments.length}</span>
                </div>
              }
              className="payments-section"
            >
              <div className="desktop-only">
                <DataTable
                  headings={[
                    "Date",
                    "ID#",
                    "Associate",
                    "Payment Method",
                    "Amount",
                  ]}
                  data={invoice?.payments}
                  keys={["updated_at", "id", "user.name", "method", "amount"]}
                />
              </div>
              <div className="mobile-only">
                {
                  invoice?.payments?.map((v: any) => (
                    <div className="payments-section-item">
                      <div>
                        <p>ID# {v.id}</p>
                        <p className="assname">{v.user?.name} <span>(Associate)</span></p>
                      </div>
                      <div>
                        <p className="date">{convertDateFormat(v.updated_at)}</p>
                        <p>₹{v.amount} <span>({v.method})</span></p>
                      </div>
                    </div>
                  ))
                }

              </div>
            </ContentSection>
            <div ref={productsRef}>
              <ContentSection
                title="Product, Quantity & Price"
                className="products-section"
              >
                <DataTable
                  headings={["#", "Item", "Qty", "Price"]}
                  data={
                    invoice?.items?.map((p: any, i: any) => ({
                      ...p,
                      _i: String(i + 1).padStart(2, "0") + ".",
                      price: `₹${numberWithCommas(p.unit_price)}`,
                      quantity: Math.floor(p.quantity)
                    })) ?? []
                  }
                  keys={["_i", "item_name", "quantity", "price"]}
                  options={{ smallPadding: true }}
                />
              </ContentSection>
            </div>
          </div>
          <div className="right-container">
            <div ref={detailsRef}>
              <ContentSection
                className="details-section"
                title="Details"
                shadow={false}
              >
                {details.map((d) => (
                  <DetailLine
                    key={d.title}
                    icon={d.icon}
                    title={d.title}
                    value={d.title == "Date" ? formatDate(invoice?.invoice_date) : d.title == "Address" ? invoice?.buyer.address : d.title == "OTP Number" ? invoice?.buyer.phone : d.title == "Overdue By" ? getDaysDifference(new Date(invoice?.invoice_date), new Date()) + " Days" : d.value}
                    className={d.className}
                  />
                ))}
              </ContentSection>
            </div>
            <div ref={historyRef}>
              <ContentSection
                title="History"
                shadow={false}
                className="history-section"
              >
                {dataList.map((item, index) => (
                  <HistoryLine
                    title={item.title}
                    icon={item.imagePath}
                    timestamp={item.timestamp}
                  />
                ))}
              </ContentSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
