import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";

export default function LoadingTd({ cols }: { cols: number }) {
  return (
    <td colSpan={cols}>
      <center>
        <Loading />
      </center>
    </td>
  );
}
