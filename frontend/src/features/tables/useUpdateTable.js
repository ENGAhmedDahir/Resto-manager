import { updateTable } from "@/services/apiTables";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export function useUpdateTable() {
  const queryClient = useQueryClient();

  const { mutate: updateTableMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateTable,
    onSuccess: () => {
      toast.success("Table successfully edited");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateTableMutate, isUpdating };
}
