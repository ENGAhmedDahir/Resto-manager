import { deleteTable as deleteTableApi } from "@/services/apiTables";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteTable() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteTable } = useMutation({
    mutationFn: deleteTableApi,
    onSuccess: () => {
      toast.success("Table successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteTable };
}
