'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background select-none">
      <div className="text-center justify-center py-1 md:py-2">
        <p className="text-sm leading-loose text-muted-foreground">
          &copy; {currentYear} BDSystems. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
