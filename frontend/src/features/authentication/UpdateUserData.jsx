import React, { useState } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateUserData } from "./useUpdateUser";
import FormRow from "@/components/ui_components/FormRow";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import SpinnerMini from "@/components/ui_components/SpinnerMini";
import { useMoveBack } from "@/hooks/useMoveBack";

function UpdateUserData({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "",
    },
  });

  const { user: currentUser } = useCurrentUser();
  const isAdmin = currentUser && currentUser.role === "admin";
  const [preview, setPreview] = useState(user?.photo || "/default-user.jpg");

  const { updateUser, isUpdating } = useUpdateUserData();
  const moveBack = useMoveBack();

  function onSubmit(data) {
    const formData = new FormData();

    if (isAdmin) {
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("role", data.role);
    }

    if (data.photo?.[0]) {
      formData.append("photo", data.photo[0]);
    }

    updateUser({
      id: user._id,
      updatedUser: formData,
    });
  }

  const inputStyle =
    "bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white";

  return (
    <>
      <Button variant="link" className="max-w-1/12" onClick={moveBack}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg bg-card p-6 shadow"
      >
        <h2 className="text-lg font-semibold">Update User Profile</h2>

        <div className="md:w-1/3 mx-auto text-center">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto"
          />
        </div>

        {/* Username */}
        <FormRow label="Username" error={errors.username?.message}>
          <Input
            className={inputStyle}
            {...register("username", { required: "Username is required" })}
            disabled={isUpdating || !isAdmin}
          />
        </FormRow>

        <Separator />

        {/* Email */}
        <FormRow label="Email" error={errors.email?.message}>
          <Input
            type="email"
            className={inputStyle}
            {...register("email", { required: "Email is required" })}
            disabled={isUpdating || !isAdmin}
          />
        </FormRow>

        <Separator />

        {/* Role (readonly) */}
        <FormRow label="Role">
          <div className="flex h-10 w-full items-center rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm capitalize dark:bg-gray-800 dark:text-white">
            {user?.role}
          </div>
        </FormRow>

        <Separator />

        {/* Photo */}
        <FormRow label="Photo" error={errors.photo?.message}>
          <Input
            type="file"
            accept="image/*"
            className={`${inputStyle} file:text-gray-900`}
            {...register("photo")}
            disabled={isUpdating}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </FormRow>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <SpinnerMini />}
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default UpdateUserData;
