import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../../services/apiSettings";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormRow from "@/components/ui_components/FormRow";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";

function UpdateSettingsForm() {
    const queryClient = useQueryClient();

    const {
        isLoading,
        data: settings = {},
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    const { taxRate } = settings;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        values: settings,
    });

    const { mutate, isLoading: isUpdating } = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            toast.success("Settings successfully updated");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    function onSubmit(data) {
        mutate(data);
    }

    if (isLoading) return <LoadingSpinner message="Loading settings..." />;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Update Restaurant Settings</h2>

            <FormRow label="Tax Rate (%)" error={errors?.taxRate?.message}>
                <Input
                    type="number"
                    id="taxRate"
                    step="0.1"
                    disabled={isUpdating}
                    {...register("taxRate", {
                        required: "Field is required",
                        min: { value: 0, message: "Tax rate cannot be negative" },
                    })}
                />
            </FormRow>

            <div className="flex justify-end gap-3 pt-4">
                <Button disabled={isUpdating} type="submit">
                    Update settings
                </Button>
            </div>
        </form>
    );
}

export default UpdateSettingsForm;
