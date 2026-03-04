import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Ads from "./pages/Ads";
import Resultado from "./pages/Resultado";
import Obrigado from "./pages/Obrigado";
import ModuleDetail from "./pages/ModuleDetail";
import ModuloA from "./pages/ModuloA";
import ModuloB from "./pages/ModuloB";
import ModuloC from "./pages/ModuloC";
import ModuloD from "./pages/ModuloD";
import ModuloE from "./pages/ModuloE";
import ModuloF from "./pages/ModuloF";
import BetaSignup from "./pages/BetaSignup";
import BetaSignupThankYou from "./pages/BetaSignupThankYou";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminDiagnostics from "./pages/Admin/Diagnostics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ads" component={Ads} />
      <Route path="/modulo-a" component={ModuloA} />
      <Route path="/modulo-b" component={ModuloB} />
      <Route path="/modulo-c" component={ModuloC} />
      <Route path="/modulo-d" component={ModuloD} />
      <Route path="/modulo-e" component={ModuloE} />
      <Route path="/modulo-f" component={ModuloF} />
      <Route path="/modulo-:slug" component={ModuleDetail} />
      <Route path="/cadastro" component={BetaSignup} />
      <Route path="/obrigado-cadastro" component={BetaSignupThankYou} />
      <Route path="/resultado/:publicId" component={Resultado} />
      <Route path="/obrigado/:publicId" component={Obrigado} />
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
