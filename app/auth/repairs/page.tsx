// import ModalWrapper from "@/components/ModalWrapper";
// import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import React from "react";

const RepairsPage = async () => {
  const invoices = await prisma.invoice.findMany({
    include: {
      client: true,
    },
  });

  return (
    <>
      {/* <ModalWrapper>
        <Button className="mb-4">Add Invoice</Button>
      </ModalWrapper> */}
      <Table>
        <TableCaption>A list of your users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nr</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Surname</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{invoice.client?.name}</TableCell>
              <TableCell>{invoice.date.toISOString()}</TableCell>
              <TableCell>{invoice.total}</TableCell>
              <TableCell>{invoice.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
    // <div className="p-4  mx-auto">
    //   <Card className="p-6 shadow-lg">
    //     <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
    //     <form className="space-y-4">
    //       <div>
    //         <Label htmlFor="number">Invoice Number</Label>
    //         <Input id="number" name="number" required />
    //       </div>

    //       <div>
    //         <Label htmlFor="date">Date</Label>
    //         <Input id="date" name="date" type="date" required />
    //       </div>

    //       <h2 className="text-xl font-semibold mt-4">Payer Information</h2>
    //       <div>
    //         <Label htmlFor="name">Name</Label>
    //         <Input id="name" name="name" required />
    //       </div>
    //       <div>
    //         <Label htmlFor="regNr">Registration Number</Label>
    //         <Input id="regNr" name="regNr" />
    //       </div>
    //       <div>
    //         <Label htmlFor="address">Address</Label>
    //         <Input id="address" name="address" />
    //       </div>
    //       <div>
    //         <Label htmlFor="bank">Bank</Label>
    //         <Input id="bank" name="bank" />
    //       </div>
    //       <div>
    //         <Label htmlFor="code">Bank Code</Label>
    //         <Input id="code" name="code" />
    //       </div>
    //       <div>
    //         <Label htmlFor="account">Account Number</Label>
    //         <Input id="account" name="account" />
    //       </div>

    //       <h2 className="text-xl font-semibold mt-4">Invoice Items</h2>
    //       <div className="flex space-x-2 items-center">
    //         <Input
    //           name="name"
    //           placeholder="Item Name"
    //           // value={item.name}
    //           // onChange={(e) => handleItemChange(index, e)}
    //           required
    //         />
    //         <Input
    //           name="quantity"
    //           type="number"
    //           placeholder="Qty"
    //           // value={item.quantity}
    //           // onChange={(e) => handleItemChange(index, e)}
    //           required
    //         />
    //         <Input
    //           name="price"
    //           type="number"
    //           placeholder="Price"
    //           // value={item.price}
    //           // onChange={(e) => handleItemChange(index, e)}
    //           required
    //         />
    //         <Input name="total" type="number" readOnly />
    //         <Button
    //           variant="destructive"
    //           type="button"
    //           // onClick={() => removeItem(index)}
    //         >
    //           X
    //         </Button>
    //       </div>
    //       {/* {invoice.items.map((item, index) => (
    //     <div key={index} className="flex space-x-2 items-center">
    //       <Input name="name" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, e)} required />
    //       <Input name="quantity" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
    //       <Input name="price" type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} required />
    //       <Input name="total" type="number" value={item.total} readOnly />
    //       <Button variant="destructive" type="button" onClick={() => removeItem(index)}>X</Button>
    //     </div>
    //   ))} */}
    //       <Button type="button" className="bg-blue-500 text-white">
    //         Add Item
    //       </Button>

    //       <Button type="submit" className="w-full bg-green-500 text-white">
    //         Create Invoice
    //       </Button>
    //     </form>
    //   </Card>
    // </div>
  );
};

export default RepairsPage;
