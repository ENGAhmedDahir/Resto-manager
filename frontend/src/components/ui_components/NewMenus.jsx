import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";
import DeleteUser from "@/features/authentication/DeleteUser";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

function NewMenus({ user }) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 control modal

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpen(false); // close dropdown
                setShowDeleteModal(true); // open modal
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>

            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🔥 Modal OUTSIDE dropdown */}
      {showDeleteModal && (
        <DeleteUser
          userId={user.id}
          username={user.username}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

export default NewMenus;

//     <Menubar>
//       <MenubarMenu>
//         <MenubarTrigger>File</MenubarTrigger>
//         <MenubarContent>
//           <MenubarGroup>
//             <MenubarItem>
//               New Tab <MenubarShortcut>⌘T</MenubarShortcut>
//             </MenubarItem>
//             {!hideDeleteUser && (
//               <MenubarItem onSelect={(e) => e.preventDefault()}>
//                 <DeleteUser onDeleteSuccess={handleDeleteSuccess} />
//               </MenubarItem>
//             )}
//           </MenubarGroup>
//           <MenubarSeparator />
//           <MenubarGroup>
//             <MenubarItem>Share</MenubarItem>
//             <MenubarItem>Print</MenubarItem>
//           </MenubarGroup>
//         </MenubarContent>
//       </MenubarMenu>
//     </Menubar>
//   );
