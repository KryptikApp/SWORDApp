import { NextPage } from "next";
import Menu, { MenuItem } from "../menu/menu";

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
