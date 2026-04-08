import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";

import FormRow from "@/components/ui_components/FormRow";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IconPicker } from "@/components/form/IconPicker";
import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

import { useEditCategory } from "./useEditCategory";

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

function EditCategory({ category }) {
  const { editCategory, isEditing } = useEditCategory();

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

  // Populate form
  useEffect(() => {
    if (!category) return;

    reset({
      name: category.name || "",
      description: category.description || "",
      image: category.image || null, // string (icon or image URL)
      isActive: category.isActive ?? true,
    });
  }, [category, reset]);

  const onSubmit = (data, onCloseModal) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("isActive", data.isActive);

    // ONE FIELD: image
    if (typeof data.image === "string") {
      formData.append("image", data.image);
    } else if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    editCategory(
      { updatedCategory: formData, id: category._id },
      {
        onSuccess: () => onCloseModal(),
      },
    );
  };

  return (
    <Modal>
      <Modal.Open opens={`edit-category-${category._id}`}>
        <Button variant="ghost" size="icon-sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Modal.Open>

      <Modal.Window
        name={`edit-category-${category._id}`}
        title="Edit Category"
        description="Update category information"
        size="full"
      >
        {({ onCloseModal }) => (
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, onCloseModal))}
            className="space-y-4"
          >
            {/* Name */}
            <FormRow label="Category Name" error={errors.name?.message}>
              <Input
                {...register("name", {
                  required: "Category name is required",
                })}
                disabled={isEditing}
              />
            </FormRow>

            <Separator />

            {/* Description */}
            <FormRow label="Description">
              <textarea
                {...register("description")}
                rows={4}
                disabled={isEditing}
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
                    disabled={imageValue instanceof FileList}
                  />
                )}
              />
            </FormRow>

            <Separator />

            {/* Image Upload */}
            <FormRow label="Category Image">
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor={`category-image-${category._id}`}
                      className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                      Choose Image
                    </label>

                    <input
                      id={`category-image-${category._id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                      disabled={isEditing}
                    />

                    <span className="text-sm text-muted-foreground">
                      {field.value?.[0]?.name || "No file chosen"}
                    </span>
                  </div>
                )}
              />
            </FormRow>
            <Separator />

            {/* Active */}
            <FormRow>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isEditing}
                    />
                    <span className="text-sm">Mark as Active</span>
                  </div>
                )}
              />
            </FormRow>

            {/* Footer */}
            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                disabled={isEditing}
                onClick={() => {
                  reset();
                  onCloseModal();
                }}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isEditing}>
                {isEditing && <SpinnerMini />}
                {isEditing ? "Updating..." : "Update Category"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default EditCategory;
