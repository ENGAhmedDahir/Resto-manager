// import { Header } from "@/components/layout/Header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "@/hooks/use-toast";

// export default function Settings() {
//   return (
//     <div className="min-h-screen">
//       <Header title="Settings" subtitle="Configure your POS system" />
//       <div className="p-6 max-w-3xl space-y-6">
//         <Card>
//           <CardHeader><CardTitle>Restaurant Info</CardTitle></CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2"><Label>Restaurant Name</Label><Input defaultValue="RestoPOS" /></div>
//               <div className="space-y-2"><Label>Phone</Label><Input defaultValue="(555) 123-4567" /></div>
//             </div>
//             <div className="space-y-2"><Label>Address</Label><Input defaultValue="123 Main Street, City" /></div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle>Tax & Payments</CardTitle></CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" defaultValue="10" /></div>
//             <div className="flex items-center justify-between">
//               <Label>Accept Cash</Label><Switch defaultChecked />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label>Accept Card</Label><Switch defaultChecked />
//             </div>
//           </CardContent>
//         </Card>
//         <Button onClick={() => toast({ title: "Settings saved!" })}>Save Changes</Button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";

function Settings() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <UpdateSettingsForm />
    </div>
  );
}

export default Settings;
