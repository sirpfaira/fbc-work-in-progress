"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IFixtureScores, IScoresSchema } from "@/lib/schemas/fixture";
import CustomDialog from "@/app/components/common/CustomDialog";
import { SquarePen } from "lucide-react";

interface EditScoresProps {
  updateScores: (values: IFixtureScores) => void;
  item: IFixtureScores;
}

export default function EditScores({ updateScores, item }: EditScoresProps) {
  const [isEditScoresOpen, setIsEditScoresOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFixtureScores>({
    resolver: zodResolver(IScoresSchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const onSubmit = async (values: IFixtureScores) => {
    try {
      updateScores(values);
      setIsEditScoresOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center">
      <button
        className="text-rating-top border border-border rounded-md p-1"
        onClick={() => setIsEditScoresOpen(true)}
      >
        <SquarePen size={14} />
      </button>
      <CustomDialog
        isOpen={isEditScoresOpen}
        setIsOpen={setIsEditScoresOpen}
        title="Edit scores"
        description="Add a fixture to the database"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="tenMinutes">
                Ten Minutes
              </label>
              <Input id="tenMinutes" type="text" {...register("tenMinutes")} />
              {errors?.tenMinutes && (
                <small className="text-destructive">
                  {errors.tenMinutes?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="halfTime">
                Half Time
              </label>
              <Input id="halfTime" type="text" {...register("halfTime")} />
              {errors?.halfTime && (
                <small className="text-destructive">
                  {errors.halfTime?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="fullTime">
                Full Time
              </label>
              <Input id="fullTime" type="text" {...register("fullTime")} />

              {errors?.fullTime && (
                <small className="text-destructive">
                  {errors.fullTime?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="extraTime">
                Extra Time
              </label>
              <Input id="extraTime" type="text" {...register("extraTime")} />

              {errors?.extraTime && (
                <small className="text-destructive">
                  {errors.extraTime?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="penalties">
                Penalties
              </label>
              <Input id="penalties" type="text" {...register("penalties")} />

              {errors?.penalties && (
                <small className="text-destructive">
                  {errors.penalties?.message}
                </small>
              )}
            </div>
            <div className="w-full flex justify-center items-center space-x-3 pt-3">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setIsEditScoresOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
}
