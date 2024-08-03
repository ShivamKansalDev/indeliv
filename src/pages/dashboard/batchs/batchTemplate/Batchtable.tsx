import React from "react";
import "./batch-print-table.scss";

const Btable = React.forwardRef(
  (props: any, ref: React.Ref<HTMLDivElement>) => {
    const setTime = new Date(props?.batchData.updated_at).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    return (
      <div className="invoice-table" ref={ref}>
        <tr className="header-table">
          <td>Batch: {props?.batchData?.batch_number}</td>
          <td>Time: {setTime}</td>
          <td>Assigned To: {props?.batchData?.associate?.name}</td>
          <td>Assigned By: {props?.batchData?.assignee?.name}</td>
        </tr>

        <table className="buyer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Buyer</th>
              <th>Invoice No.</th>
              <th>Amount</th>
              <th>✓</th>
            </tr>
          </thead>
          <tbody>
            {props?.batchData?.invoices?.map((invoice: any, index: number) => (
              <tr key={invoice.id}>
                <td>{Number(index) + 1}</td>
                <td>{invoice.buyer.name}</td>
                <td>{invoice.invoice_number}</td>
                <td>
                  ₹{" "}
                  {Number(invoice.invoice_amount) % 1 === 0
                    ? Number(invoice.invoice_amount).toFixed(0)
                    : Number(invoice.invoice_amount).toFixed(2)}
                </td>
                <td className="check-column"></td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ fontWeight: "bolder" }}>
                Total :
              </td>
              <td style={{ fontWeight: "bolder" }}>
                <span className="amount-container">
                  <span className="rupee-sign">₹</span>
                  <span className="amount">
                    {props?.batchData?.invoices?.reduce(
                      (acc: any, cur: any) => {
                        return acc + Number(cur.invoice_amount);
                      },
                      0
                    )}
                  </span>
                </span>
              </td>

              <td></td>
            </tr>
          </tbody>
        </table>

        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>✓</th>
            </tr>
          </thead>
          <tbody>
            {props?.batchData?.invoice_items?.map(
              (item: any, index: number) => {
                return (
                  <tr key={item.item_id}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td>
                      {Number(item?.total_quantity) % 1 === 0
                        ? Number(item?.total_quantity).toFixed(0)
                        : Number(item?.total_quantity).toFixed(2)}{" "}
                      Units
                    </td>
                    <td></td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

export default Btable;
