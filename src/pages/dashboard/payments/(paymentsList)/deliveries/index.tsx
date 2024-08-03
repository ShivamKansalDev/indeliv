import { useLogoutMutation } from "@/state/slices/authApiSlice";
import { useGetPaymentsMutation, useEditPaymentMutation, useDeletePaymentMutation } from "@/state/slices/payments/paymentsApiSlice";
import Payment from "@/types/Payment";
import PaymentTable from "@/pages/dashboard/payments/(paymentsList)/components/paymentTable/PaymentTable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePaymentsListState } from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import { clearState, setPayments } from "@/state/slices/payments/paymentsSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { set } from "react-hook-form";

export default function Deliveries() {
  const { searchTxt,from,to,showAddPaymentModal, setShowAddPaymentModal } = usePaymentsListState();
  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const paymentsState = useAppSelector((state) => state.payments);
  const payments = paymentsState.payments;
  //const [payments, setPayments] = useState<Payment[]>(initialData);
  const page = paymentsState.page;

  const [getPayments, { data, isError, isLoading, error }] =
    useGetPaymentsMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {

  }, [location.pathname]);

  useEffect(() => {
    if(from && to){
      dispatch(clearState());
      getPayments({
        keyword: searchTxt ? searchTxt : '',
        to:
          to,
        from:
          from,
      });
    }
  }, [from,to]);

  useEffect(() => {
    getPayments({
      keyword: debouncedSearchTerm,
      page:
        paymentsState.keyword ?? "" !== debouncedSearchTerm ?? "" ? 1 : page,
      to:
        to,
      from:
        from,
    });
  }, [debouncedSearchTerm]);


  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/");
    }
  }, [isError]);

  const [stateDataSorting,setStateDataSorting] = useState({sortBy: "invoice_id",isAsc: false})
  const getPaymentsSortBy = (stateData:{sortBy:string,isAsc:boolean}) => {
    console.log(stateData)
    dispatch(clearState());
    setStateDataSorting(stateData)
    getPayments({
      keyword: searchTxt ? searchTxt : '',
      from: from ? from : '',
      to: to ? to : '',
      sort_by:stateData.sortBy,
      sort_order: stateData.isAsc ? "ASC" : 'DESC',
    });
  }

  useEffect(() => {
    // console.log(paymentsState.lastPageReached, page);
    if (!paymentsState.lastPageReached && loadMoreTrigger)
      getPayments({ page: page + 1, keyword: searchTxt, from: from, to: to,sort_by:stateDataSorting.sortBy,
        sort_order: '' });
  }, [loadMoreTrigger]);

  // useEffect(() => {
  //   if (searchTxt !== "") dispatch(setPayments([]));
  // }, [searchTxt]);

  return (
    <>
      <div className="">
        <PaymentTable
          payments={payments ?? []}
          setPayments={(i) => dispatch(setPayments(i))}
          showCheckbox={true}
          loading={isLoading}
          loadMorePayments={() => setLoadMoreTrigger((i) => !i)}
          getPaymentsSortBy={getPaymentsSortBy}
          showAddPaymentModal={showAddPaymentModal}
          setShowAddPaymentModal={setShowAddPaymentModal}

        />
      </div>
    </>
  );
}
