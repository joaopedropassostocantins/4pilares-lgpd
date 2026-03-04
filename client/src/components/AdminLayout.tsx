import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart3, FileText, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: BarChart3 },
    { label: "Diagnósticos", path: "/admin/diagnostics", icon: FileText },
  ];

  return (
    <div className="mystic-gradient min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/30 bg-background/60 backdrop-blur-md p-6 fixed h-screen left-0 top-0 overflow-y-auto">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            ☯ ADMIN
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Painel de Controle</p>
        </div>

        <nav className="space-y-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="border-t border-border/30 pt-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-primary/40 hover:border-primary text-muted-foreground hover:text-foreground"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
