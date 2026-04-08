import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FormRow from "@/components/ui_components/FormRow";
import { Checkbox } from "@/components/ui/checkbox";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

import { useCategories } from "../categories/useCategories";
import { useUpdateMenu } from "../MenuPos/useUpdateMenu";

function UpdateMenu({ menu }) {
  const { updateMenu, isUpdating } = useUpdateMenu();
  const { categories = [] } = useCategories();

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
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

  const imageValue = watch("image");

  // 🔁 Populate form
  useEffect(() => {
    if (!menu) return;

    reset({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category?._id,
      image: null, // user chooses only if replacing
      available: menu.available,
    });
  }, [menu, reset]);

  const onSubmit = (data, onCloseModal) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("available", data.available);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    updateMenu(
      { id: menu._id, updatedMenu: formData },
      {
        onSuccess: () => {
          reset();
          onCloseModal();
        },
      },
    );
  };

  return (
    <Modal>
      <Modal.Open opens={`edit-menu-${menu._id}`}>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Modal.Open>

      <Modal.Window
        name={`edit-menu-${menu._id}`}
        title="Update Menu"
        description="Edit menu details"
        size="full"
      >
        {({ onCloseModal }) => (
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, onCloseModal))}
            className="space-y-3"
          >
            {/* Name */}
            <FormRow label="Menu Name" error={errors.name?.message}>
              <Input
                {...register("name", { required: "Menu name is required" })}
                disabled={isUpdating}
              />
            </FormRow>

            <Separator />

            {/* Description */}
            <FormRow label="Description" error={errors.description?.message}>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                disabled={isUpdating}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                disabled={isUpdating}
              />
            </FormRow>

            <Separator />

            {/* Category */}
            <FormRow label="Category" error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
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
                  htmlFor={`menu-image-${menu._id}`}
                  className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Choose Image
                </label>

                <Input
                  id={`menu-image-${menu._id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  disabled={isUpdating}
                />

                <span className="text-sm text-muted-foreground">
                  {imageValue?.[0]?.name || "No file chosen"}
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
                    disabled={isUpdating}
                    className="scale-120"
                  />
                  <span className="font-light text-lg">Mark as available</span>
                </div>
              )}
            />

            {/* Footer */}
            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={onCloseModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <SpinnerMini />}
                {isUpdating ? "Updating..." : "Update Menu"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default UpdateMenu;
