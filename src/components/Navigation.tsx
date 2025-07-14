import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  Lightbulb, 
  Home, 
  Menu, 
  Crown, 
  User,
  Star,
  LogIn,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const navItems = [
    {
      name: "Accueil",
      href: "/",
      icon: Home
    },
    {
      name: "Contes",
      href: "/contes",
      icon: BookOpen
    },
    {
      name: "Devinettes",
      href: "/devinettes",
      icon: Lightbulb
    },
    {
      name: "Premium",
      href: "/premium",
      icon: Crown
    }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavLink = ({ item, className }: { item: typeof navItems[0], className?: string }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
          isActive(item.href)
            ? "bg-primary text-primary-foreground shadow-warm"
            : "text-foreground hover:bg-muted hover:text-primary",
          className
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="h-4 w-4" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Zirin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {subscribed && (
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    {subscription_tier}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/premium" className="cursor-pointer">
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Premium</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-warm">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 py-6">
                {/* Logo in mobile */}
                <Link to="/" className="flex items-center gap-2 px-4" onClick={() => setIsOpen(false)}>
                  <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">Zirin</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 px-4">
                  {navItems.map((item) => (
                    <NavLink key={item.name} item={item} className="w-full justify-start" />
                  ))}
                </div>

                {/* User Actions */}
                <div className="flex flex-col gap-3 px-4 pt-6 border-t border-border">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 py-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Profil
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <LogIn className="h-4 w-4 mr-2" />
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-primary hover:shadow-warm">
                          S'inscrire
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;