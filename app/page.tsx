"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from '@/components/ui/Button';


export default function HomePage() {
  const { data: session } = useSession();
  const handleClick = () => alert('Clicked!');

  if (session) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Bienvenido, {session.user?.name}</h1>
        <img src={session.user?.image ?? ""} alt="user avatar" className="mx-auto rounded-full w-24 h-24 mt-4" width={100} height={100}/>
        <button
          onClick={() => signOut()}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
        >
          Cerrar sesión
        </button>
        <Button label="Click Me" onClick={handleClick} aria-label="Custom Button" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
      >
        Iniciar con Google
      </button>
    </div>
  );
}
