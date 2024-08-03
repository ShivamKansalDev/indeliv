import { ChevronsUpDown } from "lucide-react";
import { batchHead } from "@/types/Batch";
import { SortingState } from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchTable";
import { SortingDir } from "@/utils/enums";
import { ReactComponent as Asc } from "@/assets/svgs/a-to-z.svg";
import { ReactComponent as Desc } from "@/assets/svgs/z-to-a.svg";
import { ReactComponent as Selected } from "@/assets/svgs/selected.svg";

export default function BatchTableTh({
                                           heading,
                                           setSortingStates,
                                           moveToTop,
                                           withSorting = true,
                                       }: {
    heading: batchHead;
    setSortingStates: React.Dispatch<React.SetStateAction<any>>;
    moveToTop: (value: batchHead["head"]) => void;
    withSorting?: boolean;
}) {
    return (
        <th
            key={heading.head}
            onClick={() => {
                moveToTop(heading.head);
                if(heading.sortable){
                    setSortingStates((v:any) => {
                        console.log({sortBy: heading.key,isAsc: !v.isAsc})
                        return {sortBy: heading.key,isAsc: !v.isAsc}
                      })
                }
                
               }
            }
        >
      <span className={`${!heading.sortable && "unsorted"}`}
      
      >
        {heading.head}
          {heading.sortable && withSorting && <ChevronsUpDown />}
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
