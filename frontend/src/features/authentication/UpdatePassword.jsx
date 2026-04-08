import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "./useUpdateUser";
import FormRow from "@/components/ui_components/FormRow";
import { Separator } from "@/components/ui/separator";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function UpdatePassword({ userId }) {
  const { register, handleSubmit, reset } = useForm();
  const { updatePassword, isUpdating } = useUpdatePassword();

  function onSubmit(data) {
    updatePassword(
      {
        id: userId, // optional (logged-in user ma u baahna)
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => reset(),
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg bg-card p-6 shadow"
    >
      <h2 className="text-lg font-semibold">Update User Password</h2>

      <FormRow label="Current password">
        <Input
          type="password"
          placeholder="Current password"
          {...register("currentPassword", { required: true })}
          disabled={isUpdating}
        />
      </FormRow>
      <Separator />
      <FormRow label="New password">
        <Input
          type="password"
          placeholder="New password"
          {...register("newPassword", { required: true, minLength: 6 })}
          disabled={isUpdating}
        />
      </FormRow>
      <Separator />
      <div className="flex justify-end">
        <Button disabled={isUpdating}>
          {isUpdating && <SpinnerMini />}
          {isUpdating ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}

export default UpdatePassword;
