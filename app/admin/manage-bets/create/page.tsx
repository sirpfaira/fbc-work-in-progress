"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  SquarePen,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
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
  BBetInfo,
  BBetInfoSchema,
  BCode,
  BCodeSchema,
  XSelection,
  XSelectionSchema,
  CBet,
  ISelection,
} from "@/lib/schemas/bet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TPlatform } from "@/lib/schemas/platform";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { utils, writeFile } from "xlsx";
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
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import { TFixture } from "@/lib/schemas/fixture";
import { TOddSelector } from "@/lib/schemas/oddselector";
import TimeStamp from "@/app/components/common/TimeStamp";
import { getShortDate } from "@/lib/helpers/common";
import Link from "next/link";
import AddPunterForm from "@/app/admin/manage-dummies/AddForm";
import moment from "moment";

export default function Create() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const initialSelection: ISelection = {
    uid: "",
    fixture: 0,
    fixtureName: "",
    market: 101,
    marketName: "",
    competition: 0,
    competitionName: "",
    date: "",
    value: 1,
  };

  const initialBet: CBet = {
    user: "",
    title: `My Bet ${getShortDate(new Date().toISOString())}`,
    selections: [],
    codes: [],
  };

  const [newItem, setNewItem] = useState<CBet>(initialBet);
  const [isAddSelectionOpen, setIsAddSelectionOpen] = useState<boolean>(false);
  const [isDeleteAllSelectionsOpen, setIsDeleteAllSelectionsOpen] =
    useState<boolean>(false);
  const [oldSelection, setOldSelection] =
    useState<ISelection>(initialSelection);
  const [isAddCodeOpen, setIsAddCodeOpen] = useState<boolean>(false);
  const [isDeleteAllCodesOpen, setIsDeleteAllCodesOpen] =
    useState<boolean>(false);
  const [isAddPunterOpen, setIsAddPunterOpen] = useState<boolean>(false);

  const {
    data: fixtures,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["current-fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures?filter=current`);
      const result = data.items as TFixture[];
      return result?.sort((a, b) =>
        a.teams > b.teams ? 1 : b.teams > a.teams ? -1 : 0
      );
    },
  });

  const { data: platforms } = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/platforms`);
      return data.items as TPlatform[];
    },
  });

  const { data: oddselectors } = useQuery({
    queryKey: ["oddselectors"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/oddselectors`);
      return data.items as TOddSelector[];
    },
  });

  const { data: dummies } = useQuery({
    queryKey: ["dummies"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dummies`);
      return data.items as TDummy[];
    },
  });

  const form = useForm<BBetInfo>({
    resolver: zodResolver(BBetInfoSchema),
    defaultValues: {
      title: `My Bet ${getShortDate(new Date().toISOString())}`,
      user: "",
    },
  });

  const { mutate: createDummyBet, isPending } = useMutation({
    mutationFn: async (bet: CBet) => await axios.post(`/api/bets`, bet),
    onSuccess: (response: any) => {
      toast({
        title: "Bet Added Successfully!",
        description: response.data.message,
      });
      deleteAllCodes();
      queryClient.invalidateQueries({
        queryKey: ["bets"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["trending"],
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
    setNewItem({
      ...newItem,
      user: values.user,
      title: values.title,
    });
  }

  function getNewSelection(values: ISelection) {
    const newSelection: ISelection = {
      uid: getShortDate(new Date().toISOString()),
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
      value:
        fixtures
          ?.find((i) => i.uid === values.fixture)
          ?.odds.find((x) => x._id === values.market)?.value || 1,
    };
    return newSelection;
  }

  function addSelection(values: ISelection) {
    if (values.uid === "") {
      const selectionExists = newItem.selections.find(
        (item) => item.fixture === values.fixture
      );
      if (selectionExists) {
        toast({
          title: "Invalid input!",
          description: "Selected fixture already exists in your bet!",
          variant: "destructive",
        });
        return;
      }
      const newSelection = getNewSelection(values);
      setNewItem({
        ...newItem,
        selections: [newSelection, ...newItem.selections],
      });
    } else {
      const otherSelections = newItem.selections.filter(
        (item) => item.uid !== values.uid
      );
      const selectionExists = otherSelections.find(
        (item) => item.fixture === values.fixture
      );
      if (selectionExists) {
        toast({
          title: "Invalid input!",
          description: "Selected fixture already exists in your bet!",
          variant: "destructive",
        });
        return;
      }
      const newSelections = newItem.selections.map((item) => {
        if (item.uid == values.uid) {
          return getNewSelection(values);
        } else {
          return item;
        }
      });
      setNewItem({ ...newItem, selections: newSelections });
    }
    const initialSelection2 = { ...initialSelection, market: values.market };
    setOldSelection(initialSelection2);
    setIsAddSelectionOpen(false);
  }

  function editSelection(values: ISelection) {
    setOldSelection(values);
    setIsAddSelectionOpen(true);
  }

  function deleteSelection(data: ISelection) {
    setNewItem({
      ...newItem,
      selections: newItem?.selections?.filter((item) => item.uid !== data.uid),
    });
  }

  function deleteAllSelections() {
    setNewItem({
      ...newItem,
      selections: [],
    });
    setIsDeleteAllSelectionsOpen(false);
  }

  const addCode = (values: BCode) => {
    const platformExists = newItem.codes.find(
      (item) => item.platform === values.platform
    );
    if (platformExists) {
      toast({
        title: "Invalid input!",
        description: "Selected platform already exists in your bet!",
        variant: "destructive",
      });
      return;
    }

    const newCode = {
      username: newItem.user,
      platform: values.platform,
      country:
        platforms?.find((i) => i.uid === values.platform)?.country ||
        "No Country",
      value: values.value,
      flagged: [],
    };

    setNewItem({
      ...newItem,
      codes: [newCode, ...newItem.codes],
    });
    setIsAddCodeOpen(false);
  };

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
      newItem.user !== "" &&
      newItem.title.trim() !== "" &&
      (newItem.selections.length > 0 || newItem.codes.length > 0)
    ) {
      createDummyBet(newItem);
    } else {
      toast({
        title: "Error!",
        description: "Missing data!",
        variant: "destructive",
      });
    }
  };

  function downloadFixtures() {
    if (fixtures) {
      const exportArray = fixtures.map((item) => {
        return {
          uid: item.uid,
          teams: item.teams,
          date: moment(item.date).format("DD/MM/YYYY"),
        };
      });
      const headings = [["UID", "Teams", "Date"]];
      const wb = utils.book_new();
      const ws = utils.json_to_sheet([]);
      utils.sheet_add_aoa(ws, headings);
      utils.sheet_add_json(ws, exportArray, { origin: "A2", skipHeader: true });
      utils.book_append_sheet(wb, ws, "Fixtures");
      writeFile(wb, "Fixtures.xlsx");
    }
  }

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Create Dummy Bet" link="/admin/manage-bets" />
        <Button onClick={() => setIsAddPunterOpen(true)} variant={"ghost"}>
          <UserRoundPlus size={26} />
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {dummies && oddselectors && fixtures && platforms && (
            <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
              <div className="flex flex-col space-y-5 card p-4">
                <div className="border border-border px-4 rounded-md">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <span className="text-big font-medium">
                          Information
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
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
                              name="user"
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
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value
                                            ? dummies.find(
                                                (item) =>
                                                  item.username === field.value
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
                                                    "user",
                                                    item.username
                                                  );
                                                }}
                                              >
                                                {item.realname}
                                                <Check
                                                  className={cn(
                                                    "ml-auto",
                                                    item.username ===
                                                      field.value
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" variant={"outline"}>
                              Update
                            </Button>
                          </form>
                        </Form>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                {newItem.user.trim() !== "" && (
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
                                    <div
                                      key={`${item.platform}-${item.value}`}
                                      className="flex flex-col pt-2 pb-3"
                                    >
                                      <div className="flex flex-col">
                                        <span>
                                          {item.platform?.replaceAll("_", " ")}
                                        </span>
                                        <span>@{item.username}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>{item.value}</span>
                                        <div className="flex space-x-2">
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
                  title="Add Selection"
                  description="Add a new selection"
                >
                  <AddSelection
                    oldSelection={oldSelection}
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
                  title="Add code"
                  description="Add a booking code your bet"
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
                <CustomDialog
                  isOpen={isAddPunterOpen}
                  setIsOpen={setIsAddPunterOpen}
                  title="Add"
                >
                  <AddPunterForm setIsOpen={setIsAddPunterOpen} />
                </CustomDialog>
              </div>
              <div className="hidden lg:flex flex-col space-y-4 card p-6">
                <span>Sidebar</span>
                <div>
                  <Button onClick={downloadFixtures}>Download Fixtures</Button>
                </div>
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
  oldSelection: ISelection;
  addSelection: (values: ISelection) => void;
  fixtures: TFixture[];
  oddselectors: TOddSelector[];
  setIsAddSelectionOpen: Dispatch<SetStateAction<boolean>>;
}

function AddSelection({
  oldSelection,
  addSelection,
  fixtures,
  oddselectors,
  setIsAddSelectionOpen,
}: AddSelectionProps) {
  const form = useForm<XSelection>({
    defaultValues: {
      fixture: String(oldSelection.fixture),
      market: String(oldSelection.market),
    },
    resolver: zodResolver(XSelectionSchema),
  });

  const onSubmit = async (values: XSelection) => {
    const newItem = {
      uid: oldSelection.uid,
      fixture: Number(values.fixture),
      fixtureName: "",
      market: Number(values.market),
      marketName: "",
      competition: 0,
      competitionName: "",
      date: "",
      value: 1,
    };
    addSelection(newItem);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="fixture"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fixture</FormLabel>
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
                        ? fixtures.find(
                            (item) => item.uid === Number(field.value)
                          )?.teams
                        : "Select fixture"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search fixture..." />
                    <CommandList>
                      <CommandEmpty>No fixture found.</CommandEmpty>
                      <CommandGroup>
                        {fixtures.map((item) => (
                          <CommandItem
                            value={`${item.teams}|${item.uid}`}
                            key={item.uid}
                            onSelect={() => {
                              form.setValue("fixture", String(item.uid));
                            }}
                          >
                            {item.teams}
                            <Check
                              className={cn(
                                "ml-auto",
                                item.uid === Number(field.value)
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="market"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Market</FormLabel>
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
                        ? oddselectors.find(
                            (item) => item.uid === Number(field.value)
                          )?.name
                        : "Select market"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search market..." />
                    <CommandList>
                      <CommandEmpty>No market found.</CommandEmpty>
                      <CommandGroup>
                        {oddselectors
                          ?.sort((a, b) =>
                            a.uid > b.uid ? 1 : b.uid > a.uid ? -1 : 0
                          )
                          ?.map((item) => (
                            <CommandItem
                              value={`${item.name}|${item.uid}`}
                              key={item.uid}
                              onSelect={() => {
                                form.setValue("market", String(item.uid));
                              }}
                            >
                              {item.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  item.uid === Number(field.value)
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
    defaultValues: { value: "", platform: "Betway_-_South_Africa" },
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
