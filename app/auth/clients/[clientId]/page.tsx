// import { Card, CardContent } from "@/components/ui/card";
// import data from "@/data/labels.json";
// import prisma from "@/lib/db";
// import { format } from "date-fns";
// import Link from "next/link";

// const {
//   detailsTitle,
//   infoTitle,
//   repairsTitle,
//   invoicesTitle,
//   noRepairs,
//   noInvoices,
//   name,
//   regNr,
//   address,
//   bank,
//   bankCode,
//   account,
//   phone,
//   email,
// } = data.ru.clients;

// const { date: repairDate } = data.ru.repairs;
// const { carInformation } = data.ru.repairs.repairForm;
// const { brand, model, plate, mileage } = carInformation;

// const {
//   invoiceNumber,
//   date: invoiceDate,
//   status,
//   total,
//   paid,
//   unpaid,
// } = data.ru.invoices;

// const ClientDetailPage = async ({
//   params,
// }: {
//   params: Promise<{ clientId: string }>;
// }) => {
//   const { clientId } = await params;
//   const id = Number(clientId);

//   if (Number.isNaN(id)) {
//     return (
//       <div className="text-center text-2xl font-semibold">
//         Клиент не найден
//       </div>
//     );
//   }

//   const client = await prisma.client.findFirst({
//     where: { id, isDeleted: false },
//   });

//   if (!client) {
//     return (
//       <div className="text-center text-2xl font-semibold">
//         Клиент не найден
//       </div>
//     );
//   }

//   const repairFilters = [{ clientId: id }] as {
//     clientId?: number;
//     clientName?: string;
//     clientPhone?: string;
//   }[];

//   if (client.name && client.phone) {
//     repairFilters.push({ clientName: client.name, clientPhone: client.phone });
//   } else if (client.name) {
//     repairFilters.push({ clientName: client.name });
//   }

//   const repairs = await prisma.repair.findMany({
//     where: { OR: repairFilters },
//     include: { items: true },
//   });

//   const invoicesFilters = [{ clientId: id }] as {
//     clientId?: number;
//     clientName?: string;
//     clientRegNr?: string;
//   }[];

//   if (client.name) {
//     invoicesFilters.push({ clientName: client.name });
//   }

//   if (client.regNr) {
//     invoicesFilters.push({ clientRegNr: client.regNr });
//   }

//   const invoices = await prisma.invoice.findMany({
//     where: { OR: invoicesFilters },
//   });

//   const sortedRepairs = [...repairs].sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   );

//   const sortedInvoices = [...invoices].sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   );

//   return (
//     <Card className="max-w-5xl mx-auto p-6">
//       <CardContent className="space-y-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold">
//             {detailsTitle}: {client.name}
//           </h2>
//         </div>

//         <div className="pt-4 border-t">
//           <h3 className="text-lg font-semibold mb-4">{infoTitle}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DisplayField label={`${name}*`} value={client.name} />
//             <DisplayField label={`${regNr}`} value={client.regNr} />
//             <DisplayField label={`${address}`} value={client.address} />
//             <DisplayField label={`${email}`} value={client.email} />
//             <DisplayField label={`${phone}`} value={client.phone} />
//             <DisplayField label={`${bank}`} value={client.bank} />
//             <DisplayField label={`${bankCode}`} value={client.bankCode} />
//             <DisplayField label={`${account}`} value={client.account} />
//           </div>
//         </div>

//         <div className="pt-4 border-t">
//           <h3 className="text-lg font-semibold mb-4">{repairsTitle}</h3>
//           {sortedRepairs.length === 0 ? (
//             <div className="text-muted-foreground">{noRepairs}</div>
//           ) : (
//             <div className="space-y-4">
//               {sortedRepairs.map((repair) => {
//                 const repairTotal = repair.items.reduce(
//                   (sum, item) => sum + item.price * item.quantity,
//                   0
//                 );

//                 return (
//                   <div key={repair.id} className="rounded border p-4 space-y-4">
//                     <div className="flex flex-wrap items-center justify-between gap-2">
//                       <span className="font-semibold">
//                         {repairDate}: {format(new Date(repair.date), "MM/dd/yyyy")}
//                       </span>
//                       <span className="font-medium">
//                         {total}: {repairTotal.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <DisplayField label={`${brand}*`} value={repair.carBrand} />
//                       <DisplayField label={`${model}*`} value={repair.carModel} />
//                       <DisplayField label={`${plate}*`} value={repair.carPlate} />
//                       <DisplayField label={`${mileage}`} value={repair.carMileage} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <div className="pt-4 border-t">
//           <h3 className="text-lg font-semibold mb-4">{invoicesTitle}</h3>
//           {sortedInvoices.length === 0 ? (
//             <div className="text-muted-foreground">{noInvoices}</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse text-sm">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-2 px-3">{invoiceNumber}</th>
//                     <th className="text-left py-2 px-3">{invoiceDate}</th>
//                     <th className="text-left py-2 px-3">{status}</th>
//                     <th className="text-left py-2 px-3">{total}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedInvoices.map((invoice) => (
//                     <tr key={invoice.id} className="border-b">
//                       <td className="py-2 px-3 text-gray-800 font-medium">
//                         <Link
//                           href={`/auth/invoices/${invoice.id}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           {invoice.number || "-"}
//                         </Link>
//                       </td>
//                       <td className="py-2 px-3 text-gray-800 font-medium">
//                         {format(new Date(invoice.date), "MM/dd/yyyy")}
//                       </td>
//                       <td className="py-2 px-3 text-gray-800 font-medium">
//                         {invoice.status === "Paid" ? paid : unpaid}
//                       </td>
//                       <td className="py-2 px-3 text-gray-800 font-medium">
//                         {invoice.total.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const DisplayField = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: string | number | null | undefined;
// }) => (
//   <div>
//     <p className="text-sm font-medium mb-1">{label}</p>
//     <div className="bg-muted px-4 py-2 rounded shadow-sm text-gray-800 font-medium border border-gray-200">
//       {value || "-"}
//     </div>
//   </div>
// );

// export default ClientDetailPage;
