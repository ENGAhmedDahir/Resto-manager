function UpdateOrderStatus() {
  const getStatusButton = () => {
    if (status === "pending") {
      return (
        <Button
          onClick={() => handleStatusUpdate("Preparing")}
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ChefHat className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Preparing"}
        </Button>
      );
    }

    if (status === "preparing") {
      return (
        <Button
          onClick={() => handleStatusUpdate("Ready")}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Ready"}
        </Button>
      );
    }

    if (status === "ready") {
      return (
        <Button
          onClick={() => handleStatusUpdate("Completed")}
          disabled={isUpdating}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Completed"}
        </Button>
      );
    }

    return null;
  };
  return getStatusButton()

export default UpdateOrderStatus;
