import React from 'react';

function Header() {
  return (
    <header className="w-full bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          {/* Logo/Brand name */}
          luxi-x
        </div>
      </div>
    </header>
  );
}

export default Header;
