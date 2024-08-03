import { ChevronsUpDown } from "lucide-react";
import { InvoiceHead } from "@/types/Invoice";
import { SortingState } from "./invoiceTable/InvoiceTable";
import { SortingDir } from "@/utils/enums";
import { ReactComponent as Asc } from "@/assets/svgs/a-to-z.svg";
import { ReactComponent as Desc } from "@/assets/svgs/z-to-a.svg";
import { ReactComponent as Selected } from "@/assets/svgs/selected.svg";

export default function InvoiceTableTh({
  heading,
  setSortingStates,
  moveToTop,
  withSorting = true,
}: {
  heading: InvoiceHead;
  setSortingStates: React.Dispatch<React.SetStateAction<any>>;
  moveToTop: (value: InvoiceHead["head"]) => void;
  withSorting?: boolean;
}) {
  return (
    <th
      key={heading.head}
      //className={`${sortingStates[heading.head]?.optionsOpen && "open"}`}
      onClick={() => {
        if (heading.sortable) {
          setSortingStates((v:any) => {
            // // console.log({sortBy: heading.key,isAsc: !v.isAsc})
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
      <span className={`${!heading.sortable && "unsorted"}`}
       onClick={() => {
        moveToTop(heading.head);
      
        if(heading.sortable){
          // setSortingStates((v:any) => {
          //   //// console.log({sortBy: heading.key,isAsc: !v.isAsc})
          //   return {sortBy: heading.key,isAsc: !v.isAsc}
          // })
          // setSortingStates((ss) => ({
          //   ...ss,
          //   [heading.head]: {
          //     ...ss[heading.head],
          //     dir: sortingStates[heading.head]?.dir === SortingDir.DSC ? SortingDir.ASC : SortingDir.DSC
          //   },
          // }));
        }
        
       }
      }
      >
        {heading.head}
        {heading.sortable  && <ChevronsUpDown />}
      </span>
      {/* {heading.sortable && withSorting && (
        <div
          className={`sorting-options ${
            sortingStates[heading.head]?.optionsOpen && "open"
          }`}
          onClick={() => moveToTop(heading.head)}
        >
          <div
            className={`a-to-z `}
            onClick={() =>
              setSortingStates((ss) => ({
                ...ss,
                [heading.head]: {
                  ...ss[heading.head],
                  dir: SortingDir.ASC,
                },
              }))
            }
          >
            <Asc />
            <Selected />
          </div>
          <div
            className={`z-to-a ${
              sortingStates[heading.head]?.dir === SortingDir.DSC && "selected"
            }`}
            onClick={() =>
              setSortingStates((ss) => ({
                ...ss,
                [heading.head]: {
                  ...ss[heading.head],
                  dir: SortingDir.DSC,
                },
              }))
            }
          >
            <Desc />
            <Selected />
          </div>
        </div>
      )} */}
    </th>
  );
}
