import Batch from '@/types/Batch';
import './batchs-list.scss';
import {useState} from 'react';
import {Outlet, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import {useSetOpenNav} from '../..';
import {NavLink} from 'react-router-dom';
import {ReactComponent as BurgerSvg} from '@/assets/svgs/burger.svg';
// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange, Range} from 'react-date-range';
import {ReactComponent as Calender} from '@/assets/svgs/calendar-2.svg';
import {ChevronDown} from 'lucide-react';
import moment from 'moment';

type ContextType = {
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
  searchTxt: string;
  fromDate: string;
  toDate: string;
  Batchs: Batch[];
  isLoading: boolean;
  loadMoreBatchs: (page: number) => void;
};

export default function BatchsList() {
  const navigate = useNavigate();
  const tabs = [
    {
      name: 'Deliveries',
      icon: (active: boolean) => {
        return active ? '/assets/Icon/Deliveries-blue.svg' : '/assets/Icon/Deliveries.svg';
      },
      link: '/dashboard/batches/deliveries',
    },
    {
      name: 'Collections',
      icon: (active: boolean) => {
        return active ? '/assets/Icon/Collections-blue.svg' : '/assets/Icon/Collections.svg';
      },
      link: '/dashboard/batches/collections',
    },
  ];

  const [dateStart, setDateStart] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: undefined,
      key: 'selection',
    },
  ]);

  const [viewCalender, setViewCalender] = useState(false);

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTxt, setSearchTxt] = useState('');
  const {setOpenNav} = useSetOpenNav();

  return (
    <div className="batchs-list-component">
      <div className="nav-header">
        <div
          onClick={() => setSearchTxt('')}
          className="nav-links d-flex justify-content-between align-items-center w-md-100 g-0 m-0 text-12">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.link}
              className={'text-decoration-none lav-link-cont'}>
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
        <div className="right-bar">
          <div className="search-bar-input">
            <BurgerSvg
              className="burger"
              onClick={() => setOpenNav(true)}
            />
            <img
              src={'/assets/Icon/Search.svg'}
              alt="Search Icon"
              className={'search-icon'}
            />
            <input
              className="search-bar-text"
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              type="search"
              placeholder="Search by Name or Invoice Number"
            />
          </div>
          <div className="date-range-picker">
            <button
              type="button"
              className="btn btn-light btn-date-range"
              onClick={() => setViewCalender(!viewCalender)}>
              <Calender/>
              <span>{dateStart[0].startDate ? moment(dateStart[0].startDate).format(moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day') ? 'DD MMM, YYYY' : 'DD MMM') : ''}</span>
              {(dateStart[0].endDate && !moment(dateStart[0].endDate).isSame(dateStart[0].startDate, 'day')) ?
                <span style={{paddingLeft: 0}}>- {moment(dateStart[0].endDate).format('DD MMM, YYYY')}</span> : null}
              <ChevronDown className="fs-6"/>
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
                      setFromDate(moment(startDate).format("YYYY-MM-DD"));
                      setToDate(moment(endDate).format("YYYY-MM-DD"));
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
          {!viewCalender && (
            <button
              type="button"
              className="create-batch">
              {/* {selectedCount > 0 ? (
                            <div className="selected-count">
                                <span>{selectedCount}</span>
                            </div>
                        ) : (
                            <img src={"/assets/Icon/Add.svg"} alt="Use Avatar" />
                        )} */}
              <span onClick={() => {
                !location?.pathname?.includes("collections") ? navigate("/dashboard/invoices/deliveries") : navigate("/dashboard/invoices/collections");
              }}>Create Batch</span>
            </button>
          )}
        </div>
      </div>
      <div className="batchs-list-content">
        <Outlet context={{searchTxt,fromDate,toDate}}/>
      </div>
    </div>
  );
}

export function useBatchsListState() {
  return useOutletContext<ContextType>();
}
