import LoadingTd from "@/components/LoadingTd";
import "./data-table.scss";
import { formatDate } from "@/utils/helper";

interface Options {
  smallPadding?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  headings,
  data,
  keys,
  options,
  loading = false,
}: {
  headings: string[];
  data: T[];
  keys?: (keyof T)[];
  options?: Options;
  loading?: boolean;
}) {
  if (!keys) keys = headings;
  return (
    <table className="data-table-component">
      <thead>
        <tr>
          {headings.map((h) => (
            <th>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr className="loading-row">
            <LoadingTd cols={headings.length} />
          </tr>
        ) : (
          data?.map((d) => (
            <tr>
              {keys?.map((k) => (
                <td
                  className={`${options?.smallPadding ? "small-padding" : ""} ${
                    k as string
                  }`}
                >
                 {
                   k == "updated_at" ? (
                    formatDate(d[k])
                    ) : k == "user.name" ? (
                      d["user"]["name"]
                    ) : k == "payment_method" ? "Cash" : (
                      d[k]
                    )
                 }
                  
                  
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
