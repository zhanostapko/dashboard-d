"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { saveRepairAction, SaveRepairState } from "@/app/actions/repairs";
// import {
//   Command,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
import ErrorState from "@/components/Error";
import labelsData from "@/data/labels.json";
import RepairItemTable from "./RepairItemTable";
import {
  RepairDto,
  repairFormSchema,
  RepairFormValues,
  RepairItemDto,
} from "@/modules/repairs/schema";
// import { ClientDto } from "@/modules/clients/schema";

type Props = {
  onClose: () => void;
  repair?: RepairDto;
  editMode?: boolean;
};

const initialState: SaveRepairState = {
  errors: null,
  success: null,
  formData: null,
};

const CreateRepairForm = ({ repair, onClose, editMode = false }: Props) => {
  const [state, formAction, isSubmitting] = useActionState(
    saveRepairAction,
    initialState,
  );
  const [items, setItems] = useState<RepairItemDto[]>(repair?.items || []);
  // const [clients, setClients] = useState<ClientDto[]>([]);
  // const [clientsLoading, setClientsLoading] = useState(false);
  // const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  // const [clientsLoadError, setClientsLoadError] = useState<string | null>(null);
  // const [clientQuery, setClientQuery] = useState("");

  const { repairForm, date } = labelsData.ru.repairs;
  // const {
  //   selectClient,
  //   searchClient,
  //   clearClient,
  //   error: clientsError,
  // } = labelsData.ru.clients;

  const {
    saveRepairButton,
    createRepairButton,
    clientInformation,
    carInformation,
    repairItems,
    createTitle,
    editTitle,
    saving,
  } = repairForm;

  const { title, clientName, phone } = clientInformation;

  const { brand, mileage, model, plate, title: carTitle } = carInformation;

  const { title: itemsTitle } = repairItems;

  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      id: repair?.id || 0,
      date: repair?.date ? format(new Date(repair.date), "yyyy-MM-dd") : "",
      clientName: repair?.clientName || "",
      clientPhone: repair?.clientPhone || "",
      carBrand: repair?.carBrand || "",
      carModel: repair?.carModel || "",
      carPlate: repair?.carPlate || "",
      carMileage: repair?.carMileage || "",
      items: repair?.items || [],
    },
  });

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  // useEffect(() => {
  //   let isActive = true;

  //   const loadClients = async () => {
  //     setClientsLoading(true);
  //     setClientsLoadError(null);
  //     try {
  //       const res = await fetch("/api/clients");
  //       if (!res.ok) {
  //         throw new globalThis.Error("Failed to load clients");
  //       }
  //       const data = (await res.json()) as ClientDto[];
  //       if (isActive) {
  //         setClients(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       if (isActive) {
  //         setClientsLoadError(clientsError);
  //       }
  //     } finally {
  //       if (isActive) {
  //         setClientsLoading(false);
  //       }
  //     }
  //   };

  //   loadClients();

  //   return () => {
  //     isActive = false;
  //   };
  // }, [clientsError]);

  // useEffect(() => {
  //   if (!repair || selectedClientId || clients.length === 0) return;

  //   const matchedClient = clients.find((client) => {
  //     const phoneMatch = (client.phone ?? "") === (repair.clientPhone ?? "");
  //     return client.name === repair.clientName && phoneMatch;
  //   });

  //   if (matchedClient) {
  //     setSelectedClientId(matchedClient.id);
  //   }
  // }, [clients, repair, selectedClientId]);

  function onSubmit(values: RepairFormValues) {
    startTransition(() => {
      formAction({ ...values });
    });
  }

  const handleAddItem = (item: RepairItemDto) => {
    const newItems = [...items, item];
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const handleRemoveItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    form.setValue("items", newItems, { shouldValidate: true });
  };

  // const filteredClients =
  //   clientQuery.trim().length < 3
  //     ? []
  //     : clients.filter((client) => {
  //         const query = clientQuery.trim().toLowerCase();
  //         const haystack = [
  //           client.name,
  //           client.phone,
  //           client.email,
  //           client.regNr,
  //         ]
  //           .filter(Boolean)
  //           .join(" ")
  //           .toLowerCase();
  //         return haystack.includes(query);
  //       });

  // const applyClient = (client: ClientDto) => {
  //   setSelectedClientId(client.id);
  //   form.setValue("clientName", client.name ?? "", { shouldValidate: true });
  //   form.setValue("clientPhone", client.phone ?? "", { shouldValidate: true });
  // };

  // const clearClientFields = () => {
  //   setSelectedClientId(null);
  //   form.setValue("clientName", "", { shouldValidate: true });
  //   form.setValue("clientPhone", "", { shouldValidate: true });
  // };

  return (
    <div className=" space-y-2">
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? `${editTitle}` : `${createTitle}`}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input type="hidden" {...field} value={repair?.id} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{date}*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <h3 className="text-md font-bold mb-4">{title}</h3>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>{selectClient}</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearClientFields}
                  disabled={!selectedClientId}
                >
                  {clearClient}
                </Button>
              </div>
              <Command className="border rounded-md">
                <CommandInput
                  placeholder={searchClient}
                  value={clientQuery}
                  onValueChange={setClientQuery}
                />
                {clientQuery.trim().length >= 3 && clientsLoading && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}
                {clientQuery.trim().length >= 3 &&
                  filteredClients.length > 0 && (
                    <CommandList>
                      <CommandGroup>
                        {filteredClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.name} ${client.phone ?? ""} ${
                              client.email ?? ""
                            } ${client.regNr ?? ""}`}
                            onSelect={() => applyClient(client)}
                          >
                            <div className="flex flex-col">
                              <span>{client.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {client.phone ||
                                  client.email ||
                                  client.regNr ||
                                  ""}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
              </Command>
              {clientsLoadError && (
                <p className="text-sm text-red-500">{clientsLoadError}</p>
              )}
            </div> */}
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientName}*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{phone}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* </div> */}

          <Separator />
          <h3 className="text-md font-bold mb-4">{carTitle}</h3>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="carBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{brand}*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{model}*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carPlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{plate}*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carMileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mileage}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <FormLabel>{itemsTitle}*</FormLabel>
                <FormControl>
                  <RepairItemTable
                    items={items}
                    handleAdd={handleAddItem}
                    handleRemove={handleRemoveItem}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {state.errors && <ErrorState />}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-green-500 text-white"
          >
            {isSubmitting
              ? `${saving}`
              : editMode
                ? `${saveRepairButton}`
                : `${createRepairButton}`}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateRepairForm;
