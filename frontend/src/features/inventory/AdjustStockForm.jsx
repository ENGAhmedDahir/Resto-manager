import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addStock, removeStock } from "../../services/apiInventory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormRow from "@/components/ui_components/FormRow";
import { Separator } from "@/components/ui/separator";

function AdjustStockForm({ id, action = "add", itemName, onCloseModal }) {
    const isAdd = action === "add";
    const { register, handleSubmit, formState: { errors } } = useForm();
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: isAdd ? addStock : removeStock,
        onSuccess: () => {
            toast.success(`Successfully ${isAdd ? "added stock to" : "removed stock from"} ${itemName}`);
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    function onSubmit(data) {
        mutate({
            id,
            quantity: Number(data.quantity),
            reason: data.reason
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-4">
                <h3 className="text-lg font-medium">
                    {isAdd ? "Add Stock" : "Remove Stock"} - <span className="text-primary">{itemName}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                    {isAdd
                        ? "Increase inventory quantity and log an 'IN' transaction."
                        : "Decrease inventory quantity and log an 'OUT' transaction."
                    }
                </p>
            </div>

            <FormRow label="Quantity" error={errors?.quantity?.message}>
                <Input
                    type="number"
                    id="quantity"
                    disabled={isLoading}
                    {...register("quantity", {
                        required: "Quantity is required",
                        min: { value: 0.0001, message: "Quantity must be greater than 0" },
                    })}
                />
            </FormRow>
            <Separator />

            <FormRow label="Reason" error={errors?.reason?.message}>
                <Input
                    id="reason"
                    disabled={isLoading}
                    placeholder={isAdd ? "e.g. Restock from supplier" : "e.g. Spoilage, Theft, internal use"}
                    {...register("reason", {
                        required: "Reason is required for audit logs",
                    })}
                />
            </FormRow>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onCloseModal?.()}>
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                    type="submit"
                    variant={isAdd ? "default" : "destructive"}
                >
                    {isLoading ? "Saving..." : isAdd ? "Add Stock" : "Remove Stock"}
                </Button>
            </div>
        </form>
    );
}

export default AdjustStockForm;
