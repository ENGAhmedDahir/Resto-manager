import { updateCategory as updateCategoryApi } from "@/services/apiCategries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useEditCategory() {
  const queryClient = useQueryClient();

  const { mutate: editCategory, isPending: isEditing } = useMutation({
    mutationFn: ({ updatedCategory, id }) =>
      updateCategoryApi({ id, updatedCategory }),

    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { editCategory, isEditing };
}
