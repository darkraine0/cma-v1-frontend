import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => (
  <Fragment>
    <div className="bg-card border-b border-border shadow-card">
      <nav className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-foreground tracking-tight select-none cursor-pointer">
            MarketMap Homes
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <Link to="/">
              <Button
                variant="outline"
                className="bg-card text-card-foreground border-border hover:bg-muted hover:text-muted-foreground font-semibold"
              >
                Communities
              </Button>
            </Link>
            <Link to="/companies">
              <Button
                variant="outline"
                className="bg-card text-card-foreground border-border hover:bg-muted hover:text-muted-foreground font-semibold"
              >
                Companies
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant="outline"
                className="bg-card text-card-foreground border-border hover:bg-muted hover:text-muted-foreground font-semibold"
              >
              All Plans
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  </Fragment>
);

export default Navbar;
