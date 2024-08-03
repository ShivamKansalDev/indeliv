import { useLogoutMutation } from "@/state/slices/authApiSlice";
import { useDeleteInvoicesMutation, useGetInvoicesMutation } from "@/state/slices/invoices/invoicesApiSlice";
import Invoice from "@/types/Invoice";
import InvoiceTable from "@/pages/dashboard/invoices/(invoicesList)/components/invoiceTable/InvoiceTable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInvoicesListState } from "../layout";
import useDebounce from "@/utils/hooks/debounce";
import { clearState, setInvoices } from "@/state/slices/invoices/invoicesSlice";
import { ReactComponent as CircleRed } from "@/assets/svgs/delete-circle.svg";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { set } from "react-hook-form";
import { boolean } from "yup";
import { Button, Modal } from "react-bootstrap";

export default function InvoiceDeliveries() {
  const { searchTxt, setSearchTxt, fromDate, toDate, deleteInvoice, setDeleteInvoice, setShowDelete, showDelete } = useInvoicesListState();
  const [deleteInvoices, { data: invoiceData, error: invoiceError }]: any = useDeleteInvoicesMutation()

  const debouncedSearchTerm = useDebounce(searchTxt, 400);
  const handleCloseDelete = () => { setShowDelete(false); setDeleteInvoice(false);};
  const invoicesState = useAppSelector((state) => state.invoices);
  const invoices = invoicesState.invoices;
  const page = invoicesState.page;

  const [getInvoices, { data, isError, isLoading, error }] =
    useGetInvoicesMutation();
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(false);
  const [checkedData, setCheckedData] = useState<Invoice[]>([]);
  const [deliveryInvoice, setDeliveryInvoice] = useState<any>([])
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const locationm = useLocation();
  useEffect(() => {

    dispatch(clearState());

  }, [locationm.pathname]);
  
  useEffect(() => {
    //setCheckedData(invoices.filter(v => v.checked === true))
    dispatch(clearState());
    fetchDeliveryInvoices()

  }, [debouncedSearchTerm]);

  const fetchDeliveryInvoices = async () => {
    const { data: { data } }: any = await getInvoices({
      keyword: debouncedSearchTerm,
      page: 1,
      from: fromDate,
      to: toDate
    });
    setDeliveryInvoice(data)
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
    setDeliveryInvoice(data)
  }

  const [stateDataSorting, setStateDataSorting] = useState({ sortBy: "invoice_number", isAsc: true })
  const getinvoicesSortBy = async (stateData: { sortBy: string, isAsc: boolean }) => {
    // // console.log(stateData)
    dispatch(clearState());
    setStateDataSorting(stateData)
    const { data: { data } }: any = await getInvoices({
      keyword: searchTxt ? searchTxt : '',
      from: fromDate ? fromDate : '',
      to: toDate ? toDate : '',
      sort_by: stateData.sortBy,
      sort_order: stateData.isAsc ? "DESC" : 'ASC',
    });
    setDeliveryInvoice(data)
  }

  useEffect(() => {
    // // console.log(invoicesState.lastPageReached, page);
    if (!invoicesState.lastPageReached && loadMoreTrigger)
      getInvoices({
        page: page + 1, keyword: searchTxt, sort_by: stateDataSorting.sortBy,
        sort_order: '',
        from: fromDate,
        to: toDate
      });
      setDeliveryInvoice(invoices)
  }, [loadMoreTrigger]);


  useEffect(() => {
    if (isError && error && "data" in error && error?.status === 403) {
      logout();
      navigate("/");
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

  // const handleDelete = async () => {
  //   console.log('checkedData', checkedData)
  //   if(!checkedData?.length) {
  //     alert('Please select at least one invoice')
  //     return setShowDelete(false);
  //   }
  //   const { data, error }: any = await deleteInvoices(checkedData?.map((item) => item?.id));
  
  //   if (data?.message) {
  //     setCheckedData([]);
  //     dispatch(clearState());
  //     getInvoices({
  //       keyword: debouncedSearchTerm,
  //       page: 1,
  //       from: fromDate,
  //       to: toDate
  //     });
  //     setShowDelete(false);
  //   }
  //   if (error?.data?.message) {
  //     alert(error?.data?.message);
  //     setShowDelete(false);
  //   }
  
  //   setDeleteInvoice(false);
  // };
  
  // useEffect(() => {
  //   if (deleteInvoice) {
  //     handleDelete();
  //   }
  // }, [deleteInvoice]);

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
  
  // handleDeleteInvoices()
  const handleDeleteInvoices = async () => {
    if(checkedData?.length) {
      const { data, error }: any = await deleteInvoices(checkedData?.map((item) => item?.id));
        if (data?.message) {
          dispatch(clearState());
          const { data : { data } }: any = await getInvoices({
            keyword: debouncedSearchTerm,
            page: 1,
            from: fromDate,
            to: toDate
          });
          setDeliveryInvoice(data)
          setShowDelete(false);
          
        }
        if (error?.data?.message) {
          alert(error?.data?.message);
          setShowDelete(false);
        }
        setCheckedData([]);          
        setDeleteInvoice(false);
    }
  }

  return (
    <>
      <div className="">
        <InvoiceTable
          invoices={[...checkedData, ...(deliveryInvoice ?? [])].filter((obj, index, self) =>
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
            onClick={handleDeleteInvoices}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
