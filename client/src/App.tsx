/*
 * App.tsx — 4 Pilares LGPD
 * Roteamento principal da aplicação
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Site institucional
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Planos from "./pages/Planos";
import FAQ from "./pages/FAQ";
import Contato from "./pages/Contato";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Blog from "./pages/Blog";

// Pilares
import PilarLei from "./pages/PilarLei";
import PilarRegras from "./pages/PilarRegras";
import PilarConformidade from "./pages/PilarConformidade";
import PilarTitular from "./pages/PilarTitular";

// Painéis
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import CheckoutFlow from "./pages/CheckoutFlow";
import CheckoutSuccess from "./pages/CheckoutSuccess";

// Preços
import Preco from "./pages/Preco";
import Degustacao from "./pages/Degustacao";
import DegustacaoSucesso from "./pages/DegustacaoSucesso";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Site institucional */}
      <Route path="/" component={Home} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/planos" component={Planos} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contato" component={Contato} />
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/termos" component={Termos} />
      <Route path="/blog" component={Blog} />

      {/* Pilares */}
      <Route path="/lei" component={PilarLei} />
      <Route path="/regras" component={PilarRegras} />
      <Route path="/conformidade" component={PilarConformidade} />
      <Route path="/titular" component={PilarTitular} />

      {/* Painéis */}
      <Route path="/admin" component={Admin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/checkout" component={CheckoutFlow} />
      <Route path="/checkout-success" component={CheckoutSuccess} />
      <Route path="/preco" component={Preco} />
      <Route path="/precos" component={Preco} />
      <Route path="/degustacao" component={Degustacao} />
      <Route path="/degustacao-sucesso" component={DegustacaoSucesso} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
