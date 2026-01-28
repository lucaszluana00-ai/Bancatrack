"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Banknote } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-sm">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
            <div className="flex flex-col items-center justify-center mb-8">
                <Banknote className="size-12 text-primary mb-4" />
                <h1 className="text-3xl font-bold">BancaTrack</h1>
                <p className="text-muted-foreground mt-1">Seu painel de estudos para concursos.</p>
            </div>
            <AuthForm />
        </div>
    </div>
  );
}
