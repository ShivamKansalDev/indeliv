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
import { useDeleteInvoicesMutation, useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import Invoice from "@/types/Invoice";
import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { useInvoicesListState } from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { set } from "react-hook-form";
import { ReactComponent as CircleRed } from "@/assets/svgs/delete-circle.svg";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";

export const initialData: Invoice[] = [

];
interface CollectionsProps {
  invoiceMode?: boolean; // Use a more specific type instead of 'any' if possible
}

export default function Collections({invoiceMode}:CollectionsProps) {
  const { searchTxt, setSearchTxt, fromDate, toDate, deleteInvoice, setDeleteInvoice, setShowDelete, showDelete } = useInvoicesListState();
  const [deleteInvoices, { data: invoiceData, error: invoiceError }]: any = useDeleteInvoicesMutation()

  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const invoicesState = useAppSelector((state) => state.invoices);
  const invoices = invoicesState.invoices;
  const page = invoicesState.page;

  const [getInvoices, { data, isError, isLoading, error }] =
    useGetInvoicesMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [collectionInvoices, setCollectionInvoices] = useState<any>([])
  const [checkedData, setCheckedData] = useState<Invoice[]>([]);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const locationm = useLocation();
  const handleCloseDelete = () => { setShowDelete(false); setDeleteInvoice(false);};

  useEffect(() => {

    dispatch(clearState());

  }, [locationm.pathname]);

  useEffect(() => {
    //setCheckedData(invoices.filter(v => v.checked === true))
    dispatch(clearState());
    fetchCollectionInvoices()

  }, [debouncedSearchTerm]);

  const fetchCollectionInvoices = async () => {
    const { data: { data } }: any = await getInvoices({
      status: 3,
      keyword: debouncedSearchTerm,
      page: 1,
      from: fromDate,
      to: toDate
    });
    setCollectionInvoices(data)
  }

  useEffect(() => {
    if (fromDate && toDate) {
      handleFilterInvoice()
    }
  }, [fromDate, toDate]);
  
  const handleFilterInvoice = async () => {
    dispatch(clearState());
    const { data: { data } }: any = await getInvoices({
      keyword: searchTxt ? searchTxt : '',
      to: toDate,
      from: fromDate
    });
    setCollectionInvoices(data)
  }

  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/");
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
 const getinvoicesSortBy = async (stateData:{sortBy:string,isAsc:boolean}) => {
    // // console.log(stateData)
    dispatch(clearState());
    setStateDataSorting(stateData)
    const { data: { data } }: any = await getInvoices({
      keyword: searchTxt ? searchTxt : '',
      sort_by: stateData.sortBy,
      from: fromDate ? fromDate : '',
      to: toDate ? toDate : '',
      sort_order: stateData.isAsc ? "ASC" : 'DESC',
      status: 3,
    });
    setCollectionInvoices(data)
  }

  const handleDelete = async () => {
    if(!checkedData?.length) {
      alert('Please select at least one invoice')
      return setShowDelete(false);
    }
    const { data, error }: any = await deleteInvoices(checkedData?.map((item) => item?.id));
  
    if (data?.message) {
      setCheckedData([]);
      dispatch(clearState());
      getInvoices({
        keyword: debouncedSearchTerm,
        page: 1,
        from: fromDate,
        to: toDate
      });
      setShowDelete(false);
    }
    if (error?.data?.message) {
      alert(error?.data?.message);
      setShowDelete(false);
    }
  
    setDeleteInvoice(false);
  };
  

  useEffect(() => {
    if(deleteInvoice) {
      if(!checkedData?.length) {
        alert('Please select at least one invoice')
        setDeleteInvoice(false)
        return setShowDelete(false);
      } else {
        setShowDelete(true)
      }
    }
  },[deleteInvoice])

  useEffect(() => {
    // // console.log(invoicesState.lastPageReached, page);
    if (!invoicesState.lastPageReached  && loadMoreTrigger)
      getInvoices({
        status: 3, page: page + 1, keyword: searchTxt, sort_by: stateDataSorting.sortBy,
        sort_order: stateDataSorting.isAsc ? "ASC" : 'DESC',
        from: fromDate,
        to: toDate
      });
      setCollectionInvoices(invoices)
  }, [loadMoreTrigger]);
  return (
    <>
      <div className="">
        <InvoiceTable
          invoices={[...checkedData, ...(collectionInvoices ?? [])].filter((obj, index, self) =>
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
                {`Are you sure you want to delete ${checkedData?.length} invoice${checkedData?.length > 1 ? 's' : ''}?`}
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
            onClick={handleDelete}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
}
