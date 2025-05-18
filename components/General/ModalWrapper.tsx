"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
  modalContent: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

const ModalWrapper = ({ modalContent, isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{children}</div>
      </DialogTrigger> */}
      <DialogContent className="w-auto lg:max-w-[95%] max-h-[95vh] overflow-auto p-6 sm:max-w-[100%]">
        <DialogTitle></DialogTitle>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
