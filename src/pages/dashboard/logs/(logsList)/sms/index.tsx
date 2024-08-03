import React, { useEffect, useState } from 'react';
import LogTable from '@/pages/dashboard/logs/(logsList)/components/LogTable/LogTable';
import { useGetSMSLogsMutation } from '@/state/slices/logs/logsApiSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { clearState } from '@/state/slices/logs/logsSlice';
import Log from '@/types/Log';
import { useLogsListState } from '../layout';
import useDebounce from '@/utils/hooks/debounce';
import { useLocation } from 'react-router-dom';

export default function SMS() {
  const location = useLocation();
  const {
    searchTxt,
    fromDate,
    toDate,
    sortingStates,
    setSortingStates,
    triggerApply,
  } = useLogsListState();
  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const [getSMSLogs, { data, isError, isLoading, error }] =
    useGetSMSLogsMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const dispatch = useAppDispatch();
  const logsState = useAppSelector((state) => state.logs);
  const { logs: logsData, page } = logsState;

  // handle get logs data when first load page
  useEffect(() => {
    if (firstLoad) {
      getLogsData();
      setFirstLoad(false);
    }
  }, []);

  // handle clear data when change screen
  useEffect(() => {
    dispatch(clearState());
  }, [location.pathname]);

  // handle filter by date range
  useEffect(() => {
    if (fromDate && toDate && !firstLoad) {
      dispatch(clearState());
      getSMSLogs({
        to: toDate,
        from: fromDate,
        keyword: searchTxt,
        sort_by: sortingStates.sortBy,
        sort_order: sortingStates.isAsc ? 'ASC' : 'DESC',
      });
    }
  }, [fromDate, toDate, triggerApply]);

  // handle load data when scrolling
  useEffect(() => {
    if (!logsState.lastPageReached && !isLoading && !firstLoad)
      getSMSLogs({
        page: page + 1,
        keyword: searchTxt,
        sort_by: sortingStates.sortBy,
        sort_order: sortingStates.isAsc ? 'ASC' : 'DESC',
        to: toDate,
        from: fromDate,
      });
  }, [loadMoreTrigger]);

  // handle search function
  useEffect(() => {
    if (!firstLoad) {
      getSMSLogs({
        keyword: debouncedSearchTerm,
        page: 1,
        sort_by: 'created_at',
        sort_order: sortingStates.isAsc ? 'ASC' : 'DESC',
        to: toDate ? toDate : '',
        from: fromDate ? fromDate : '',
      });
    }
  }, [debouncedSearchTerm]);

  // handle get logs
  const getLogsData = () => {
    const payload = {
      keyword: '',
      page: 1,
      sort_by: '',
      sort_order: '',
      to: toDate,
      from: fromDate,
    };
    getSMSLogs(payload);
  };

  // handle sort data
  const getLogsSortBy = (stateData: { sortBy: string; isAsc: boolean }) => {
    if (!firstLoad) {
      dispatch(clearState());
      setSortingStates(stateData);
      const payload = {
        keyword: debouncedSearchTerm,
        sort_by: stateData.sortBy,
        sort_order: stateData.isAsc ? 'ASC' : 'DESC',
        to: toDate ? toDate : '',
        from: fromDate ? fromDate : '',
      };
      getSMSLogs(payload);
    }
  };

  return (
    <>
      <div>
        <LogTable
          logs={logsData}
          loading={isLoading}
          loadMoreLogs={() => setLoadMoreTrigger((i) => !i)}
          getLogsSortBy={getLogsSortBy}
        />
      </div>
    </>
  );
}
