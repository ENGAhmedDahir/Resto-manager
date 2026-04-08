import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteInventoryItem } from "../../services/apiInventory";
import { Button } from "@/components/ui/button";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function DeleteInventory({ id, onCloseModal }) {
    const queryClient = useQueryClient();

    const { isLoading: isDeleting, mutate } = useMutation({
        mutationFn: deleteInventoryItem,
        onSuccess: () => {
            toast.success("Inventory item successfully deleted");
            queryClient.invalidateQueries({
                queryKey: ["inventory"],
            });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Delete Inventory Item</h2>
            <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this inventory item? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    onClick={onCloseModal}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => mutate(id)}
                >
                    {isDeleting && <SpinnerMini />}
                    {isDeleting ? "Deleting..." : "Delete Item"}
                </Button>
            </div>
        </div>
    );
}

export default DeleteInventory;
