import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteCategoryInventory } from "../../services/apiCategoryInventory";
import { Button } from "@/components/ui/button";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function DeleteCategory({ id, onCloseModal }) {
    const queryClient = useQueryClient();

    const { isLoading: isDeleting, mutate } = useMutation({
        mutationFn: deleteCategoryInventory,
        onSuccess: () => {
            toast.success("Category successfully deleted");
            queryClient.invalidateQueries({
                queryKey: ["categoryInventory"],
            });
            onCloseModal?.();
        },
        onError: (err) => toast.error(err.message),
    });

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this Category? This action cannot be undone.
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
                    {isDeleting ? "Deleting..." : "Delete Category"}
                </Button>
            </div>
        </div>
    );
}

export default DeleteCategory;
