import { getReports } from "@/services/apiReports";
import { useQuery } from "@tanstack/react-query";

export function useReports(period) {
  const { data: reports, isPending: isLoading } = useQuery({
    queryKey: ["reports", period],
    queryFn: () => getReports(period),
    keepPreviousData: true,
  });

  return { reports, isLoading };
}

// export function useReports() {
//   const period = "today";

//   const { data: reports, isPending: isLoading } = useQuery({
//     queryKey: ["reports", period],
//     queryFn: () => getReports(period),
//   });

//   return { reports, isLoading };
// }
