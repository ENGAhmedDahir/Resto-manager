import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FormRow from "@/components/ui_components/FormRow";
import { useSignup } from "./useSignup";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

// Fallback SelectField for demonstration
function SelectField({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SignupForm() {
  const { signup, isCreating } = useSignup();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "staff",
    },
  });

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Staff", value: "staff" },
    { label: "User", value: "user" },
  ];

  function onSubmit(data, onCloseModal) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const newUser = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    signup(newUser, {
      onSuccess: () => {
        reset();
        onCloseModal(); // ✅ close modal
      },
    });
  }

  return (
    <Modal>
      <Modal.Open opens="create-user">
        <div className="flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New User
          </Button>
        </div>
      </Modal.Open>

      <Modal.Window
        name="create-user"
        title="Create New User"
        description="Create a new user account"
        size="full"
      >
        {({ onCloseModal }) => (
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, onCloseModal))}
            className="space-y-4"
          >
            <FormRow label="Username" error={errors.username?.message}>
              <Input
                {...register("username", {
                  required: "Username is required",
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />
            <FormRow label="Email" error={errors.email?.message}>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            <FormRow label="Password" error={errors.password?.message}>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Min 6 characters",
                  },
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            <FormRow
              label="Confirm Password"
              error={errors.confirmPassword?.message}
            >
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            <FormRow label="Role">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    options={roles}
                    placeholder="Select role"
                  />
                )}
              />
            </FormRow>
            <Separator />

            <Modal.Footer>
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  reset();
                  onCloseModal();
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Signup"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default SignupForm;
