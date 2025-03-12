"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { format } from "date-fns";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";
import { scoresMarkets, statisticsMarkets } from "@/lib/constants";
import { IFixture, ILeague, TFixture } from "@/lib/schemas/fixture";
import { isFixtureFinished, updateFixturesInDatabase } from "@/lib/helpers/fixture";
import { TTrending } from "@/lib/schemas/trending";
import { TCompetition } from "@/lib/schemas/competition";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TimeStamp from "@/app/components/common/TimeStamp";

type FetchCards = {
  fixtures: TFixture[];
  trending: TTrending[];
  competitions: TCompetition[];
};

export default function FetchCards({
  fixtures,
  trending,
  competitions,
}: FetchCards) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fetched, setFetched] = useState<number[]>([]);

  const { mutate: fetchLeagueFixtures, isPending: isFetchingLeague } =
    useMutation({
      mutationFn: async (league: ILeague) =>
        await axios.post(`/api/external/sports-api/fixtures-by-league`, league),
      onSuccess: async (response: any) => {
        const matches = response.data.items as IFixture[];
        if (matches && matches.length > 0) {
          setIsProcessing(true);
          const errors = await updateFixturesInDatabase(
            fixtures,
            matches,
            trending,
            "scores"
          );
          queryClient.invalidateQueries({
            queryKey: ["fixtures"],
            exact: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["trending"],
            exact: true,
          });
          setErrors([...errors]);
          setIsProcessing(false);
          toast({
            title: "Success!",
            description: "Successfully updated fixtures & trending!",
          });
        } else {
          toast({
            title: "Error!",
            description: "No fixtures returned by API",
            variant: "destructive",
          });
        }
      },
      onError: (response: any) => {
        setErrors([response?.message]);
      },
    });

  const { mutate: fetchFixtureStats, isPending: isFetchingFixture } =
    useMutation({
      mutationFn: async (fixture: number) =>
        await axios.get(`/api/external/sports-api/fixture-by-id?fixture=${fixture}`),
      onSuccess: async (response: any) => {
        const matches = response.data.items as IFixture[];
        if (matches && matches.length > 0) {
          setIsProcessing(true);
          const errors = await updateFixturesInDatabase(
            fixtures,
            matches,
            trending,
            "statistics"
          );
          queryClient.invalidateQueries({
            queryKey: ["fixtures"],
            exact: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["trending"],
            exact: true,
          });
          setErrors([...errors]);
          setIsProcessing(false);
          toast({
            title: "Success!",
            description: "Successfully updated fixtures & trending!",
          });
        } else {
          toast({
            title: "Error!",
            description: "No fixture returned by API",
            variant: "destructive",
          });
        }
      },
      onError: (response: any) => {
        setErrors([response?.message]);
      },
    });

  const pending = trending.filter(
    (item) => item.result === null && isFixtureFinished(item.date)
  );

  const auto = pending?.filter((item) => scoresMarkets.includes(item.market));

  const statistics = pending?.filter((item) =>
    statisticsMarkets.includes(item.market)
  );

  const autoLeagues = Array.from(
    new Set(
      auto?.map((item) => {
        return item.competition;
      })
    )
  );

  const statisticsFixtures = Array.from(
    new Set(
      statistics?.map((item) => {
        return item.fixture;
      })
    )
  );

  function handleFetchLeague(competition: number) {
    const leagueFixtures = auto.filter(
      (item) => item.competition === competition
    );
    const oldestTrend = leagueFixtures.reduce((oldest, current) => {
      return new Date(current.date) < new Date(oldest.date) ? current : oldest;
    });
    const leagueToFetch: ILeague = {
      uid: competition,
      date: format(oldestTrend.date, "yyyy-MM-dd"),
      season:
        competitions?.find((item) => item.uid == competition)?.season ||
        new Date().getFullYear(),
    };
    setErrors([]);
    setFetched([...fetched, competition]);
    fetchLeagueFixtures(leagueToFetch);
  }

  function handleFetchFixture(fixture: number) {
    setErrors([]);
    setFetched([...fetched, fixture]);
    fetchFixtureStats(fixture);
  }

  return (
    <div className="flex flex-col space-y-5">
      {errors.length > 0 && <ErrorsTile errors={errors} />}
      <Dialog open={isProcessing || isFetchingLeague || isFetchingFixture}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex text-start">Processing...</DialogTitle>
            <DialogDescription>
              <div className="flex space-x-1 items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Updating fixtures and trending!</span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col space-y-5 card p-4 w-full">
        <div className="border border-border px-4 rounded-md">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span className="text-big font-medium w-full text-start">
                    Auto Market Trending
                  </span>
                  <span className="mx-3 bg-muted px-2 rounded-lg">
                    {auto.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 w-full">
                  {autoLeagues.map((item) => (
                    <div
                      key={item}
                      className="flex w-full justify-between p-4 border border-border rounded-md"
                    >
                      <span>
                        {competitions.find((el) => el.uid === item)?.name}
                      </span>
                      <button
                        onClick={() => {
                          handleFetchLeague(item);
                        }}
                        className={`${
                          fetched.includes(item)
                            ? "text-rating-bottom"
                            : "text-rating-top"
                        }`}
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="flex flex-col space-y-5 card p-4 w-full">
        <div className="border border-border px-4 rounded-md">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span className="text-big font-medium w-full text-start">
                    Statistics Market Trending
                  </span>
                  <span className="mx-3 bg-muted px-2 rounded-lg">
                    {statistics.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 w-full">
                  {statisticsFixtures.map((item) => (
                    <div
                      key={item}
                      className="flex justify-between p-4 border border-border rounded-md"
                    >
                      <div className="flex">
                        <span>
                          {
                            trending.find((el) => el.fixture === item)
                              ?.fixtureName || "No fixture name"
                          }
                        </span>
                        <div className="mx-2">
                          <TimeStamp
                            date={
                              trending.find((el) => el.fixture === item)?.date || null
                            }
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleFetchFixture(item);
                        }}
                        className="text-rating-top"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
