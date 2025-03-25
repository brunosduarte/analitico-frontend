"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  UserIcon, 
  LogOut, 
  Settings, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Registro</Link>
        </Button>
      </div>
    );
  }

  const getUserInitials = () => {
    if (!session.user.name) return "U";
    
    const nameParts = session.user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const getRoleBadge = () => {
    const roleDictionary: Record<string, string> = {
      "admin": "Administrador",
      "desenvolvedor": "Desenvolvedor",
      "estivador": "Estivador",
      "arrumador": "Arrumador",
      "conferente": "Conferente",
      "vigia": "Vigia"
    };

    return roleDictionary[session.user.role] || session.user.role;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "Usuário"} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{session.user.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>{getRoleBadge()}</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <UserIcon className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}