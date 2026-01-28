"use client";

import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
<path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 11.8 244 11.8c72.1 0 134.3 29.3 179.9 76.2l-64.8 64.2c-29.3-27.9-67.9-44.9-115.1-44.9-87.8 0-159.4 71.6-159.4 159.4s71.6 159.4 159.4 159.4c97.1 0 134.3-70.3 139.8-105.7H244v-83.3h244z"></path>
</svg>
);

export default function AuthForm() {
const auth = useAuth();
const { toast } = useToast();

const handleGoogleSignIn = async () => {
if (!auth) return;
const provider = new GoogleAuthProvider();
try {
await signInWithPopup(auth, provider);
} catch (error: any) {
console.error("Error signing in with Google: ", error);
toast({
variant: "destructive",
title: "Erro no Login",
description: "Não foi possível fazer login com o Google. Tente novamente.",
});
}
};

return (
<Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
<GoogleIcon />
Entrar com Google
</Button>
);
}


