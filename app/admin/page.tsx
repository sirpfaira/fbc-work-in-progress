import TableSkeleton from "../components/common/LoadingSkeletons";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col space-y-5 p-6 h-screen">
      <div className="h-20 p-6 card">Admin Home</div>
      <TableSkeleton columns={3} rows={10} />
    </div>
  );
};

export default AdminDashboard;
