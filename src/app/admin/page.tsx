import Dashboard from "@/components/admindashboard/admincomponent/Dashboard";
import AdminGuard from "@/components/admindashboard/admincomponent/AdminGuard";

const Page = () => {
  return (
    <div className="admin-panel dark" id="main">
      <AdminGuard>
        <Dashboard />
      </AdminGuard>
    </div>
  );
};

export default Page;
