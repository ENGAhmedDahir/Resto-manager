import { Button } from "@/components/ui/button";
import { usePOS } from "@/context/POSContext";
import { useCategories } from "../categories/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySkeleton from "@/components/ui_components/skeleton/CategoryListSkeleton";

function CategoriesList() {
  const { state, dispatch } = usePOS();
  const { categories = [], isLoading } = useCategories();

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <Button
        variant={state.activeCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_CATEGORY", payload: "all" })
        }
        className="shrink-0 flex items-center gap-1"
      >
        All Items
      </Button>

      {categories.map((category) => (
        <Button
          key={category._id}
          variant={
            state.activeCategory === category._id ? "default" : "outline"
          }
          size="sm"
          onClick={() =>
            dispatch({ type: "SET_ACTIVE_CATEGORY", payload: category._id })
          }
          className="shrink-0 flex items-center gap-1"
        >
          {category.image &&
            (typeof category.image === "string" &&
            category.image.startsWith("http") ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-5 h-5 object-cover rounded-full"
              />
            ) : (
              <span className="text-lg">{category.image}</span>
            ))}
          <span>{category.name}</span>
        </Button>
      ))}
    </div>
  );
}

export default CategoriesList;
