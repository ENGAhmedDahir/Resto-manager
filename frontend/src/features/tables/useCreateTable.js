import { createTable } from "@/services/apiTables";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export function useCreateTable() {
  const queryClient = useQueryClient();

  const { mutate: createTableMutate, isLoading: isCreating } = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      toast.success("New table successfully created");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createTableMutate, isCreating };
}
