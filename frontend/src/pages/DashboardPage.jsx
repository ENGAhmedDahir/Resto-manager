import Heading from "@/components/ui_components/Heading";
import Dashbord from "@/features/dashboard/Dashbord";

function DashboardPage() {
  return (
    <>
      <Heading
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      />
      <Dashbord />
    </>
  );
}

export default DashboardPage;
