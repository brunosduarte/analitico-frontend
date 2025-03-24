import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-4">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-md font-medium">
              Extratos Portuários
            </span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} Extratos Portuários. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link 
            href="/extratos" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Extratos
          </Link>
          <Link 
            href="/upload" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Upload
          </Link>
        </div>
      </div>
    </footer>
  );
}