import React, {
  useMemo,
  useState,
  ForwardRefRenderFunction,
  useEffect,
} from 'react';
import './logs-list.scss';
import {
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
} from 'react-router-dom';
import { useSetOpenNav } from '../..';
import { ReactComponent as BurgerSvg } from '@/assets/svgs/burger.svg';
import { ReactComponent as Calender } from '@/assets/svgs/calendar-2.svg';
import { ReactComponent as FilterIcon } from '@/assets/svgs/sort.svg';
import { ReactComponent as FilterAZIcon } from '@/assets/svgs/filter.svg';
import { ReactComponent as CalendarGreyIcon } from '@/assets/svgs/CalendarGreyIcon.svg';
import { DateRange, Range } from 'react-date-range';
import moment from 'moment';
import { ChevronDown } from 'lucide-react';
import Log from '@/types/Log';
import { useAppSelector } from '@/state/hooks';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

interface SortingStates {
  sortBy: string;
  isAsc: boolean;
}

type ContextType = {
  setSearchTxt: React.Dispatch<React.SetStateAction<string>>;
  searchTxt: string;
  fromDate: string;
  toDate: string;
  triggerApply: boolean;
  logs: Log[];
  isLoading: boolean;
  loadMoreLogs: (page: number) => void;
  sortingStates: SortingStates;
  setSortingStates: React.Dispatch<React.SetStateAction<any>>;
};

interface ToggleProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// custom filter button
const CustomToggle: ForwardRefRenderFunction<HTMLDivElement, ToggleProps> = (
  { onClick },
  ref
) => {
  return (
    <div
      className="mobile-only"
      ref={ref}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button
        type="button"
        className="log-filter-button"
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <FilterIcon className="filter" />
      </button>
    </div>
  );
};
const ToggleWithRef = React.forwardRef<HTMLDivElement, ToggleProps>(
  CustomToggle
);

export default function LogsList() {
  const tabs = [
    {
      name: 'Activity Log',
      icon: (active: boolean) => {
        return active
          ? '/assets/Icon/Collections-blue.svg'
          : '/assets/Icon/Collections.svg';
      },
      link: '/dashboard/logs/activity',
    },
    {
      name: 'SMS Log',
      icon: (active: boolean) => {
        return active
          ? '/assets/Icon/Deliveries-blue.svg'
          : '/assets/Icon/Deliveries.svg';
      },
      link: '/dashboard/logs/sms',
    },
  ];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [viewCalender, setViewCalender] = useState(false);
  const [viewCalenderMobile, setViewCalenderMobile] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const location = useLocation();
  const [searchTxt, setSearchTxt] = useState('');
  const [triggerApply, setTriggerApply] = useState(false);
  const { setOpenNav } = useSetOpenNav();
  const { isLoading } = useAppSelector((state) => state.logs);
  const [sortingStates, setSortingStates] = useState({
    sortBy: '',
    isAsc: false,
  });
  const [dateStart, setDateStart] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const getSearchLabel = useMemo<string>(() => {
    let activityMessage = 'Search By User Name, Invoice Number or Batch Number';
    let smsMessage = 'Search By Name or Invoice Number';
    return location.pathname?.includes('sms') ? smsMessage : activityMessage;
  }, [location]);
  const isMediumScreen = useMemo<boolean>(() => {
    return windowWidth <= 900;
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResetSetting = () => {
    setSortingStates({
      sortBy: '',
      isAsc: false,
    });
    setDateStart([
      {
        startDate: new Date(),
        endDate: undefined,
        key: 'selection',
      },
    ]);
    setFromDate('');
    setToDate('');
    setViewCalender(false)
    setViewCalenderMobile(false)
  };

  return (
    <div className="logs-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt('')}
          className="bg-pure-white nav-links d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
          {tabs.map((tab, index) => (
            <NavLink
              onClick={() => handleResetSetting()}
              to={tab.link}
              key={index}
              style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
              className={'text-decoration-none nav-link-cont'}
            >
              <li className={`navbar-link`}>
                <img
                  src={tab.icon(location.pathname === tab.link)}
                  alt={tab.name}
                />
                <span>{tab.name}</span>
              </li>
            </NavLink>
          ))}
        </div>
        <div className="log-right-bar">
          <div
            className={
              isMediumScreen ? 'search-bar-input-2' : 'search-bar-input'
            }
          >
            <BurgerSvg className="burger" onClick={() => setOpenNav(true)} />
            <img src={'/assets/Icon/Search.svg'} alt="User Avatar" />
            <input
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              type="search"
              placeholder={getSearchLabel}
            />
          </div>
          <div className="button-action">
            <div className="date-range-picker custom-date">
              <button
                type="button"
                className="btn btn-light btn-date-range"
                onClick={() => setViewCalender(!viewCalender)}
              >
                <Calender />
                <span>
                  {dateStart[0].startDate
                    ? moment(dateStart[0].startDate).format(
                        moment(dateStart[0].endDate).isSame(
                          dateStart[0].startDate,
                          'day'
                        )
                          ? 'DD MMM, YYYY'
                          : 'DD MMM'
                      )
                    : ''}
                </span>
                {dateStart[0].endDate &&
                !moment(dateStart[0].endDate).isSame(
                  dateStart[0].startDate,
                  'day'
                ) ? (
                  <span style={{ paddingLeft: 0 }}>
                    - {moment(dateStart[0].endDate).format('DD MMM, YYYY')}
                  </span>
                ) : null}
                <ChevronDown className="fs-6" />
              </button>
              {viewCalender && (
                <div className="drp_popover">
                  <DateRange
                    editableDateInputs={false}
                    onChange={(item) => setDateStart([item.selection])}
                    moveRangeOnFirstSelection={false}
                    dateDisplayFormat="dd MMM, yyyy"
                    showMonthAndYearPickers={true}
                    ranges={dateStart}
                  />
                  <div className="drp-btn-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        setDateStart([
                          {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                          },
                        ])
                      }
                      className="btn btn-today"
                    >
                      Today
                    </button>
                  </div>
                  <hr className="drp-hr" />
                  <div className="btn-row">
                    <button
                      type="button"
                      onClick={() => setViewCalender(false)}
                      className="btn btn-cancel text-dark"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const startDate = dateStart[0].startDate
                          ? dateStart[0].startDate
                          : '';
                        const endDate = dateStart[0].endDate
                          ? dateStart[0].endDate
                          : '';
                        setFromDate(moment(startDate).format('YYYY-MM-DD'));
                        setToDate(moment(endDate).format('YYYY-MM-DD'));
                        setViewCalender(false);
                        setTriggerApply(!triggerApply);
                      }}
                      type="button"
                      className="btn flex-grow-1 btn-apply"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className="date-range-picker mobile-only"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                borderRadius: 8,
                zIndex: 1,
              }}
            >
              <button
                type="button"
                className="log-date-button btn-date-range"
                onClick={() => setViewCalenderMobile(!viewCalenderMobile)}
              >
                <CalendarGreyIcon className="calendar-icon" />
              </button>
              {viewCalenderMobile && (
                <div className="drp_popover drp_popover_mobile">
                  <DateRange
                    editableDateInputs={false}
                    onChange={(item) => setDateStart([item.selection])}
                    moveRangeOnFirstSelection={false}
                    dateDisplayFormat="dd MMM, yyyy"
                    showMonthAndYearPickers={true}
                    ranges={dateStart}
                  />
                  <div className="drp-btn-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        setDateStart([
                          {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                          },
                        ])
                      }
                      className="btn btn-today"
                    >
                      Today
                    </button>
                  </div>
                  <hr className="drp-hr" />
                  <div className="btn-row">
                    <button
                      type="button"
                      onClick={() => setViewCalenderMobile(false)}
                      className="btn btn-cancel text-dark"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const startDate = dateStart[0].startDate
                          ? dateStart[0].startDate
                          : '';
                        const endDate = dateStart[0].endDate
                          ? dateStart[0].endDate
                          : '';
                        setFromDate(moment(startDate).format('YYYY-MM-DD'));
                        setToDate(moment(endDate).format('YYYY-MM-DD'));
                        setViewCalenderMobile(false);
                        setTriggerApply(!triggerApply);
                      }}
                      type="button"
                      className="btn flex-grow-1 btn-apply"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                id="dropdown-custom-1"
                as={ToggleWithRef}
              ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey="time"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => {
                    // setDateStart([
                    //   {
                    //     startDate: new Date(),
                    //     endDate: undefined,
                    //     key: 'selection',
                    //   },
                    // ]);
                    // const { startDate, endDate } = dateStart[0];
                    // setFromDate(moment(startDate).format('YYYY-MM-DD'));
                    // setToDate(moment(endDate).format('YYYY-MM-DD'));
                    setSortingStates({
                      sortBy: 'created_at',
                      isAsc: !sortingStates?.isAsc,
                    });
                  }}
                >
                  <div>Time</div>
                  <FilterAZIcon className="filter-az" />
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="user"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  onClick={() =>
                    setSortingStates({
                      sortBy: location.pathname?.includes('sms')
                        ? 'username'
                        : 'user_id',
                      isAsc: !sortingStates.isAsc,
                    })
                  }
                >
                  <div>User</div>
                  <FilterAZIcon className="filter-az" />
                </Dropdown.Item>
                {location.pathname.includes('logs/activity') && (
                  <Dropdown.Item
                    eventKey="type"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                    onClick={() =>
                      setSortingStates({
                        sortBy: 'activity_type',
                        isAsc: !sortingStates.isAsc,
                      })
                    }
                  >
                    <div>Type</div>
                    <FilterAZIcon className="filter-az" />
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  eventKey="log"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  onClick={() =>
                    setSortingStates({
                      sortBy: location.pathname?.includes('sms')
                        ? 'message'
                        : 'activity_log',
                      isAsc: !sortingStates.isAsc,
                    })
                  }
                >
                  <div>Log</div>
                  <FilterAZIcon className="filter-az" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="logs-list-content bg-pure-white">
        <Outlet
          context={{
            searchTxt,
            fromDate,
            toDate,
            sortingStates,
            triggerApply,
            setSortingStates,
          }}
        />
      </div>
    </div>
  );
}

export function useLogsListState() {
  return useOutletContext<ContextType>();
}
