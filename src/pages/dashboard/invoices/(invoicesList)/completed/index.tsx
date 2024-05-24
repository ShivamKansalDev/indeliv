// import Invoice from "@/types/Invoice";
// import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
// import React, { useState } from "react";

// const initialData: Invoice[] = [
//   {
//     id: 1,
//     invoice_number: "AA",
//     invoice_date: "20 Jan, 2023",
//     buyer_name: "AMoonstone Ventures LLP",
//     buyer_address: "test",
//     contact_number: "00",
//     tally_company: "SS Sales",
//     invoice_amount: "8729.00",
//     created_at: "",
//     updated_at: "",
//     items: [],
//     company_name:"",
//     due: ""
//   },
//   {
//     id: 1,
//     invoice_number: "AB",
//     invoice_date: "20 Jan, 2023",
//     buyer_name: "BMoonstone Ventures LLP",
//     buyer_address: "test",
//     contact_number: "00",
//     tally_company: "SS Sales",
//     invoice_amount: "7729.00",
//     created_at: "",
//     updated_at: "",
//     items: [],
//     company_name:"",
//     due: ""
//   },
//   {
//     id: 1,
//     invoice_number: "AB",
//     invoice_date: "20 Jan, 2023",
//     buyer_name: "CMoonstone Ventures LLP",
//     buyer_address: "test",
//     contact_number: "00",
//     tally_company: "SS Sales",
//     invoice_amount: "6729.00",
//     created_at: "",
//     updated_at: "",
//     items: [],
//     company_name:"",
//     due: ""
//   },
//   {
//     id: 1,
//     invoice_number: "AA",
//     invoice_date: "20 Jan, 2023",
//     buyer_name: "Moonstone Ventures LLP",
//     buyer_address: "test",
//     contact_number: "00",
//     tally_company: "SS Sales",
//     invoice_amount: "8729.00",
//     created_at: "",
//     updated_at: "",
//     items: [],
//     company_name:"",
//     due: ""
//   },
// ];

// export default function Completed() {
//   const [invoices, setInvoices] = useState<Invoice[]>(initialData);
//   return (
//     <>
//       <div className="">
//         <InvoiceTable
//           invoices={invoices}
//           setInvoices={setInvoices}
//           showCheckbox={false}
//         />
//       </div>
//     </>
//   );
// }

















import { useLogoutMutation } from "@/state/slices/authApiSlice";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import Invoice from "@/types/Invoice";
import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { useInvoicesListState } from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { set } from "react-hook-form";

export default function Completed() {
  const { searchTxt } = useInvoicesListState();

  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const invoicesState = useAppSelector((state) => state.invoices);
  const invoices = invoicesState.invoices;
  const page = invoicesState.page;

  const [getInvoices, { data, isError, isLoading, error }] =
    useGetInvoicesMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [checkedData, setCheckedData] = useState<Invoice[]>([]);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const locationm = useLocation();

  useEffect(() => {
  
      dispatch(clearState());

  }, [locationm.pathname]);

  useEffect(() => {
    //setCheckedData(invoices.filter(v => v.checked === true))
    getInvoices({
      status: 4,
      keyword: debouncedSearchTerm,
      page:1
    });
    
  }, [debouncedSearchTerm]);

 

  // useEffect(() => {
  //   // console.log(invoicesState.lastPageReached, page);
  //   if (!invoicesState.lastPageReached  && loadMoreTrigger)
  //     getInvoices({status: 4, page: page + 1, keyword: searchTxt });
  // }, [loadMoreTrigger]);


  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/login");
    }
  }, [isError]);

  // useEffect(() => {
  //   if (searchTxt !== "") dispatch(setInvoices([]));
  // }, [searchTxt]);
  const location=useLocation();

  useEffect(() => {
    if (invoices.length) {
      const scrollPosition = localStorage.getItem('scrollPosition');
      // // console.log(scrollPosition);
      if (scrollPosition) {
        window.scrollTo({top:parseInt(scrollPosition)} );
        //localStorage.removeItem('scrollPosition');
      }
    }
  }, [invoices]);
  const [stateDataSorting,setStateDataSorting] = useState({sortBy: "invoice_number",isAsc: true})
  const getinvoicesSortBy = (stateData:{sortBy:string,isAsc:boolean}) => {
  //  // console.log(stateData)
   dispatch(clearState());
   setStateDataSorting(stateData)
   getInvoices({
    sort_by:stateData.sortBy,
    sort_order: stateData.isAsc ? "ASC" : 'DESC',
    status:4
   });
  }
 
   useEffect(() => {
    //  // console.log(invoicesState.lastPageReached, page);
     if (!invoicesState.lastPageReached  && loadMoreTrigger)
       getInvoices({ status:4, page: page + 1, keyword: searchTxt,sort_by:stateDataSorting.sortBy,
         sort_order: stateDataSorting.isAsc ? "ASC" : 'DESC' });
   }, [loadMoreTrigger]);
  return (
    <>
      <div className="">
        <InvoiceTable
        invoices={[...checkedData, ...(invoices ?? [])].filter((obj, index, self) => 
          index === self.findIndex((t) => (
              t.id === obj.id
          ))
      )}
      setCheckedData={setCheckedData}
      checkedData={checkedData}
          setInvoices={(i) => dispatch(setInvoices(i))}
          showCheckbox={true}
          loading={isLoading}
          loadMoreInvoices={() => setLoadMoreTrigger((i) => !i)}
          getinvoicesSortBy={getinvoicesSortBy}
        />
      </div>
    </>
  );
}
