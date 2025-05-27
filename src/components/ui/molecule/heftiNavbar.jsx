import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '../molecule/navbar';
import Logo from '../../../assets/logo';

export default function HeftiNavbar() {
  return (
    <Navbar className="bg-zinc-900">
      <Link to="/" aria-label="Home">
        <div className="w-full max-w-[837px] sm:max-w-[250px] md:max-w-[530px] lg:max-w-[800px] xl:max-w-[837px]">
          <Logo className="h-auto w-full p-6" />
        </div>
      </Link>
      <NavbarSpacer />
      <NavbarSection className="p-6">
        <NavbarItem
          href="/about"
          aria-label="About"
          className="text-core-white"
        >
          About
        </NavbarItem>
        <NavbarDivider />
        <NavbarItem
          href="/contact-us"
          aria-label="Contact Us"
          className="text-core-white"
        >
          Contact Us
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
}
