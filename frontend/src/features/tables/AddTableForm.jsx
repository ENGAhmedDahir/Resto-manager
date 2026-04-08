import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormRow from "@/components/ui_components/FormRow";
import { useCreateTable } from "./useCreateTable";
import { useUpdateTable } from "./useUpdateTable";
import { Separator } from "@/components/ui/separator";

function AddTableForm({ tableToEdit = {}, onCloseModal }) {
  const { _id: editId, ...editValues } = tableToEdit;
  const isEditSession = Boolean(editId);

  const { createTableMutate, isCreating } = useCreateTable();
  const { updateTableMutate, isUpdating } = useUpdateTable();

  const isWorking = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : { status: "available" },
  });

  function onSubmit(data) {
    if (isEditSession) {
      updateTableMutate(
        { id: editId, ...data },
        { onSuccess: () => onCloseModal?.() },
      );
    } else {
      createTableMutate(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Table Number */}
      <FormRow label="Table Number" error={errors?.tableNumber?.message}>
        <Input
          type="number"
          disabled={isWorking}
          {...register("tableNumber", { required: "This field is required" })}
        />
      </FormRow>
      <Separator />

      {/* Capacity */}
      <FormRow label="Capacity" error={errors?.capacity?.message}>
        <Input
          type="number"
          disabled={isWorking}
          {...register("capacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>
      <Separator />
      {/* Status */}
      <FormRow label="Status" error={errors?.status?.message}>
        <Controller
          name="status"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isWorking}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormRow>
      <Separator />

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking} type="submit">
          {isEditSession ? "Update table" : "Create new table"}
        </Button>
      </div>
    </form>
  );
}

export default AddTableForm;
