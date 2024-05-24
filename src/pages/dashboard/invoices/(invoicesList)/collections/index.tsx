// import React, { useState } from "react";
// import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
// import Invoice from "@/types/Invoice";
// import {useLocation} from "react-router-dom";



// export default function Collections({invoiceMode}:CollectionsProps) {
//   const [invoices, setInvoices] = useState<Invoice[]>(initialData);
//   const location = useLocation();
//   let excluded_headers;
//   if(location?.pathname?.includes("batchs")){

//     if(invoiceMode){
//       excluded_headers = []
//     }
//     else{excluded_headers=["Date","Company"];}
//   }
//   return (
//     <>
//       <div className="">
//         <InvoiceTable
//           invoices={invoices}
//           setInvoices={setInvoices}
//           showCheckbox={(!location?.pathname?.includes("batchs") || !invoiceMode)?false:true}
//           excludedHeadings={excluded_headers}
//           invoiceMode={invoiceMode}
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

export const initialData: Invoice[] = [
  
];
interface CollectionsProps {
  invoiceMode?: boolean; // Use a more specific type instead of 'any' if possible
}

export default function Collections({invoiceMode}:CollectionsProps) {
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
      status: 3,
      keyword: debouncedSearchTerm,
      page:1
    });
    
  }, [debouncedSearchTerm]);

 




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
  const {setBatchType} = useInvoicesListState();
  useEffect(() => {
    if(typeof setBatchType === "function"){

      setBatchType(2)
    }
  },[setBatchType])
  const [stateDataSorting,setStateDataSorting] = useState({sortBy: "invoice_number",isAsc: true})
 const getinvoicesSortBy = (stateData:{sortBy:string,isAsc:boolean}) => {
  // // console.log(stateData)
  dispatch(clearState());
  setStateDataSorting(stateData)
  getInvoices({
   sort_by:stateData.sortBy,
   sort_order: stateData.isAsc ? "ASC" : 'DESC',
   status:3
  });
 }

  useEffect(() => {
    // // console.log(invoicesState.lastPageReached, page);
    if (!invoicesState.lastPageReached  && loadMoreTrigger)
      getInvoices({ status:3, page: page + 1, keyword: searchTxt,sort_by:stateDataSorting.sortBy,
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
