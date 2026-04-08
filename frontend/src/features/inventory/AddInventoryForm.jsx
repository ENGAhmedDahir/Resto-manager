import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInventoryItem, updateInventoryItem } from "../../services/apiInventory";
import { getCategoryInventories } from "../../services/apiCategoryInventory";
import { toast } from "react-hot-toast";
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
import { Separator } from "@/components/ui/separator";

const UNIT_OPTIONS = ["kg", "liter", "piece", "bottle", "gm", "ml", "pack"];

function AddInventoryForm({ inventoryToEdit = {}, onCloseModal }) {
    const { _id: editId, ...editValues } = inventoryToEdit;
    const isEditSession = Boolean(editId);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: isEditSession ? {
            ...editValues,
            category: editValues.category?._id || editValues.category
        } : {
            lowStockLevel: 5,
            quantity: 0
        },
    });

    const queryClient = useQueryClient();

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categoryInventory"],
        queryFn: getCategoryInventories,
    });

    const { mutate: create, isLoading: isCreating } = useMutation({
        mutationFn: createInventoryItem,
        onSuccess: () => {
            toast.success("New inventory item successfully created");
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            reset();
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    const { mutate: edit, isLoading: isEditing } = useMutation({
        mutationFn: updateInventoryItem,
        onSuccess: () => {
            toast.success("Inventory item successfully edited");
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    const isWorking = isCreating || isEditing || isLoadingCategories;

    function onSubmit(data) {
        if (isEditSession) {
            edit({ id: editId, ...data });
        } else {
            create(data);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Item Name */}
            <FormRow label="Item Name" error={errors?.itemName?.message}>
                <Input
                    id="itemName"
                    disabled={isWorking}
                    placeholder="e.g. Rice"
                    {...register("itemName", { required: "Item name is required" })}
                />
            </FormRow>
            <Separator />

            {/* Category - Select component */}
            <FormRow label="Category" error={errors?.category?.message}>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isWorking}>
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

            {/* Supplier */}
            <FormRow label="Supplier" error={errors?.supplier?.message}>
                <Input
                    id="supplier"
                    disabled={isWorking}
                    placeholder="e.g. SomGrain"
                    {...register("supplier")}
                />
            </FormRow>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                {/* Cost Price */}
                <FormRow label="Cost Price" error={errors?.costPrice?.message}>
                    <Input
                        type="number"
                        step="0.01"
                        id="costPrice"
                        disabled={isWorking}
                        {...register("costPrice", {
                            required: "Cost price is required",
                            min: { value: 0, message: "Cost should be at least 0" },
                        })}
                    />
                </FormRow>

                {/* Quantity */}
                <FormRow label="Quantity" error={errors?.quantity?.message}>
                    <Input
                        type="number"
                        id="quantity"
                        disabled={isWorking}
                        {...register("quantity", {
                            required: "Quantity is required",
                            min: { value: 0, message: "Quantity should be at least 0" },
                        })}
                    />
                </FormRow>
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                {/* Unit */}
                <FormRow label="Unit" error={errors?.unit?.message}>
                    <Controller
                        name="unit"
                        control={control}
                        rules={{ required: "Unit is required" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isWorking}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIT_OPTIONS.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormRow>

                {/* Low Stock Level */}
                <FormRow label="Low Stock Level" error={errors?.lowStockLevel?.message}>
                    <Input
                        type="number"
                        id="lowStockLevel"
                        disabled={isWorking}
                        {...register("lowStockLevel", {
                            min: { value: 0, message: "Level should be at least 0" },
                        })}
                    />
                </FormRow>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onCloseModal?.()}>
                    Cancel
                </Button>
                <Button disabled={isWorking} type="submit">
                    {isEditSession ? "Update Item" : "Create Item"}
                </Button>
            </div>
        </form>
    );
}

export default AddInventoryForm;
