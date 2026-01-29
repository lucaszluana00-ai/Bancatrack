"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
       <div className="lg:hidden">
         <Sheet>
          <SheetTrigger asChild>
            <SidebarTrigger />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1" />
    </header>
  );
}
