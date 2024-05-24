import { ReactElement } from "react";
import "./detail-line.scss";

export default function DetailLine({
  icon,
  title,
  value,
  className,
}: {
  icon: string;
  title: string;
  value: string | ReactElement;
  className?: string;
}) {
  return (
    <div className={`detail-line-component ${className}`}>
      <div className="d-flex g-6 align-items-center">
        <img src={icon} alt={title} />
        <span className="text-details">{title}</span>
      </div>
      <span className="text-details-value">{value}</span>
    </div>
  );
}
