import { DataTable } from "@/components/pos/DataTable";
import { useUsers } from "./useUsers";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "@/components/ui_components/Modal";

import Menus from "@/components/ui_components/Menus";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import DeleteUser from "./DeleteUser";
import NewMenus from "@/components/ui_components/NewMenus";
import { useCurrentUser } from "./useCurrentUser";

function UsersTable() {
  const { user } = useCurrentUser();
  const isAdmin = user && user.role === "admin";
  const { users = [], isLoading } = useUsers();

  if (isLoading) return <LoadingSpinner message="Loading users" />;

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
    {
      key: "role",
      label: "Role",
      options: [
        { value: "admin", label: "Admin" },
        { value: "staff", label: "Staff" },
        { value: "user", label: "User" },
      ],
    },
  ];

  const columns = [
    {
      key: "username",
      header: "Full Name",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.photo || "/default-user.jpg"}
            alt={row.username}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{row.username}</span>
          </div>
        </div>
      ),
    },
    { key: "email", header: "email", sortable: true },
    { key: "role", header: "Role", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge variant={v ? "success" : "secondary"}>
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "_id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-1">
          {isAdmin && (
            <>
              <DeleteUser userId={row._id} username={row.username} />
              <Menus.Menu>
                <Menus.Toggle id={row._id} />

                <Menus.List id={row._id}>
                  <Link
                    className="text-muted-foreground"
                    to={`/userSettting/${row._id}`}
                  >
                    <Menus.Button
                      icon={
                        <Settings className="text-muted-foreground h-4 w-4" />
                      }
                    >
                      User Settings
                    </Menus.Button>
                  </Link>

                  <Modal.Open opens={`delete-user-${row._id}`}>
                    <Menus.Button
                      icon={<Trash2 className="text-destructive h-4 w-4" />}
                    >
                      Delete User
                    </Menus.Button>
                  </Modal.Open>
                </Menus.List>
              </Menus.Menu>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Menus>
      <Modal>
        <DataTable
          data={users}
          columns={columns}
          searchKeys={["username", "email"]}
          isLoading={isLoading}
          filters={filters}
        />
      </Modal>
    </Menus>
  );
}

export default UsersTable;
