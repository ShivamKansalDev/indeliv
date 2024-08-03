import "./content-section.scss";
import { LegacyRef, ReactElement } from "react";

export default function ContentSection({
  title,
  children,
  shadow = true,
  className = "",
  ref,
}: {
  title: ReactElement | string;
  children: ReactElement | ReactElement[];
  shadow?: boolean;
  className?: string;
  ref?: LegacyRef<HTMLDivElement>;
}) {
  return (
    <div
      className={`bg-white content-section-component ${
        shadow && "my-shadow"
      } ${className}`}
      ref={ref}
    >
      <header className="bg-pure-white">{title}</header>
      <main>{children}</main>
    </div>
  );
}
