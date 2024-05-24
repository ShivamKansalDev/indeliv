import "./history-line.scss";

export default function HistoryLine({
  icon,
  title,
  timestamp,
}: {
  icon: string;
  title: string;
  timestamp: string;
}) {
  return (
    <div className="history-line-component">
      <div className="img-container">
        <img src={icon} alt="User Avatar" />
      </div>
      <div className="val-container">
        <span className="text-14">{title}</span>
        <span className="text-12">{timestamp}</span>
      </div>
    </div>
  );
}
