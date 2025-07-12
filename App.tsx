import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import AddItem from "./pages/AddItem";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
