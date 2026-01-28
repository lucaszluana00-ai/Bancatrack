"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import { allSubjects } from '@/lib/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Banknote, LayoutDashboard, ClipboardList } from 'lucide-react';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Banknote className="size-8 text-primary" />
          <h1 className="text-xl font-semibold">BancaTrack</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === '/'}
                asChild
                tooltip="Dashboard"
              >
                <a>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/questoes" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === '/questoes'}
                asChild
                tooltip="Controle de Questões"
              >
                <a>
                  <ClipboardList />
                  <span>Questões</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {allSubjects.map((subject) => (
            <SidebarMenuItem key={subject.id}>
              <Link href={`/materias/${subject.id}`} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === `/materias/${subject.id}`}
                  asChild
                  tooltip={subject.name}
                >
                  <a>
                    <subject.Icon />
                    <span>{subject.name}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
