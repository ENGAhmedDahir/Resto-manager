import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { POSProvider } from "@/context/POSContext";
import { UIProvider } from "@/context/UIContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/DashboardPage";
import MenuPOS from "./pages/MenuPOS";
import Orders from "./pages/OrdersPage";
import Inventory from "./pages/Inventory";
import Tables from "./pages/Tables";

import Categories from "./pages/Categories";

import Settings from "./pages/Settings";
import StockLogs from "./pages/StockLogs";
import CategoryInventory from "./pages/CategoryInventory";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import ScrollToTop from "./ScrollTotop";
import OrderDetailsPage from "./features/orders/OrderDetailsPage";
import Account from "./pages/Account";

import UserSettings from "./features/authentication/UserSettings";
import ReportsPage from "./pages/ReportsPage";
import UpdateCurrentUser from "./features/authentication/UpdateCurrentUser";

import ProtectedRoute from "./features/authentication/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <UIProvider>
        <POSProvider>
          <TooltipProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="/pos" element={<MenuPOS />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route
                    path="/order/:orderId"
                    element={<OrderDetailsPage />}
                  />
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager", "chef"]}>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tables"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <Tables />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <Categories />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/userSettting/:userId"
                    element={<UserSettings />}
                  />
                  <Route
                    path="/account/:userId"
                    element={<UpdateCurrentUser />}
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stock-logs"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager", "chef"]}>
                        <StockLogs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/category-inventory"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "manager", "chef"]}>
                        <CategoryInventory />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </POSProvider>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "#fff",
              color: "var(--color-muted-foreground)",
            },
          }}
        />
      </UIProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
