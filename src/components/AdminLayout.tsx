
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Home, Users, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProfileDialog } from './ProfileDialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar>
                <SidebarHeader>
                    <ProfileDialog>
                        <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-sidebar-accent rounded-md">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                                <AvatarFallback>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col" style={{ opacity: state === 'expanded' ? 1 : 0, transition: 'opacity 0.2s' }}>
                                <span className="text-sm font-semibold">{user?.name}</span>
                                <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </div>
                    </ProfileDialog>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'} tooltip="Dasbor">
                                <Link href="/admin/dashboard">
                                    <Home />
                                    <span>Dasbor</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/users')} tooltip="Pengguna">
                                <Link href="/admin/users">
                                    <Users />
                                    <span>Pengguna</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                     <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={logout} tooltip="Keluar">
                                <LogOut />
                                <span>Keluar</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <SidebarTrigger className="sm:hidden" />
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
            </SidebarInset>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [loading, isAuthenticated, user, router]);

    if (!isClient || loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
      <SidebarProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SidebarProvider>
    )
}
