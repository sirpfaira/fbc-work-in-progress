"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ICornersBookings,
  ICornersBookingsSchema,
} from "@/lib/schemas/fixture";
import CustomDialog from "@/app/components/common/CustomDialog";
import { SquarePen } from "lucide-react";

interface EditCornersBookingsProps {
  updateCornersBookings: (values: ICornersBookings) => void;
  item: ICornersBookings;
}

export default function EditCornersBookings({
  updateCornersBookings,
  item,
}: EditCornersBookingsProps) {
  const [isEditCornersBookingsOpen, setIsEditCornersBookingsOpen] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICornersBookings>({
    resolver: zodResolver(ICornersBookingsSchema),
    defaultValues: item,
    mode: "onBlur",
  });

  const onSubmit = async (values: ICornersBookings) => {
    try {
      updateCornersBookings(values);
      setIsEditCornersBookingsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center">
      <button
        className="text-rating-top border border-border rounded-md p-1"
        onClick={() => setIsEditCornersBookingsOpen(true)}
      >
        <SquarePen size={14} />
      </button>
      <CustomDialog
        isOpen={isEditCornersBookingsOpen}
        setIsOpen={setIsEditCornersBookingsOpen}
        title="Edit Corners & Bookings"
        description="Add a fixture to the database"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="corners.halfTime">
                Corners Half Time
              </label>
              <Input
                id="corners.halfTime"
                type="text"
                {...register("corners.halfTime")}
              />
              {errors?.corners?.halfTime && (
                <small className="text-destructive">
                  {errors.corners?.halfTime?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="corners.fullTime">
                Corners Full Time
              </label>
              <Input
                id="corners.fullTime"
                type="text"
                {...register("corners.fullTime")}
              />

              {errors?.corners?.fullTime && (
                <small className="text-destructive">
                  {errors.corners?.fullTime?.message}
                </small>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="bookings.halfTime">
                Bookings Half Time
              </label>
              <Input
                id="bookings.halfTime"
                type="text"
                {...register("bookings.halfTime")}
              />
              {errors?.bookings?.halfTime && (
                <small className="text-destructive">
                  {errors.bookings?.halfTime?.message}
                </small>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-medium block" htmlFor="bookings.fullTime">
                Bookings Full Time
              </label>
              <Input
                id="bookings.fullTime"
                type="text"
                {...register("bookings.fullTime")}
              />

              {errors?.bookings?.fullTime && (
                <small className="text-destructive">
                  {errors.bookings?.fullTime?.message}
                </small>
              )}
            </div>

            <div className="w-full flex justify-center items-center space-x-3 pt-3">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setIsEditCornersBookingsOpen(false)}
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
