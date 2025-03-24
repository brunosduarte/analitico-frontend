// components/layout/sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3Icon, 
  FileTextIcon, 
  HomeIcon, 
  UploadIcon 
} from 'lucide-react';

const items = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3Icon,
  },
  {
    title: 'Extratos',
    href: '/extratos',
    icon: FileTextIcon,
  },
  {
    title: 'Upload',
    href: '/upload',
    icon: UploadIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col gap-2 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors',
              pathname === item.href ? 'bg-muted' : ''
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}