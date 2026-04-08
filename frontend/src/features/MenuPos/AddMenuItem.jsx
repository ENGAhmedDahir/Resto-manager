import { useForm, Controller } from "react-hook-form";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/FormField";
import { CheckboxField } from "@/components/form/CheckboxField";
import { ImageUploader } from "@/components/form/ImageUploader";
import { useCreateMenu } from "../MenuPos/useCreateMenu";
import { useCategories } from "../categories/useCategories";
import { SelectField } from "@/components/form/SelectFlied";
import SpinnerMini from "@/components/ui_components/SpinnerMini";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TextAreaField } from "@/components/form/TextAreaField";
import FormRow from "@/components/ui_components/FormRow";
import { Checkbox } from "@/components/ui/checkbox";

function AddMenuItem() {
  const { createMenu, isCreating } = useCreateMenu();
  const { categories = [] } = useCategories();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      available: true,
    },
  });

  const onSubmit = (data, onCloseModal) => {
    console.log(data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("available", data.available);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    createMenu(formData, {
      onSuccess: () => {
        reset();
        onCloseModal();
      },
    });
  };

  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  if (!isAdminOrManager) return null;

  return (
    <Modal>
      <Modal.Open opens="add-menu">
        <div className="flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu
          </Button>
        </div>
      </Modal.Open>

      <Modal.Window
        name="add-menu"
        title="Add Menu"
        description="Create a new menu for your restaurant"
        size="full"
      >
        {({ onCloseModal }) => (
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, onCloseModal))}
            className="space-y-3"
          >
            {/* Menu Name */}
            <FormRow label="Menu Name" error={errors.name?.message}>
              <Input
                {...register("name", {
                  required: "Menu name is required",
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            {/* Description */}
            <FormRow label="Description" error={errors.description?.message}>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                disabled={isCreating}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Menu description"
              />
            </FormRow>

            <Separator />

            {/* Price */}
            <FormRow label="Price" error={errors.price?.message}>
              <Input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            {/* Category (select using native input) */}
            <FormRow label="Category" error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isCreating}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormRow>
            <Separator />

            {/* Image */}
            <FormRow label="Menu Image">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="menu-image"
                  className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Choose Image
                </label>

                <Input
                  id="menu-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  disabled={isCreating}
                />

                <span className="text-sm text-muted-foreground">
                  No file chosen
                </span>
              </div>
            </FormRow>
            <Separator />
            {/* Available */}
            <Controller
              control={control}
              name="available"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isCreating}
                    className="scale-150"
                  />
                  <span className="font-light text-sidebar-foreground text-lg">
                    Mark as available
                  </span>
                </div>
              )}
            />

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onCloseModal();
                }}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isCreating}>
                {isCreating && <SpinnerMini />}
                {isCreating ? "Creating..." : "Add Menu"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default AddMenuItem;
