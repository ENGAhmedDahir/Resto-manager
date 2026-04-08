// import { useState } from "react";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import { Header } from "@/components/layout/Header";
// import { DataTable, Column } from "@/components/pos/DataTable";
// import { Modal, ModalFooter } from "@/components/pos/Modal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/hooks/use-toast";

import Heading from "@/components/ui_components/Heading";
import SignupForm from "@/features/authentication/SignupForm";
import UsersTable from "@/features/authentication/UsersTable";

// interface Staff { id: string; name: string; role: string; email: string; status: "active" | "inactive"; }

// const staffData: Staff[] = [
//   { id: "1", name: "John Doe", role: "Manager", email: "john@resto.com", status: "active" },
//   { id: "2", name: "Jane Smith", role: "Server", email: "jane@resto.com", status: "active" },
//   { id: "3", name: "Mike Johnson", role: "Chef", email: "mike@resto.com", status: "active" },
//   { id: "4", name: "Sarah Williams", role: "Cashier", email: "sarah@resto.com", status: "inactive" },
// ];

// export default function Staff() {
//   const [showModal, setShowModal] = useState(false);
//   const columns: Column<Staff>[] = [
//     { key: "name", header: "Name", sortable: true },
//     { key: "role", header: "Role", sortable: true },
//     { key: "email", header: "Email" },
//     { key: "status", header: "Status", render: (v) => <Badge variant={v === "active" ? "success" : "secondary"}>{v}</Badge> },
//     { key: "id", header: "", render: () => (
//       <div className="flex gap-1">
//         <Button variant="ghost" size="icon-sm"><Edit className="h-4 w-4" /></Button>
//         <Button variant="ghost" size="icon-sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
//       </div>
//     )},
//   ];

//   return (
//     <div className="min-h-screen">
//       <Header title="Staff" subtitle="Manage your team members" />
//       <div className="p-6">
//         <div className="flex justify-end mb-4">
//           <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
//         </div>
//         <DataTable data={staffData} columns={columns} searchKeys={["name", "email"]} />
//       </div>
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff Member">
//         <div className="space-y-4">
//           <div className="space-y-2"><Label>Name</Label><Input placeholder="Full name" /></div>
//           <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
//           <div className="space-y-2"><Label>Role</Label><Input placeholder="Role" /></div>
//         </div>
//         <ModalFooter>
//           <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
//           <Button onClick={() => { toast({ title: "Staff added" }); setShowModal(false); }}>Add</Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// }
function Account() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="User Management"
          subtitle="Manage users, roles and permissions"
        />
        <SignupForm />
      </div>
      <UsersTable />
    </>
  );
}

export default Account;
