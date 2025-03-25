"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleGate = ({ 
  children, 
  allowedRoles 
}: RoleGateProps) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!session?.user || !allowedRoles.includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <h2 className="text-lg font-medium">Acesso restrito</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Você não tem permissão para acessar este conteúdo.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};