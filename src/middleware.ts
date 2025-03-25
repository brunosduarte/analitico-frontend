import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // Verificar se está acessando rotas protegidas
  const isAccessingProtectedRoutes = 
    req.nextUrl.pathname.startsWith("/dashboard") || 
    req.nextUrl.pathname.startsWith("/extratos") || 
    req.nextUrl.pathname.startsWith("/upload") ||
    req.nextUrl.pathname.startsWith("/profile");

  // Verificar se está acessando rotas de autenticação
  const isAccessingAuthRoutes = 
    req.nextUrl.pathname.startsWith("/auth/login") || 
    req.nextUrl.pathname.startsWith("/auth/register");

  // Redirecionar para login se não está autenticado e tentando acessar rotas protegidas
  if (!isAuthenticated && isAccessingProtectedRoutes) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirecionar para dashboard se já está autenticado e tentando acessar rotas de auth
  if (isAuthenticated && isAccessingAuthRoutes) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Verificação de acesso baseado em papel (role)
  if (isAuthenticated && token.role) {
    // Rotas apenas para admin
    const isAccessingAdminRoutes = req.nextUrl.pathname.startsWith("/admin");
    if (isAccessingAdminRoutes && token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Verificação específica para cada tipo de usuário, se necessário
    // Por exemplo:
    // const isAccessingDevRoutes = req.nextUrl.pathname.startsWith("/dev");
    // if (isAccessingDevRoutes && token.role !== "desenvolvedor") {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }
  }

  return NextResponse.next();
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/extratos/:path*", 
    "/upload/:path*", 
    "/profile/:path*",
    "/auth/login",
    "/auth/register"
  ],
};