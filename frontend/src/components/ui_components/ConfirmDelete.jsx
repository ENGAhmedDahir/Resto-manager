import { Button } from "@/components/ui/button";

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <div
      className="
        w-[40rem] max-w-[90%]
        flex flex-col gap-5
        lg:w-[32rem]
        sm:w-[25rem]
      "
    >
      {/* Title */}
      <h3 className="text-2xl font-medium sm:mt-4">Delete {resourceName}</h3>

      {/* Description */}
      <p className="text-gray-500 mb-5">
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      {/* Buttons */}
      <div
        className="
          flex justify-end gap-5
          lg:justify-center
          sm:flex-row
        "
      >
        <Button
          variant="outline"
          disabled={disabled}
          onClick={onCloseModal}
          className="sm:w-full"
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          disabled={disabled}
          onClick={onConfirm}
          className="sm:w-full"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
