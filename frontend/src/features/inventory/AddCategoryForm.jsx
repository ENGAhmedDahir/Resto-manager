import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createCategoryInventory, updateCategoryInventory } from "../../services/apiCategoryInventory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormRow from "@/components/ui_components/FormRow";
import { Separator } from "@/components/ui/separator";

function AddCategoryForm({ categoryToEdit = {}, onCloseModal }) {
    const { _id: editId, ...editValues } = categoryToEdit;
    const isEditSession = Boolean(editId);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: isEditSession ? editValues : {},
    });

    const queryClient = useQueryClient();

    const { mutate: create, isLoading: isCreating } = useMutation({
        mutationFn: createCategoryInventory,
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categoryInventory"] });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    const { mutate: edit, isLoading: isEditing } = useMutation({
        mutationFn: updateCategoryInventory,
        onSuccess: () => {
            toast.success("Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["categoryInventory"] });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    const isWorking = isCreating || isEditing;

    function onSubmit(data) {
        if (isEditSession) {
            edit({ id: editId, ...data });
        } else {
            create(data);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormRow label="Category Name" error={errors?.name?.message}>
                <Input
                    id="name"
                    disabled={isWorking}
                    placeholder="e.g. Beverages"
                    {...register("name", { required: "Category name is required" })}
                />
            </FormRow>
            <Separator />

            <FormRow label="Description" error={errors?.description?.message}>
                <Input
                    id="description"
                    disabled={isWorking}
                    placeholder="e.g. Soft drinks and juices"
                    {...register("description")}
                />
            </FormRow>
            <Separator />

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onCloseModal?.()}>
                    Cancel
                </Button>
                <Button disabled={isWorking} type="submit">
                    {isEditSession ? "Update Category" : "Create Category"}
                </Button>
            </div>
        </form>
    );
}

export default AddCategoryForm;
