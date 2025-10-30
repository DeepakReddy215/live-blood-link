import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import DonorDashboard from "./pages/donor/DonorDashboard";
import RequestList from "./pages/donor/RequestList";
import BookAppointment from "./pages/donor/BookAppointment";
import RecipientDashboard from "./pages/recipient/RecipientDashboard";
import CreateRequest from "./pages/recipient/CreateRequest";
import MyRequests from "./pages/recipient/MyRequests";
import BloodBanks from "./pages/dashboard/BloodBanks";
import CreateBloodCard from "./pages/bloodcard/CreateBloodCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          
          {/* Donor Routes */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/requests"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <RequestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          
          {/* Recipient Routes */}
          <Route
            path="/recipient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <RecipientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/create-request"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/my-requests"
            element={
              <ProtectedRoute allowedRoles={['recipient']}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          
          {/* Blood Banks - All Users */}
          <Route
            path="/blood-banks"
            element={
              <ProtectedRoute allowedRoles={['donor', 'recipient', 'delivery', 'admin']}>
                <BloodBanks />
              </ProtectedRoute>
            }
          />
          
          {/* Blood Card - All Users */}
          <Route
            path="/create-blood-card"
            element={
              <ProtectedRoute allowedRoles={['donor', 'recipient']}>
                <CreateBloodCard />
              </ProtectedRoute>
            }
          />
          
          {/* Delivery Routes - Coming Soon */}
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Delivery Dashboard</h1>
                    <p className="text-muted-foreground">Coming Soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes - Coming Soon */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Coming Soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
