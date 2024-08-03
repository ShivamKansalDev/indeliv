import React, { useState } from "react";
import PaymentTable from "@/pages/dashboard/payments/(paymentsList)/components/paymentTable/PaymentTable";
import Payment from "@/types/Payment";

// const initialData: Payment[] = [
//   {
//     id: 1,
//     payment_number: "A114455",
//     payment_date: "20 Jan, 2023",
//     buyer_name: "Moonstone Ventures LLP",
//     //buyer_address: "test",
//     //contact_number: "00",
//     tally_company: "Somya Sales",
//     collected_by: "xyz",
//     payment_amount: "8729.00",
//     payment_method: "Cash",
//     //due: "₹10,700.00",
//     //overdueBy: "36 Days",
//     //checked: false,
//     //created_at: "",
//     //updated_at: "",
//    // items: [],
//   },
// ];

export default function Collections() {
  const [payments, setPayments] = useState<Payment[]>([]);
  return (
    <>
      <div className="">
        <PaymentTable
          payments={payments}
          setPayments={setPayments}
          showCheckbox={true}
          excludedHeadings={[]}
        />
      </div>
    </>
  );
}
