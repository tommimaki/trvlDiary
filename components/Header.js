"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-gradient-to-br from-slate-700 to-black p-4">
      <nav className="flex space-x-4">
        <Link href="/" className="text-white hover:underline">
          Home
        </Link>
        <Link href="/entries" className="text-white hover:underline">
          Entries
        </Link>
        {session && (
          <Link href="/entries/add" className="text-white hover:underline">
            Add Entry
          </Link>
        )}
        {!session ? (
          <button
            onClick={() => signIn()}
            className="text-white hover:underline"
          >
            Login
          </button>
        ) : (
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
