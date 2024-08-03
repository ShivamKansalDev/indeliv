import './log-table.scss';
import React, { useEffect, useMemo } from 'react';
import LogTableTh from '../LogTableTh';
import LoadingTd from '@/components/LoadingTd';
import moment from 'moment';
import { useAppSelector } from '@/state/hooks';
import { LogHead, logHeadings } from '@/types/Log';
import { useLocation } from 'react-router-dom';
import { useLogsListState } from '../../layout';

interface props {
  logs: any[];
  loading?: boolean;
  excludedHeadings?: LogHead['head'][];
  getLogsSortBy?: (stateData: { sortBy: string; isAsc: boolean }) => void;
  loadMoreLogs?: (page: number) => void;
}

export default function LogTable({
  logs,
  loading = false,
  excludedHeadings = [],
  getLogsSortBy,
  loadMoreLogs,
}: props) {
  const logsState = useAppSelector((state) => state.logs);
  const page = logsState.page;
  const location = useLocation();
  const { sortingStates, setSortingStates } = useLogsListState();
  const headings = useMemo(() => {
    let data = [];
    if (location?.pathname?.includes('logs/sms')) {
      data = [
        { head: 'Time', sortable: true, key: 'created_at' },
        { head: 'User', sortable: true, key: 'username' },
        { head: 'Log', sortable: true, key: 'message' },
      ];
    } else {
      data = [
        { head: 'Time', sortable: true, key: 'created_at' },
        { head: 'User', sortable: true, key: 'user_id' },
        { head: 'Type', sortable: true, key: 'activity_type' },
        { head: 'Log', sortable: true, key: 'activity_log' },
      ];
    }
    return data;
  }, [location]);

  // handle sort data
  useEffect(() => {
    if (sortingStates.sortBy) {
      getLogsSortBy?.(sortingStates);
    }
  }, [sortingStates]);

  // handle load data when scrolling
  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (isAtBottom && loadMoreLogs) {
      loadMoreLogs(page + 1);
    }
  };

  const getMssage = (message: string) => {
    if (message) {
      let result = message.replace(
        /(https:\/\/[^\s]+)/g,
        '<a href="$1" class="link">$1</a>'
      );
      return result;
    }
  };

  const getPhone = (phone: string) => {
    if (phone) {
      let result = phone.slice(0, 2) + ' ' + phone.slice(2);
      return '+' + result;
    }
  };

  const formatDate = (dateString: string) => {
    const utcMoment = moment.utc(dateString);
    const istOffset = 5.5 * 60;
    const istMoment = utcMoment.utcOffset(istOffset);
    const formattedDate = istMoment.format('DD MMM, YYYY, hh:mm a');
    return formattedDate;
  };

  return (
    <>
      <table className="log-table-component">
        <thead>
          <tr>
            {headings.map((heading) => (
              <LogTableTh
                key={heading.head}
                heading={heading}
                withSorting={false}
                setSortingStates={setSortingStates}
              />
            ))}
          </tr>
        </thead>
        <tbody className="log-body-table">
          {logs.map((log, index) => (
            <tr key={index} className={`bg-white log-mobile-view`}>
              <div className="decoration"></div>
              <td className="time">
                <div>{formatDate(log.created_at)}</div>
              </td>
              <td className="user">
                {location.pathname.includes('logs/sms') ? (
                  <div className="user-sms">
                    {log.username}
                    <span className="dec">: </span>
                    <span className="phone">{getPhone(log.phone)}</span>
                  </div>
                ) : (
                  log.user?.name
                )}
              </td>
              {location.pathname.includes('logs/activity') && (
                <td className="activity-type">{log.activity_type}</td>
              )}

              <td className="log">
                <div
                  dangerouslySetInnerHTML={{
                    __html: location.pathname.includes('logs/sms')
                      ? getMssage(log.message)
                      : log.activity_log,
                  }}
                ></div>
              </td>
            </tr>
          ))}
          {loading && (
            <tr className="loading-row">
              <LoadingTd cols={headings.length} />
            </tr>
          )}
        </tbody>
      </table>
      {!loading && (
        <span className="batchlist-table-footer">End of the list</span>
      )}
    </>
  );
}
