import { NextPage } from "next";

// wallet SDK helpers
import NavbarProduction from "./NavbarProduction";

const Navbar: NextPage = () => {
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;

  return (
    <div>
      <NavbarProduction />
    </div>
  );
};

export default Navbar;
