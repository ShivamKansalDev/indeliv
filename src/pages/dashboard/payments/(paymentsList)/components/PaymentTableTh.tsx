import { ChevronsUpDown } from "lucide-react";
import { paymentHead } from "@/types/Payment";
import { SortingState } from "@pages/dashboard/payments/(paymentsList)/components/paymentTable/PaymentTable";
import { SortingDir } from "@/utils/enums";
import { ReactComponent as Asc } from "@/assets/svgs/a-to-z.svg";
import { ReactComponent as Desc } from "@/assets/svgs/z-to-a.svg";
import { ReactComponent as Selected } from "@/assets/svgs/selected.svg";

export default function PaymentTableTh({
  heading,
  setSortingStates,
  moveToTop,
  withSorting = true,
}: {
  heading: paymentHead;
  setSortingStates: React.Dispatch<React.SetStateAction<any>>;
  moveToTop: (value: paymentHead["head"]) => void;
  withSorting?: boolean;
}) {
  return (
    <th
      key={heading.head}
      onClick={() => {
        if (heading.sortable) {
          setSortingStates((v:any) => {
            console.log({sortBy: heading.key,isAsc: !v.isAsc})
            return {sortBy: heading.key,isAsc: !v.isAsc}
          })
          // setSortingStates((ss) => ({
          //   ...ss,
          //   [heading.head]: {
          //     ...ss[heading.head],
          //     optionsOpen: !ss[heading.head].optionsOpen,
          //   },
          // }));
        }
      }}
    >
      <span className={`${!heading.sortable && "unsorted"}`}>
        {heading.head}
        {heading.sortable && withSorting && <ChevronsUpDown />}
      </span>
      
    </th>
  );
}
