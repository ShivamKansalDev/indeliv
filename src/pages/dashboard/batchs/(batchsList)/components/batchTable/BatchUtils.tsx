import "./batch-table.scss";
import { ProgressBar } from "react-bootstrap";
import { ReactComponent as Clock } from '@/assets/svgs/Clock.svg';
import { ReactComponent as Profile } from '@/assets/svgs/Profile-circle.svg';
import { ReactComponent as User } from "@/assets/svgs/user-1.svg";
import { Assosiate } from "@/types/Batch";

const getVariant = (status: string) => {
  switch (status) {
    case 'Ongoing':
      return 'warning';
    case 'Out for Delivery':
      return 'warning';
    case 'On Going':
      return 'warning';
    case 'On Hold':
      return 'danger';
    case 'Completed':
      return 'success';
    case 'Delivered':
      return 'success';
    default:
      return 'secondary';
  }
};

export function BatchStatus({ batchStatus }: { batchStatus: string }) {
  const styles = {
    success: {
      backgroundColor: "#ECFDF3",
      border: '1px solid #12B76A',
      color: '#12B76A'
    },
    warning: {
      backgroundColor: "#FFFAEB",
      color: '#FDB022',
      border: '1px solid rgba(253, 176, 34, 1)',
    },
    danger: {
      backgroundColor: "#FEF3F2",
      color: '#F97066',
      border: '1px solid #F97066',
    },
    secondary: {
      backgroundColor: '#F9FAFB',
      border: '1px solid #EAECF0',
      color: "#475467",
    },
  };
  const variant = getVariant(batchStatus).toLowerCase();
  // @ts-ignore
  const currentStyle = styles[variant] || {};

  return (
    <span style={currentStyle}
      className={`badge rounded-pill fw-medium batch-status align-middle batch-status-badge`}><span>{batchStatus}</span></span>
  )
}

export function BatchProgress({ totalCount, completedCount, batchStatus, type }: {
  totalCount: number,
  completedCount: number,
  batchStatus: string,
  type: any
}) {
  const styles = {
    success: {
      backgroundColor: "#ECFDF3",
      color: '#047857'
    },
    warning: {
      backgroundColor: "#FEEFC6",
      color: '#FDB022',
    },
    secondary: {
      backgroundColor: '#EAECF0',
      color: "#475467",
    },
  };


  const variant = getVariant(batchStatus).toLowerCase();
  // // console.log(variant,'variant')
  // @ts-ignore
  const currentStyle = styles[variant] || {};

  // if(batchStatus==="Ongoing")
  // {
  //   completedCount=2;
  //   totalCount=12;
  // }
  // else if(batchStatus==="Unassigned"){
  //   completedCount=0;
  //   totalCount=12;
  // }
  // else if(batchStatus==="Completed"){
  //   completedCount=6;
  //   totalCount=6;
  // }


  return (
    <span style={{ textWrap: 'nowrap' }}>
      <ProgressBar style={currentStyle}
        className={'batch-progress d-inline-flex'}
        now={completedCount} max={totalCount}
        variant={getVariant(batchStatus)} />
      <span className={'d-inline-flex p-1 text-bold'} style={{ fontWeight: '500' }}>{completedCount}/{totalCount}</span>
    </span>
  )
}

export function BatchAvatar({ avatar, name, id, time }: { avatar: Assosiate, name: string, id: number | undefined, time: string }) {


  return (
    <>
      <div className="d-flex flex-row align-items-stretch">

        <div className="p-1" style={{ marginBlock: 'auto' }}>
          {avatar?.name
            ? <User /> // Show this when there is an avatar name
            : <Profile className="list-avatar" /> // Show this when there isn't an avatar name
          }
        </div>
        <div className="d-flex flex-column p-1">
          {name
            ? <span className="p-0 text-nowrap assigned-at batch-title">{name} ({id})</span>
            : <span className="p-0 text-nowrap batch-id">{id}</span>
          }
          {name ? <span className="p-0 text-muted batch-time"><Clock /> <span>{time}</span></span> : <></>}
        </div>
      </div>
    </>

  );
}

export function BatchAvatarMobile({ avatar, name, id, time, vehicle, amount, status }: {
  avatar: Assosiate,
  name: string,
  id: number,
  time: string,
  vehicle: string,
  amount: string,
  status: string
}) {

  return (
    <>
      <div className="d-flex flex-row align-items-stretch">
        <div className="p-1" style={{ marginBlock: 'auto' }}>
          {avatar?.name
            ? <User /> // Show this when there is an avatar name
            : <Profile className="list-avatar" /> // Show this when there isn't an avatar name
          }
        </div>
        <div className="d-flex flex-column p-1">
          {name
            ? <span className="p-0 text-nowrap assigned-at">{name} ({id})</span>
            : <span className="p-0 text-nowrap batch-id">{id}</span>
          }
          {status === "Unassigned" ? <span className="p-0 text-muted avatar-subtitle" style={{ marginTop: '1px' }}>Total Amount: <span className="block-value">₹{amount}</span></span> : <></>}
          {status !== "Unassigned" ? <span className="p-0 text-muted avatar-subtitle" style={{ marginTop: '1px' }}>Vehicle Type: {vehicle}</span> : <></>}
        </div>
      </div>
    </>

  );
}
