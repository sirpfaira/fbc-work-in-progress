"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  BLeagueSchema,
  BLeague,
  TFixture,
  ILeague,
  IFixture,
} from "@/lib/schemas/fixture";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import CustomDialog from "@/app/components/common/CustomDialog";
import PageTitle from "@/app/components/common/PageTitle";
import TimeStamp from "@/app/components/common/TimeStamp";
import { TCompetition } from "@/lib/schemas/competition";
import { Download, Loader2, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@/app/components/common/DateTimePicker";
import { TTrending } from "@/lib/schemas/trending";
import { autoMarkets } from "@/lib/constants";
import { getTrendingResult } from "@/lib/helpers";

export default function FetchFixtures() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [leagues, setLeagues] = useState<ILeague[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isFetchingLeague, setIsFetchingLeague] = useState<boolean>(false);

  const {
    data: fixtures,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures`);
      return data.items as TFixture[];
    },
  });

  const { data: competitions } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions`);
      return data.items as TCompetition[];
    },
  });

  const { data: trendings } = useQuery({
    queryKey: ["trendings"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trendings`);
      return data.items as TTrending[];
    },
  });

  useEffect(() => {
    function getInitialLeagues(
      trendings: TTrending[],
      competitions: TCompetition[]
    ) {
      const nullTrending = trendings.filter((item) => {
        return item.result === null && isFixtureFinished(item.date);
      });

      const newLeagues: ILeague[] = competitions.map((item) => ({
        uid: item.uid,
        name: item.name,
        season: item.season,
        date: new Date().toISOString(),
        count: 0,
        auto: 0,
        fetched: false,
        error: false,
      }));

      const result: ILeague[] = newLeagues.map((league) => {
        for (const trend of nullTrending) {
          if (league.uid === trend.competition) {
            league.count++;
            if (new Date(trend.date) < new Date(league.date)) {
              league.date = trend.date;
            }
            if (autoMarkets.includes(trend.market)) {
              league.auto++;
            }
          }
        }
        return league;
      });

      const final: ILeague[] = result.filter((item) => item.count > 0);
      return final;
    }
    if (trendings && competitions) {
      const leagues = getInitialLeagues(trendings, competitions);
      setLeagues(leagues);
    }
  }, [trendings, competitions]);

  const { mutate: fetchLeague } = useMutation({
    mutationFn: async (league: ILeague) =>
      await axios.post(`/api/sports-api/fixtures`, league),
    onSuccess: (response: any) => {
      const matches = response.data.items as IFixture[];
      updateFixtures(matches);
    },
    onError: (response: any) => {
      setIsFetchingLeague(false);
      toast({
        title: "Error!",
        description: response?.message,
        variant: "destructive",
      });
    },
  });

  function isFixtureFinished(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = diffInMs / (1000 * 60);
    return diffInMins >= 120;
  }

  function validateLeagues(trendings: TTrending[], leagues: ILeague[]) {
    const nullTrending = trendings.filter((item) => {
      return item.result === null && isFixtureFinished(item.date);
    });

    const result: ILeague[] = leagues.map((league) => {
      league.date = new Date().toISOString();
      league.count = 0;
      league.auto = 0;
      for (const trend of nullTrending) {
        if (league.uid === trend.competition) {
          league.count++;
          if (new Date(trend.date) < new Date(league.date)) {
            league.date = trend.date;
          }
          if (autoMarkets.includes(trend.market)) {
            league.auto++;
          }
        }
      }
      return league;
    });

    const final: ILeague[] = result.filter((item) => item.count > 0);
    return final;
  }

  async function updateTrendings(newFixture: TFixture) {
    try {
      if (trendings && trendings.length > 0) {
        const fixtureTrendings = trendings.filter(
          (i) => i.fixture === newFixture.uid && i.result === null
        );

        if (fixtureTrendings.length > 0) {
          for (const trend of fixtureTrendings) {
            if (autoMarkets.includes(trend.market)) {
              const result = getTrendingResult(newFixture, trend.market);
              trend.result = result;
              await axios.put(`/api/trendings/${trend._id}`, trend);
            }
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error?.message,
        variant: "destructive",
      });
    }
  }

  async function updateFixtures(newFixtures: IFixture[]) {
    try {
      if (fixtures) {
        if (newFixtures.length > 0) {
          const brandNewFixtures: IFixture[] = [];
          for (const newFixture of newFixtures) {
            const oldFixture = fixtures.find((f) => f.uid === newFixture.uid);
            if (oldFixture) {
              if (oldFixture.scores.fullTime !== newFixture.scores.fullTime) {
                oldFixture.status = newFixture.status;
                oldFixture.scores.halfTime = newFixture.scores.halfTime;
                oldFixture.scores.fullTime = newFixture.scores.fullTime;
                oldFixture.scores.extraTime = newFixture.scores.extraTime;
                oldFixture.scores.penalties = newFixture.scores.penalties;
                await axios.put(`/api/fixtures/${oldFixture._id}`, oldFixture);
                updateTrendings(oldFixture);
              }
            } else {
              brandNewFixtures.push(newFixture);
            }
          }
          if (brandNewFixtures.length > 0) {
            const response = await axios.post(
              `/api/batch/fixtures`,
              brandNewFixtures
            );
            if (response.status !== 200) {
              throw new Error("Failed to add new fixtures!");
            }
          }
          toast({
            title: "Added Successfully!",
            description: "Fetching league completed successfully!",
          });
          queryClient.invalidateQueries({
            queryKey: ["fixtures"],
            exact: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["trendings"],
            exact: true,
          });
          const response = await axios.get(`/api/trendings`);
          if (response.status === 200) {
            const newTrendings = response?.data?.items as TTrending[];
            if (newTrendings && competitions) {
              const newLeagues = validateLeagues(newTrendings, leagues);
              setLeagues(newLeagues);
            }
          }
          setIsFetchingLeague(false);
        } else {
          throw new Error("No fixtures received from API!");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error?.message,
        variant: "destructive",
      });
    }
  }

  const handleFetchLeague = (uid: number) => {
    setIsFetchingLeague(true);
    const league = leagues.find((i) => i.uid === uid);
    if (league) {
      const newLeagues = leagues.map((item) => {
        if (item.uid === uid) {
          item.fetched = true;
          return item;
        } else {
          return item;
        }
      });
      setLeagues(newLeagues);
      fetchLeague(league);
    }
  };

  function handleAddLeague(data: BLeague) {
    const item = leagues.find((i) => i.uid == data.competition);
    if (item) {
      const newLeagues = leagues.map((item) => {
        if (item.uid == data.competition) {
          item.date = data.date?.toISOString();
          return item;
        } else {
          return item;
        }
      });
      setLeagues(newLeagues);
      toast({
        title: "League date updated!",
        description: "League with that uid already exists!",
      });
    } else {
      const newItem: ILeague = {
        uid: data.competition,
        name:
          competitions?.find((i) => i.uid == data.competition)?.name ||
          "No competition",
        season:
          competitions?.find((i) => i.uid == data.competition)?.season ||
          999999,
        date: new Date().toISOString(),
        count: 999,
        auto: 1,
        fetched: false,
      };
      setLeagues([newItem, ...leagues]);
    }
    setIsAddOpen(false);
  }

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Fetch fixtures" link="/admin/manage-fixtures" />
      </div>
      {isLoading ? (
        <TableSkeleton columns={2} />
      ) : (
        <>
          {fixtures && competitions && trendings && (
            <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
              <div className="flex w-full">
                {leagues?.length > 0 ? (
                  <div className="flex flex-col space-y-4 w-full card p-3">
                    <div className="flex justify-between border-b border-border">
                      <p>Competitions to fetch</p>
                      <Button
                        onClick={() => setIsAddOpen(true)}
                        variant={"ghost"}
                      >
                        <PlusCircle size={26} />
                      </Button>
                    </div>

                    <div className="flex flex-col w-full space-y-2 mt-3 divide-y divide-border border border-border p-3">
                      {leagues
                        ?.sort((a, b) => b.auto - a.auto)
                        ?.map((item) => (
                          <div key={item.uid} className="flex flex-col w-full">
                            <div className="flex flex-col">
                              <p className="font-medium">{`${item.uid}. ${item.name}`}</p>
                            </div>
                            <div className="flex justify-between">
                              <TimeStamp date={item.date} />
                            </div>
                            <div className="flex justify-between">
                              <div className="flex space-x-2">
                                <span className="bg-primary text-primary-foreground px-2 rounded-md text-small">
                                  {`${item.auto}/${item.count}`}
                                </span>
                                {item.fetched ? (
                                  <span className="bg-rating-top px-2 text-small rounded-md">
                                    fetched
                                  </span>
                                ) : (
                                  <span className="bg-muted px-2 text-small rounded-md">
                                    not fetched
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => {
                                    handleFetchLeague(item.uid);
                                  }}
                                  disabled={item.auto < 1}
                                  className={
                                    item.auto < 1
                                      ? "text-icon-inactive"
                                      : "text-rating-top"
                                  }
                                >
                                  <Download size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center w-full card px-4 py-2">
                    <p>No competitions to fetch!</p>
                    <Button
                      onClick={() => setIsAddOpen(true)}
                      variant={"ghost"}
                    >
                      <PlusCircle size={26} />
                    </Button>
                  </div>
                )}
                <CustomDialog
                  isOpen={isAddOpen}
                  setIsOpen={setIsAddOpen}
                  title="Add"
                  description="Add a league to fetch"
                >
                  <AddForm
                    handleAddLeague={handleAddLeague}
                    setIsOpen={setIsAddOpen}
                  />
                </CustomDialog>
                <Dialog open={isFetchingLeague}>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogDescription>
                        <div className="flex space-x-1 items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Fetching fixtures from the Sports API!</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="hidden lg:flex flex-col card p-6">
                <span>Sidebar</span>
                {/* <div className="border border-border p-5 divide-y divide-border text-small">
                 {fetched.map((item) => (
                   <div className="flex flex-col" key={item.uid}>
                     <span>{item.teams}</span>
                   </div>
                 ))}
               </div> */}
                <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
                  <code className="text-sky-600">
                    {JSON.stringify(leagues, null, 2)}
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

interface AddFormProps {
  handleAddLeague: (values: BLeague) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function AddForm({ handleAddLeague, setIsOpen }: AddFormProps) {
  const { data: competitions } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions`);
      return data.items as TCompetition[];
    },
  });

  const form = useForm<BLeague>({
    resolver: zodResolver(BLeagueSchema),
    mode: "onBlur",
  });

  const onSubmit = (values: BLeague) => {
    handleAddLeague(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="competition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competition</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a competition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {competitions?.map((item) => (
                    <SelectItem key={item.uid} value={String(item.uid)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.competition && (
                <FormMessage>
                  {form.formState.errors.competition.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fixture date</FormLabel>
              <DateTimePicker setDate={field.onChange} date={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center items-center space-x-3 pt-3">
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => setIsOpen(false)}
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
