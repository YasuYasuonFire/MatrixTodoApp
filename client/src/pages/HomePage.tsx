import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import TaskMatrix from "@/components/TaskMatrix";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="container mx-auto flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Eisenhower Matrix</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <span className="text-sm text-muted-foreground">
            Welcome, {user.username}
          </span>
          <Button
            variant="outline"
            onClick={() => logout()}
          >
            Logout
          </Button>
          <CreateTaskDialog />
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <TaskMatrix />
      </main>
    </div>
  );
}
