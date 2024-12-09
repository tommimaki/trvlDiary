"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <div className="w-full bg-gradient-to-br from-slate-700 to-black p-4">
      <nav className="flex space-x-4">
        <Link href="/" className="text-white hover:underline">
          Home
        </Link>
        <Link href="/entries" className="text-white hover:underline">
          Entries
        </Link>
        {status === "authenticated" && (
          <Link href="/entries/add" className="text-white hover:underline">
            Add Entry
          </Link>
        )}
        {status === "unauthenticated" && (
          <Link href="/auth/login" className="text-white hover:underline">
            Login
          </Link>
        )}
        {status === "authenticated" && (
          <button
            onClick={() => signOut()}
            className="text-white hover:underline"
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
};

export default Header;
