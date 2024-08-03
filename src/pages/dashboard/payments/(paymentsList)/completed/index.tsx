import Payment from "@/types/Payment";
import PaymentTable from "@/pages/dashboard/payments/(paymentsList)/components/paymentTable/PaymentTable";
import React, { useState } from "react";

// const initialData: Payment[] = [
//   {
//     id: 1,
//     payment_number: "AA",
//     payment_date: "20 Jan, 2023",
//     buyer_name: "AMoonstone Ventures LLP",
//     payment_method: "cash",
//     //buyer_address: "test",
//     //contact_number: "00",
//     tally_company: "SS Sales",
//     collected_by: "xyz",
//     payment_amount: "8729.00",
//     //created_at: "",
//     //updated_at: "",
//     //items: [],
//   },
//   {
//     id: 1,
//     payment_number: "AB",
//     payment_date: "20 Jan, 2023",
//     buyer_name: "BMoonstone Ventures LLP",
//     payment_method: "cash",
//     //buyer_address: "test",
//     //contact_number: "00",
//     tally_company: "SS Sales",
//     collected_by: "xyz",
//     payment_amount: "7729.00",
//     //created_at: "",
//     //updated_at: "",
//     //items: [],
//   },
//   // {
//   //   id: 1,
//   //   payment_number: "AB",
//   //   payment_date: "20 Jan, 2023",
//   //   buyer_name: "CMoonstone Ventures LLP",
//   //   buyer_address: "test",
//   //   contact_number: "00",
//   //   tally_company: "SS Sales",
//   //   payment_amount: "6729.00",
//   //   created_at: "",
//   //   updated_at: "",
//   //   items: [],
//   // },
//   // {
//   //   id: 1,
//   //   payment_number: "AA",
//   //   payment_date: "20 Jan, 2023",
//   //   buyer_name: "Moonstone Ventures LLP",
//   //   buyer_address: "test",
//   //   contact_number: "00",
//   //   tally_company: "SS Sales",
//   //   payment_amount: "8729.00",
//   //   created_at: "",
//   //   updated_at: "",
//   //   items: [],
//   // },
// ];

export default function Completed() {
  const [payments, setPayments] = useState<Payment[]>([]);
  return (
    <>
      <div className="">
        <PaymentTable
          payments={payments}
          setPayments={setPayments}
          showCheckbox={false}
        />
      </div>
    </>
  );
}
