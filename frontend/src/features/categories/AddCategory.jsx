import { useForm, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { useCurrentUser } from "../authentication/useCurrentUser";

import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import FormRow from "@/components/ui_components/FormRow";
import SpinnerMini from "@/components/ui_components/SpinnerMini";
import { Separator } from "@/components/ui/separator";

import { IconPicker } from "@/components/form/IconPicker";
import { ImageUploader } from "@/components/form/ImageUploader";
import { useCreateCategory } from "./useCreateCategory";

const restaurantCategoryIcons = [
  "🍽",
  "📦",
  "🍕",
  "🍔",
  "🍛",
  "🍜",
  "🍗",
  "🥩",
  "🍣",
  "☕",
  "🥤",
  "🧃",
  "🍹",
];

function AddCategory() {
  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  if (!isAdminOrManager) return null;

  const { createCategory, isCreating } = useCreateCategory();

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: null,
      isActive: true,
    },
  });

  const imageValue = watch("image");

  // const onSubmit = (data, onCloseModal) => {
  //   const formData = new FormData();
  //   formData.append("name", data.name);
  //   formData.append("description", data.description || "");
  //   formData.append("isActive", data.isActive);

  //   if (data.image instanceof File || typeof data.image === "string") {
  //     formData.append("image", data.image);
  //   } elseif(data.image?.[0]) {
  //     formData.append("image", data.image[0]);
  //   }

  //   createCategory(formData, {
  //     onSuccess: () => {
  //       reset();
  //       onCloseModal();
  //     },
  //   });
  // };
  const onSubmit = (data, onCloseModal) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("isActive", data.isActive);

    // 🔑 ONE FIELD: image
    if (typeof data.image === "string") {
      // icon selected
      formData.append("image", data.image);
    } else if (data.image?.[0]) {
      // file selected
      formData.append("image", data.image[0]);
    }

    createCategory(formData, {
      onSuccess: () => {
        reset();
        onCloseModal();
      },
    });
  };

  return (
    <Modal>
      <Modal.Open opens="add-category">
        <div className="flex justify-end mb-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </Modal.Open>

      <Modal.Window
        name="add-category"
        title="Add Category"
        description="Create a new category for your restaurant"
        size="full"
      >
        {({ onCloseModal }) => (
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, onCloseModal))}
            className="space-y-4"
          >
            {/* Category Name */}
            <FormRow label="Category Name" error={errors.name?.message}>
              <Input
                {...register("name", {
                  required: "Category name is required",
                })}
                disabled={isCreating}
              />
            </FormRow>
            <Separator />

            {/* Description */}
            <FormRow label="Description" error={errors.description?.message}>
              <textarea
                {...register("description")}
                rows={4}
                disabled={isCreating}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormRow>

            <Separator />

            {/* Icon Picker */}
            <FormRow label="Choose Icon">
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <IconPicker
                    icons={restaurantCategoryIcons}
                    value={typeof field.value === "string" ? field.value : null}
                    onChange={field.onChange}
                    disabled={imageValue instanceof File}
                  />
                )}
              />
            </FormRow>
            <Separator />

            <FormRow label="Category Image">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="category-image"
                  className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Choose Image
                </label>

                <Input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  disabled={typeof imageValue === "string"}
                />

                <span className="text-sm text-muted-foreground">
                  No file chosen
                </span>
              </div>
            </FormRow>

            <Separator />

            {/* Active Checkbox */}
            <FormRow>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isCreating}
                      className="scale-120"
                    />
                    <span className="font-light text-sidebar-foreground text-lg">
                      Mark as Active
                    </span>
                  </div>
                )}
              />
            </FormRow>

            {/* Footer */}
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
                {isCreating ? "Creating..." : "Add Category"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default AddCategory;
