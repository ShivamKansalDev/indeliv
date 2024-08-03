import "./invoice-detail.scss";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import { numberWithCommas } from "@/utils/helper";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import { useAppSelector } from "@/state/hooks";

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
  const [moreOpen, setMoreOpen] = useState(false);
  const productsRef = useRef<null | HTMLDivElement>(null);
  const detailsRef = useRef<null | HTMLDivElement>(null);
  const historyRef = useRef<null | HTMLDivElement>(null);
  const producst = useState<InvoiceItem[]>([]);
  const { goBackOrRedirect } = useGoBackOrRedirect();

  const { invoiceNo } = useParams();
  // const invoices = useAppSelector((state) => state.invoices.invoices);
  const [getInvoices, { data }] = useGetInvoicesMutation();
  const [invoice, setInvoice] = useState<Invoice>();
  const navigate = useNavigate();
  const invoices = data?.data;

  useEffect(() => {
    getInvoices({ keyword: invoiceNo });
  }, []);

  useEffect(() => {
    if (invoiceNo && invoices) {
      const idx = invoices.findIndex((i) => i.invoice_number === invoiceNo);
      if (idx === -1) navigate("/");
      else setInvoice(invoices[idx]);
    }
  }, [invoiceNo, invoices]);

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
  return (
    <div className="invoice-detail-page">
      <div className="header">
        <div className="header-left">
          <div className="back-link" onClick={() => goBackOrRedirect()}>
            <LeftArrow />
          </div>
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
            <p className="m-0 text-primary price">₹8,729.00</p>
          </div>
          <div className="info-card">
            <span className="text-14">Payments</span>
            <p className="m-0 price">₹8,729.00</p>
          </div>
          <div className="info-card">
            <span className="text-14 ">Balance Due</span>
            <p className="m-0 price">₹8,729.00</p>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="left-container">
          <ContentSection
            title={
              <div className="payments-count">
                Payment received <span>{payments.length}</span>
              </div>
            }
            className="payments-section"
          >
            <DataTable
              headings={[
                "Date",
                "ID#",
                "Associate",
                "Payment Method",
                "Amount",
              ]}
              data={payments.map((p) => ({ ...p, amount: `₹${p.amount}` }))}
              keys={["date", "id", "associate", "payment_method", "amount"]}
            />
          </ContentSection>
          <div ref={productsRef}>
            <ContentSection
              title="Product, Quantity & Price"
              className="products-section"
            >
              <DataTable
                headings={["#", "Item", "Qty", "Price"]}
                data={
                  invoice?.items?.map((p, i) => ({
                    ...p,
                    _i: String(i + 1).padStart(2, "0"),
                    price: `₹${numberWithCommas(p.price)}`,
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
                  value={d.value}
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
    </div>
  );
}
