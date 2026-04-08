import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteCategory } from "./useDeleteCategory";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function DeleteCategory({ categoryId, categoryName }) {
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const handleDelete = (onCloseModal) => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        onCloseModal();
      },
    });
  };

  return (
    <Modal>
      <Modal.Open opens={`delete-category-${categoryId}`}>
        <Button variant="ghost" size="icon-sm" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </Modal.Open>

      <Modal.Window
        name={`delete-category-${categoryId}`}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
      >
        {({ onCloseModal }) => (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You are about to delete the category{" "}
              <span className="font-semibold">{categoryName}</span>. This action
              cannot be undone.
            </p>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={onCloseModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleDelete(onCloseModal)}
                disabled={isDeleting}
              >
                {isDeleting && <SpinnerMini />}
                {isDeleting ? "Deleting..." : "Delete Category"}
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default DeleteCategory;
