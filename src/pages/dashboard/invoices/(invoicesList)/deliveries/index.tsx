import { useLogoutMutation } from "@/state/slices/authApiSlice";
import { useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import Invoice from "@/types/Invoice";
import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInvoicesListState } from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { set } from "react-hook-form";
import { boolean } from "yup";

export default function InvoiceDeliveries() {
  const { searchTxt, setSearchTxt } = useInvoicesListState();

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
      keyword: debouncedSearchTerm,
      page:1
    });

  }, [debouncedSearchTerm]);

  const [stateDataSorting, setStateDataSorting] = useState({ sortBy: "invoice_number", isAsc: true })
  const getinvoicesSortBy = (stateData: { sortBy: string, isAsc: boolean }) => {
    // // console.log(stateData)
    dispatch(clearState());
    setStateDataSorting(stateData)
    getInvoices({
      sort_by: stateData.sortBy,
      sort_order: stateData.isAsc ? "ASC" : 'DESC'
    });
  }

  useEffect(() => {
    // // console.log(invoicesState.lastPageReached, page);
    if (!invoicesState.lastPageReached && loadMoreTrigger)
      getInvoices({
        page: page + 1, keyword: searchTxt, sort_by: stateDataSorting.sortBy,
        sort_order: stateDataSorting.isAsc ? "ASC" : 'DESC'
      });
  }, [loadMoreTrigger]);


  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/login");
    }
  }, [isError]);

  // useEffect(() => {
  //   if (searchTxt !== "") dispatch(setInvoices([]));
  // }, [searchTxt]);
  const location = useLocation();

  useEffect(() => {
    if (invoices.length) {
      const scrollPosition = localStorage.getItem('scrollPosition');
      // console.log(scrollPosition);
      if (scrollPosition) {
        window.scrollTo({ top: parseInt(scrollPosition) });
        //localStorage.removeItem('scrollPosition');
      }
    }
  }, [invoices]);
  const { setBatchType } = useInvoicesListState();
  useEffect(() => {
    setBatchType(1)
  }, [setBatchType])
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
          setSearchTxt={setSearchTxt}
          loading={isLoading}
          loadMoreInvoices={() => setLoadMoreTrigger((i) => !i)}
          getinvoicesSortBy={getinvoicesSortBy}
        />
      </div>
    </>
  );
}
