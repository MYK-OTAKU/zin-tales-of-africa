import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BookOpen, 
  Lightbulb, 
  Home, 
  Menu, 
  Crown, 
  User,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:shadow-warm">
              S'inscrire
            </Button>
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
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                  <Button className="w-full bg-gradient-primary hover:shadow-warm">
                    S'inscrire
                  </Button>
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