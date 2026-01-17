import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import SearchCommand from "@/components/SearchCommand";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { CalendarDropdown } from "@/components/calendar-dropdown";
import { AIAssistant } from "@/components/ai-assistant";
import { Onboarding, ReopenOnboarding } from "@/components/onboarding";
import { Calendar, User, GraduationCap } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userInitials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="px-8 py-5 border-b border-border flex items-center gap-6">
          <div className="flex-1">
            <SearchCommand />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationsDropdown />
            <CalendarDropdown />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-xl hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/assinaturas" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Assinaturas
                  </Link>
                </DropdownMenuItem>
                <ReopenOnboarding>
                  <DropdownMenuItem>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Tutorial
                  </DropdownMenuItem>
                </ReopenOnboarding>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                    className="w-full"
                  >
                    <button type="submit" className="w-full text-left text-sm">
                      Sair
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Breadcrumbs />
          {children}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Onboarding */}
      <Onboarding />
    </div>
  );
}
