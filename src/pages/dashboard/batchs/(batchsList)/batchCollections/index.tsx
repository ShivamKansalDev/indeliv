// import React, { useState } from "react";
// import BatchTable from "@/pages/dashboard/batchs/(batchsList)/components/batchTable/BatchTable";
// import Batch from "@/types/Batch";
// import {useAppDispatch, useAppSelector} from "@/state/hooks";
// import {useGetBatchsMutation} from "@/state/slices/batchs/batchsApiSlice";
// import {useLogoutMutation} from "@/state/slices/authApiSlice";
// import {useNavigate} from "react-router-dom";
// import {setBatchs} from "@/state/slices/batchs/batchsSlice";



// export default function Collections() {
//    // const [batchs, setBatchs] = useState<Batch[]>([]);
//     const batchsState = useAppSelector((state) => state.batchs);
//     const batchs = batchsState.batchs;
//     //const [batchs, setBatchs] = useState<Batch[]>(initialData);
//     const page = batchsState.page;

//     const [getBatchs, {data, isError, isLoading, error}] =
//         useGetBatchsMutation();
//     const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
//     const [logout] = useLogoutMutation();
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();
//     return (
//         <>
//             <div className="">
//                 <BatchTable
//                     batchs={batchs}
//                     setBatchs={setBatchs}
//                     showCheckbox={true}
//                     excludedHeadings={[]}
//                 />
//             </div>
//         </>
//     );
// }



import {useLogoutMutation} from "@/state/slices/authApiSlice";
import {useGetBatchsMutation} from "@/state/slices/batchs/batchsApiSlice";
import Batch from "@/types/Batch";
import BatchTable from "@/pages/dashboard/batchs/(batchsList)/components/batchTable/BatchTable";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useBatchsListState} from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import {clearState, setBatchs} from "@/state/slices/batchs/batchsSlice";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {set} from "react-hook-form";


export default function Collections() {
  const {searchTxt,fromDate,toDate} = useBatchsListState();

  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const batchsState = useAppSelector((state) => state.batchs);
  const batchs = batchsState.batchs;
  //const [batchs, setBatchs] = useState<Batch[]>(initialData);
  const page = batchsState.page;

  const [getBatchs, {data, isError, isLoading, error}] =
    useGetBatchsMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(clearState());
  }, []);

  useEffect(() => {
    if(fromDate && toDate){
     dispatch(clearState());
     getBatchs({
      to:toDate,
      from:fromDate
     });
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    getBatchs({
        batch_type:2,
      keyword: debouncedSearchTerm,
      page:1,
        to:toDate,
     from:fromDate
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/login");
    }
  }, [isError]);

  const [stateDataSorting,setStateDataSorting] = useState({sortBy: "id",isAsc: true})
  const getBatchSortBy = (stateData:{sortBy:string,isAsc:boolean}) => {
   dispatch(clearState());
   setStateDataSorting(stateData)
   getBatchs({
    sort_by:stateData.sortBy,
    sort_order: stateData.isAsc ? "ASC" : 'DESC',
    batch_type:2
   });
  }
  useEffect(() => {
    if (!batchsState.lastPageReached && loadMoreTrigger)
      getBatchs({page: page + 1, keyword: searchTxt,batch_type:2,to:toDate,
        from:fromDate,sort_by:stateDataSorting.sortBy,
        sort_order: stateDataSorting.isAsc ? "ASC" : 'DESC' });
  }, [loadMoreTrigger]);

  useEffect(() => {
    if (searchTxt !== "") dispatch(setBatchs([]));
  }, [searchTxt]);

  return (
    <>
      <div className="">
        <BatchTable
          batchs={(batchs ?? []).filter(batch => batch.invoices.length > 0)}
           setBatchs={(i) => dispatch(setBatchs(i))}
          //setBatchs={setBatchs}
          showCheckbox={true}
          loading={isLoading}
          loadMoreBatchs={() => setLoadMoreTrigger((i) => !i)}
          getBatchSortBy={getBatchSortBy}
        />
      </div>
    </>
  );
}
