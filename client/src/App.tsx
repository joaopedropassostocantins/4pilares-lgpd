import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Resultado from "./pages/Resultado";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminDiagnostics from "./pages/Admin/Diagnostics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resultado/:publicId" component={Resultado} />
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/diagnostics">
        {() => (
          <AdminLayout>
            <AdminDiagnostics />
          </AdminLayout>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
