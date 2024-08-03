// import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";

// export default function NewLoader({ cols }: { cols: number }) {
//   return (
//     <div className="p-8" >
//       <center>
//         <Loading />
//       </center>
//     </div>
//   );
// }


import { ReactComponent as Loading } from "@/assets/svgs/loading.svg";

export default function NewLoader({ cols }: { cols: number }) {
  return (
    <td colSpan={cols}>
      <center>
        <Loading />
      </center>
    </td>
  );
}