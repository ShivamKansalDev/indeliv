import { ChevronsUpDown } from "lucide-react";
import { batchDetailsHead } from "@/types/BatchDetails";
import { SortingState } from "@pages/dashboard/batchs/(batchsList)/components/batchTable/BatchTable";
import { SortingDir } from "@/utils/enums";
import { ReactComponent as Asc } from "@/assets/svgs/a-to-z.svg";
import { ReactComponent as Desc } from "@/assets/svgs/z-to-a.svg";
import { ReactComponent as Selected } from "@/assets/svgs/selected.svg";

export default function DeliveryDetailsTableTh({
    heading,
    sortingStates,
    setSortingStates,
    moveToTop,
    withSorting = true,
    setSort
}: {
    heading: batchDetailsHead;
    sortingStates: SortingState;
    setSortingStates: React.Dispatch<React.SetStateAction<SortingState>>;
    setSort: (value: boolean) => void;
    moveToTop: (value: batchDetailsHead["head"]) => void;
    withSorting?: boolean;
}) {
    // console.log("heading.sortable",heading)
    // console.log(withSorting)
    return (
        <th
        // key={heading.head}
        // className={`${sortingStates[heading.head]?.optionsOpen && "open"}`}
        // onClick={() => {
        //     if (withSorting) {
        //         setSortingStates((ss) => ({
        //             ...ss,
        //             [heading.head]: {
        //                 ...ss[heading.head],
        //                 optionsOpen: !ss[heading.head].optionsOpen,
        //             },
        //         }));
        //     }
        // }}
        >
            <span className={`${!heading.sortable && "unsorted"}`}
                onClick={() => {
                    setSort(true);
                    moveToTop(heading.head);
                    if (heading.sortable) {
                        setSortingStates((ss) => ({
                            ...ss,
                            [heading.head]: {
                                ...ss[heading.head],
                                dir: sortingStates[heading.head]?.dir === SortingDir.DSC ? SortingDir.ASC : SortingDir.DSC
                            },
                        }));
                    }

                }
                }
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
