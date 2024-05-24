import React, {useEffect, useMemo, useState} from "react";
import "./payments-list.scss";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {useSetOpenNav} from "../..";
import {ReactComponent as BurgerSvg} from "@/assets/svgs/burger.svg";
import {useGetPaymentsMutation} from "@/state/slices/payments/paymentsApiSlice";
import {useLogoutMutation} from "@/state/slices/authApiSlice";
import Payment from "@/types/Payment";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import useDebounce from "@/utils/hooks/debounce";
import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
import {DateRange, DateRangePicker, Range, defaultStaticRanges} from 'react-date-range';
import {ReactComponent as Calender} from '@/assets/svgs/calendar-2.svg';
import {ReactComponent as DownloadPm} from '@/assets/svgs/download_payment.svg';
import {ChevronDown} from 'lucide-react';
import moment from "moment";

type ContextType = {
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
  from: string;
  to: string;
  searchTxt: string;
  payments: Payment[];
  isLoading: boolean;
  loadMorePayments: (page: number) => void;
};

export default function PaymentsList() {
  const [dateStart, setDateStart] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const [viewCalender, setViewCalender] = useState(false);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const tabs = [
    {
      name: "Payments",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Deliveries-blue.svg"
          : "/assets/Icon/Deliveries.svg";
      },
      link: "/dashboard/payments/deliveries",
    },

  ];

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [searchTxt, setSearchTxt] = useState("");
  const {setOpenNav} = useSetOpenNav();
  // useEffect(() => {
  //   setTo(moment('');
  //   setFrom()
  // }, [dateStart]);

  return (
    <div className="payments-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt("")}
          className="nav-links-payment d-flex justify-content-between align-items-center w-md-100 g-0  m-0 text-12"
        >
          {tabs.map((tab, index) => (
            <NavLink
              to={tab.link}
              key={index}
              className={"text-decoration-none nav-link-cont"}
            >
              <li className={`navbar-link`}>
                <span className="nav-name">{tab.name}</span>
              </li>
            </NavLink>
          ))}
        </div>
        <div className="right-bar">
          <div className="search-bar-input">
            <BurgerSvg className="burger" onClick={() => setOpenNav(true)}/>
            <img src={"/assets/Icon/Search.svg"} alt="User Avatar" className={'search-icon'}/>
            <input
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              type="search"
              className="search-bar-text"
              placeholder="Search By Name or Payment ID#"
            />
          </div>
          <div className="date-range-picker">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setViewCalender(!viewCalender)}>
              <Calender/>
              <span>{dateStart[0].startDate ? moment(dateStart[0].startDate).format(moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day') ? 'DD MMM, YYYY' : 'DD MMM') : ''}</span>
              {(dateStart[0].endDate && !moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day')) ? <span style={{paddingLeft: 0}}>- {moment(dateStart[0].endDate).format('DD MMM, YYYY')}</span> : null}
              <ChevronDown className="fs-6"/>
            </button>
            {viewCalender && (
              <div className="drp_popover">
                <DateRange
                  editableDateInputs={false}
                  onChange={(item) => {
                    setDateStart([item.selection]);
                    // console.log(item)
                  }}
                  moveRangeOnFirstSelection={false}
                  showMonthAndYearPickers={true}
                  ranges={dateStart}
                 
                />
                <div className="drp-btn-wrap">
                  <button
                    type="button"
                    onClick={() => setDateStart([
                      {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection',
                      }
                    ])}
                    className="btn btn-today">
                    Today
                  </button>
                </div>
                <hr className="drp-hr"/>
                <div className="btn-row">
                  <button
                    type="button"
                    onClick={() => setViewCalender(false)}
                    className="btn btn-cancel">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const startDate = dateStart[0].startDate ? dateStart[0].startDate : '';
                      const endDate = dateStart[0].endDate ? dateStart[0].endDate: '';
                      //// console.log(startDate, endDate);
                      setTo(moment(endDate).format("YYYY-MM-DD"))
                      setFrom(moment(startDate).format("YYYY-MM-DD"))
                      setViewCalender(false);
                    }}
                    type="button"
                    className="btn flex-grow-1 btn-apply">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/*{lastSegment !== "completed" && (*/}
          {/*    <button className="create-batch ">*/}
          {/*      {selectedCount > 0 ? (*/}
          {/*          <div className="selected-count">*/}
          {/*            <span>{selectedCount}</span>*/}
          {/*          </div>*/}
          {/*      ) : (*/}
          {/*          <img src={"/assets/Icon/Add.svg"} alt="User Avatar"/>*/}
          {/*      )}*/}
          {/*      <span>Create Batch</span>*/}
          {/*    </button>*/}
          {/*)}*/}
        </div>
      </div>
      <div className="payments-list-content">
        <Outlet
          context={{
            setSelectedCount,
            searchTxt,
            from,
            to
          }}
        />
      </div>
    </div>
  );
}

export function usePaymentsListState() {
  return useOutletContext<ContextType>();
}
