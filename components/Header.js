import React from "react";
import Link from "next/link";
const Header = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-700 to-black p-4">
      <nav className="flex space-x-4">
        <Link href="/" className="text-white hover:underline">
          Home
        </Link>
        <Link href="/entries" className="text-white hover:underline">
          Entries
        </Link>
        <Link href="/entries/add" className="text-white hover:underline">
          Add Entry
        </Link>
      </nav>
    </div>
  );
};

export default Header;
