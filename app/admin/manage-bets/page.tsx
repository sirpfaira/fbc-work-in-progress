"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown, SquarePen, Trash2 } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageTitle from "@/app/components/common/PageTitle";
import { Input } from "@/components/ui/input";
import {
  BBet,
  BBetInfo,
  BBetInfoSchema,
  BCode,
  BCodeSchema,
  BSelection,
  BSelectionSchema,
  CBet,
  IBet,
  ISelection,
} from "@/lib/schemas/bet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TPlatform } from "@/lib/schemas/platform";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TDummy } from "@/lib/schemas/dummy";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import { TFixture } from "@/lib/schemas/fixture";
import { TOddSelector } from "@/lib/schemas/oddselector";
import TimeStamp from "@/app/components/common/TimeStamp";
import { getShortDate } from "@/lib/helpers";
import Link from "next/link";

const rawSelections = [
  {
    fixture: 1035514,
    fixtureName: "Brighton v Bournemouth",
    market: 101,
    marketName: "Match Result (1X2) · Home",
    competition: 39,
    competitionName: "ENG · Premier League",
    date: "2024-11-28T13:00:00.000Z",
  },
  {
    fixture: 1035428,
    fixtureName: "Chelsea v Tottenham",
    market: 201,
    marketName: "Both Teams To Score · Yes",
    competition: 39,
    competitionName: "ENG · Premier League",
    date: "2024-12-08T13:00:00.000Z",
  },
];

const rawCodes = [
  {
    platform: "Betway_-_South_Africa",
    value: "DVC5RDEWK",
    username: "kai_wandi",
    flagged: [],
  },
  {
    platform: "GBets_-_South_Africa",
    value: "S5PVC5EP",
    username: "kai_wandi2",
    flagged: [],
  },
];

export default function Create() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const initial: CBet = {
    username: "",
    title: "",
    selections: rawSelections,
    codes: rawCodes,
  };
  const [newItem, setNewItem] = useState<CBet>(initial);
  const [isAddSelectionOpen, setIsAddSelectionOpen] = useState<boolean>(false);
  const [isDeleteAllSelectionsOpen, setIsDeleteAllSelectionsOpen] =
    useState<boolean>(false);
  const [isAddCodeOpen, setIsAddCodeOpen] = useState<boolean>(false);
  const [isDeleteAllCodesOpen, setIsDeleteAllCodesOpen] =
    useState<boolean>(false);

  const { data: platforms } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  const { data: fixtures } = useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures`);
      return data.items as TFixture[];
    },
  });

  const { data: oddselectors } = useQuery({
    queryKey: ["oddselectors"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/oddselectors`);
      return data.items as TOddSelector[];
    },
  });

  const {
    data: dummies,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dummies"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dummies`);
      return data.items as TDummy[];
    },
  });

  const form = useForm<BBetInfo>({
    resolver: zodResolver(BBetInfoSchema),
  });

  const { mutate: createDummyBet, isPending } = useMutation({
    mutationFn: async (bet: BBet) => await axios.post(`/api/bets`, bet),
    onSuccess: (response: any) => {
      toast({
        title: "Added Successfully!",
        description: response.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["bets"],
        exact: true,
      });
    },
    onError: (response: any) => {
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  function updateBetInfo(values: BBetInfo) {
    setNewItem({ ...newItem, username: values.username, title: values.title });
  }

  function addSelection(values: BSelection) {
    const newSelection: ISelection = {
      fixture: values.fixture,
      fixtureName:
        fixtures?.find((i) => i.uid === values.fixture)?.teams ||
        "No fixture name",
      market: values.market,
      marketName:
        oddselectors?.find((i) => i.uid === values.market)?.name ||
        "No market name",
      competition:
        fixtures?.find((i) => i.uid === values.fixture)?.competition || 999999,
      competitionName:
        fixtures?.find((i) => i.uid === values.fixture)?.competitionName ||
        "No competition name",
      date: fixtures?.find((i) => i.uid === values.fixture)?.date || "No date",
    };

    setNewItem({
      ...newItem,
      selections: [newSelection, ...newItem.selections],
    });
    setIsAddSelectionOpen(false);
    // if (selectedFixture && selectedMarket) {
    //   // check if id already exists
    //   const selectionExists = selections.find(
    //     (s) => s.fixtureId === parseInt(selectedFixture?.split("-")?.[0])
    //   );
    //   if (selectionExists) {
    //     toast({
    //       title: "Invalid input!",
    //       description: "Selected fixture already exists in your bet!",
    //     });
    //     return;
    //   }
    //   const selectedFullFixture = fixtureOptions.find(
    //     (i) => i.value === selectedFixture
    //   );
    //   const selectedFullMarket = marketOptions.find(
    //     (i) => i.value === selectedMarket
    //   );
    //   if (selectedFullMarket && selectedFullFixture) {
    //     setSelections([
    //       {
    //         marketId: parseInt(selectedFullMarket?.value?.split("-")?.[0]),
    //         marketName: selectedFullMarket.label,
    //         fixtureId: parseInt(selectedFullFixture?.value?.split("-")?.[0]),
    //         fixtureName: selectedFullFixture.label,
    //       },
    //       ...selections,
    //     ]);
    //     // setSelectedMarket("")
    //     setSelectedFixture("");
    //   }
    // } else {
    //   toast({
    //     title: "Invalid input!",
    //     description: "Fixture and market is required!",
    //   });
    // }
  }

  function editSelection(data: ISelection) {}

  function deleteSelection(data: ISelection) {
    setNewItem({
      ...newItem,
      selections: newItem?.selections?.filter(
        (item) =>
          !(item.fixture === data.fixture && item.market === data.market)
      ),
    });
  }

  function deleteAllSelections() {
    setNewItem({
      ...newItem,
      selections: [],
    });
    setIsDeleteAllSelectionsOpen(false);
  }

  const addCode = (data: BCode) => {
    const newCode = {
      username: newItem.username,
      platform: data.platform,
      value: data.value,
      flagged: [],
    };

    setNewItem({
      ...newItem,
      codes: [newCode, ...newItem.codes],
    });
    setIsAddCodeOpen(false);
    // if (!selectedPlatform || !bettingCode) {
    //   toast({
    //     title: "Invalid input!",
    //     description: "Please select a platform and fill in a betting code!",
    //   });
    //   return;
    // }
    // // check if id already exists
    // const codeExists = codes.find(
    //   (code) =>
    //     !(
    //       code.platformId === parseInt(selectedPlatform?.split("-")?.[0]) &&
    //       code.code === bettingCode
    //     )
    // );
    // if (codeExists) {
    //   toast({
    //     title: "Invalid input!",
    //     description: "Selected platform already exists in your platform codes!",
    //   });
    //   return;
    // }
    // const selectedFullPlatform = platformOptions.find(
    //   (i) => i.value === selectedPlatform
    // );
    // if (selectedFullPlatform) {
    //   setCodes([
    //     {
    //       platformId: parseInt(selectedFullPlatform?.value?.split("-")?.[0]),
    //       platformName: selectedFullPlatform.label,
    //       code: bettingCode,
    //     },
    //     ...codes,
    //   ]);
    //   setBettingCode("");
    // }
  };

  function editCode(data: BCode) {}

  function deleteCode(data: BCode) {
    setNewItem({
      ...newItem,
      codes: newItem?.codes?.filter(
        (item) =>
          !(item.platform === data.platform && item.value === data.value)
      ),
    });
  }

  function deleteAllCodes() {
    setNewItem({
      ...newItem,
      codes: [],
    });
    setIsDeleteAllCodesOpen(false);
  }

  const handleSaveToDatabase = () => {
    if (
      newItem.username !== "" &&
      newItem.title.trim() !== "" &&
      (newItem.selections.length > 0 || newItem.codes.length > 0)
    ) {
      const selections: string[] = newItem.selections?.map((item) => {
        return `${item.fixture}-${item.market}-${getShortDate(item.date)}`;
      });
      const databaseItem: IBet = {
        uid: `${newItem.username}-${getShortDate(new Date().toISOString())}`,
        username: newItem.username,
        title: newItem.title,
        boom: [],
        doom: [],
        selections: selections,
        codes: newItem.codes,
      };
      // createDummyBet(databaseItem);
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
            <code className="text-sky-600">
              {JSON.stringify(databaseItem, null, 2)}
            </code>
          </pre>
        ),
      });
    } else {
      toast({
        title: "Error!",
        description: "Missing data!",
        variant: "destructive",
      });
    }
  };

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Create Dummy Bet" link="/admin" />
      </div>

      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {dummies && oddselectors && fixtures && platforms && (
            <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
              <div className="flex flex-col space-y-5 card p-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(updateBetInfo)}
                    className="space-y-6 border border-border p-4 rounded-md w-full"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bet Title</FormLabel>
                          <FormControl>
                            <Input placeholder="My Bet 1" {...field} />
                          </FormControl>
                          {form.formState.errors.title && (
                            <FormMessage>
                              {form.formState.errors.title.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dummy Username</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? dummies.find(
                                        (item) => item.username === field.value
                                      )?.realname
                                    : "Select dummy"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search dummy..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No language found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {dummies.map((item) => (
                                      <CommandItem
                                        value={item.realname}
                                        key={item.username}
                                        onSelect={() => {
                                          form.setValue(
                                            "username",
                                            item.username
                                          );
                                        }}
                                      >
                                        {item.realname}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            item.username === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            This is the language that will be used in the
                            dashboard.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Update</Button>
                  </form>
                </Form>
                {newItem.username.trim() !== "" && (
                  <div className="flex flex-col space-y-5">
                    <div className="border border-border px-4 rounded-md">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <span className="text-big font-medium">
                              Selections
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col divide-y divide-border border border-border px-3 rounded-md">
                              <div className="flex space-x-2 my-3">
                                <Button
                                  variant={"outline"}
                                  onClick={() => setIsAddSelectionOpen(true)}
                                >
                                  Add selection
                                </Button>
                                <Button
                                  variant={"outline"}
                                  disabled={newItem.selections.length < 1}
                                  onClick={() =>
                                    setIsDeleteAllSelectionsOpen(true)
                                  }
                                >
                                  Delete all
                                </Button>
                              </div>
                              {newItem?.selections ? (
                                <>
                                  {newItem?.selections.map((item) => (
                                    <div
                                      key={`${item.fixture}-${item.market}-${item.date}`}
                                      className="flex flex-col pt-2 pb-3"
                                    >
                                      <span>{`${item.fixture}: ${item.fixtureName}`}</span>
                                      <span>{`${item.market}: ${item.marketName}`}</span>
                                      <span>{`${item.competition}: ${item.competitionName}`}</span>
                                      <div className="flex justify-between items-center">
                                        <TimeStamp date={item.date} />
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() => {
                                              editSelection(item);
                                            }}
                                            className="text-rating-top"
                                          >
                                            <SquarePen size={16} />
                                          </button>
                                          <button
                                            onClick={() =>
                                              deleteSelection(item)
                                            }
                                            className="text-destructive"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <span className="py-3 ">
                                  No selections to show
                                </span>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div className="border border-border px-4 rounded-md">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <span className="text-big font-medium">Codes</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col divide-y divide-border border border-border px-3 rounded-md">
                              <div className="flex space-x-2 my-3">
                                <Button
                                  variant={"outline"}
                                  onClick={() => setIsAddCodeOpen(true)}
                                >
                                  Add code
                                </Button>
                                <Button
                                  variant={"outline"}
                                  disabled={newItem.codes.length < 1}
                                  onClick={() => setIsDeleteAllCodesOpen(true)}
                                >
                                  Delete all
                                </Button>
                              </div>
                              {newItem?.codes ? (
                                <>
                                  {newItem?.codes.map((item) => (
                                    <div className="flex flex-col pt-2 pb-3">
                                      <div className="flex flex-col">
                                        <span>
                                          {item.platform?.replaceAll("_", " ")}
                                        </span>
                                        <span>@{item.username}</span>
                                      </div>
                                      <div
                                        key={`${item.platform}-${item.value}`}
                                        className="flex justify-between items-center"
                                      >
                                        <span>{item.value}</span>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() => {
                                              editCode(item);
                                            }}
                                            className="text-rating-top"
                                          >
                                            <SquarePen size={16} />
                                          </button>
                                          <button
                                            onClick={() => deleteCode(item)}
                                            className="text-destructive"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <span className="py-3 ">No codes to show</span>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <div className="w-full flex justify-end items-center space-x-3 p-3 card border border-border">
                      <Button
                        disabled={isPending}
                        isLoading={isPending}
                        onClick={handleSaveToDatabase}
                      >
                        Submit
                      </Button>
                      <Link
                        href={`/admin`}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                )}
                <CustomDialog
                  isOpen={isAddSelectionOpen}
                  setIsOpen={setIsAddSelectionOpen}
                  title="Delete All Items"
                  description="Are you sure you want to delete all items?"
                >
                  <AddSelection
                    addSelection={addSelection}
                    fixtures={fixtures}
                    oddselectors={oddselectors}
                    setIsAddSelectionOpen={setIsAddSelectionOpen}
                  />
                </CustomDialog>
                <CustomDialog
                  isOpen={isDeleteAllSelectionsOpen}
                  setIsOpen={setIsDeleteAllSelectionsOpen}
                  title="Delete All Items"
                  description="Are you sure you want to delete all items?"
                >
                  <div className="w-full grid grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsDeleteAllSelectionsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      onClick={deleteAllSelections}
                      variant="destructive"
                    >
                      Delete all
                    </Button>
                  </div>
                </CustomDialog>
                <CustomDialog
                  isOpen={isAddCodeOpen}
                  setIsOpen={setIsAddCodeOpen}
                  title="Delete All Items"
                  description="Are you sure you want to delete all items?"
                >
                  <AddCode
                    addCode={addCode}
                    platforms={platforms}
                    setIsAddCodeOpen={setIsAddCodeOpen}
                  />
                </CustomDialog>
                <CustomDialog
                  isOpen={isDeleteAllCodesOpen}
                  setIsOpen={setIsDeleteAllCodesOpen}
                  title="Delete All Items"
                  description="Are you sure you want to delete all items?"
                >
                  <div className="w-full grid grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsDeleteAllCodesOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      onClick={deleteAllCodes}
                      variant="destructive"
                    >
                      Delete all
                    </Button>
                  </div>
                </CustomDialog>
              </div>
              <div className="hidden lg:flex flex-col card p-6">
                <span>Sidebar</span>
                <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
                  <code className="text-sky-600">
                    {JSON.stringify(newItem, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface AddSelectionProps {
  addSelection: (values: BSelection) => void;
  fixtures: TFixture[];
  oddselectors: TOddSelector[];
  setIsAddSelectionOpen: Dispatch<SetStateAction<boolean>>;
}

function AddSelection({
  addSelection,
  fixtures,
  oddselectors,
  setIsAddSelectionOpen,
}: AddSelectionProps) {
  const form = useForm<BSelection>({
    resolver: zodResolver(BSelectionSchema),
  });

  const onSubmit = async (values: BSelection) => {
    addSelection(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="fixture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixture</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fixture" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fixtures?.map((item) => (
                    <SelectItem key={item.uid} value={String(item.uid)}>
                      {item.teams}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="market"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a market" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {oddselectors?.map((item) => (
                    <SelectItem key={item.uid} value={String(item.uid)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center space-x-3">
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => setIsAddSelectionOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface AddCodeProps {
  addCode: (values: BCode) => void;
  platforms: TPlatform[];
  setIsAddCodeOpen: Dispatch<SetStateAction<boolean>>;
}

function AddCode({ addCode, platforms, setIsAddCodeOpen }: AddCodeProps) {
  const form = useForm<BCode>({
    resolver: zodResolver(BCodeSchema),
  });

  const onSubmit = async (values: BCode) => {
    addCode(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="MN67YGT34T" {...field} />
              </FormControl>
              {form.formState.errors.value && (
                <FormMessage>{form.formState.errors.value.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms?.map((item) => (
                    <SelectItem key={item.uid} value={item.uid}>
                      {item?.uid?.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center space-x-3">
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => setIsAddCodeOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}