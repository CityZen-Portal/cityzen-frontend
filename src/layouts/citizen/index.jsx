import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import CitizenSidebar from "components/sidebar/CitizenSidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Citizen(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
  };

  
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/citizen") {
        return (
          <React.Fragment key={key}>
            <Route path={`/${prop.path}`} element={prop.component} />
            {prop.children && prop.children.map((childRoute, childKey) => {
              if (childRoute.layout === "/citizen") {
                return (
                  <Route 
                    path={`/${childRoute.path}`} 
                    element={childRoute.component} 
                    key={`${key}-${childKey}`} 
                  />
                );
              }
              return null;
            })}
          </React.Fragment>
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <CitizenSidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText="Horizon UI Tailwind React"
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to="/citizen/dashboard" replace />} />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}