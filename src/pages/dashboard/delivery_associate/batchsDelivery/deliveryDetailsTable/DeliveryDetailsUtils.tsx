import "./batch-details-table.scss";
import {ProgressBar} from "react-bootstrap";
import {ReactComponent as Clock} from '@/assets/svgs/Clock.svg';
import {ReactComponent as Profile} from '@/assets/svgs/Profile-circle.svg';
import { Link } from "react-router-dom";


const getVariant = (status: string) => {
  switch (status) {
    case 'Ongoing':
      return 'warning';
    case 'Completed':
      return 'success';
    default:
      return 'secondary';
  }
};

export function BatchStatus({batchStatus}: { batchStatus: string }) {


  return (
    <span
      className={`badge rounded-pill batch-status batch-status-badge align-middle fw-light bg-${getVariant(batchStatus).toLowerCase()}`}>{batchStatus}</span>
  )
}

export function BatchProgress({totalCount, completedCount, batchStatus}: {
  totalCount: number,
  completedCount: number,
  batchStatus: string
}) {
  return (
    <span>
      <ProgressBar className={'batch-progress d-inline-flex p-6'} now={completedCount} max={totalCount}
                   variant={getVariant(batchStatus)}/>
      <span className={'d-inline-flex p-1 text-bold'}>{completedCount}/{totalCount}</span>
    </span>
  )
}

export function BatchAvatar({avatar, name, id, time}: { avatar: string, name: string, id: number, time: string }) {
// // console.log("time: ",time)
  return (
    
      <div className="d-flex flex-row align-items-center">
        <div className="p-1">
          {avatar ? <img src={avatar} alt="Avatar" className={'avatar'}/> :
            <span className={'avatar'}><Profile/></span>}
        </div>
        <div className="d-flex flex-column p-1">
          {name
            ? <span className="p-0 fw-bold text-nowrap text-dark">{name} ({id})</span>
            : <span className="p-0 fw-bold text-nowrap text-dark">{id}</span>
          }
          {time ? <span className="p-0 text-muted"><Clock/> {time}</span> : <></>}
        </div>
      </div>
    

  );
}
