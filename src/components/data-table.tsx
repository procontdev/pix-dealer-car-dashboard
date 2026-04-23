import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  emptyTitle = "No data available",
  emptyDescription = "There are no records to display in this section yet.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-40 rounded-full bg-slate-800" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="h-4 rounded-full bg-slate-800" />
                <div className="h-4 rounded-full bg-slate-800" />
                <div className="h-4 rounded-full bg-slate-800" />
                <div className="h-4 rounded-full bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl border border-slate-800 bg-slate-900/80" />
          <h3 className="text-base font-semibold text-white">{emptyTitle}</h3>
          <p className="text-sm leading-6 text-slate-400">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className="text-slate-300">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
              {columns.map((column) => (
                <TableCell key={String(column.key)} className="text-slate-300">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key] ?? "-")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
