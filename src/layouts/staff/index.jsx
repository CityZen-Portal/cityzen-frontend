import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import StaffSidebar from "components/sidebar/StaffSidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Staff(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const [baseUrl, setBaseUrl] = React.useState("");
  React.useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (window.innerWidth >= 1200 || !open) return;
    const handleScroll = () => {
      setOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  React.useEffect(() => {
    const activeRoute = getActiveRoute(routes);
    if (activeRoute) {
      setCurrentRoute(activeRoute.name);
        setBaseUrl(activeRoute.layout + "/" + activeRoute.path);
    } else {
      setCurrentRoute("Main Dashboard");
        setBaseUrl("");
    }
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    const currentPath = window.location.pathname.toLowerCase();
    for (let i = 0; i < routes.length; i++) {
      const fullPath = (routes[i].layout + "/" + routes[i].path).toLowerCase();
      if (currentPath.startsWith(fullPath)) {
        return routes[i];
      }
      if (routes[i].children) {
        for (let child of routes[i].children) {
          const childFullPath = (child.layout + "/" + child.path).toLowerCase();
          if (currentPath.startsWith(childFullPath)) {
            return child;
          }
        }
      }
    }
    return null;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    const currentPath = window.location.pathname.toLowerCase();
    for (let i = 0; i < routes.length; i++) {
      const fullPath = (routes[i].layout + routes[i].path).toLowerCase();
      if (currentPath.startsWith(fullPath)) {
        return routes[i].secondary;
      }
      if (routes[i].children) {
        for (let child of routes[i].children) {
          const childFullPath = (child.layout + child.path).toLowerCase();
          if (currentPath.startsWith(childFullPath)) {
            return child.secondary;
          }
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/staff") {
        return (
          <React.Fragment key={key}>
            <Route path={`/${prop.path}`} element={prop.component} />
            {prop.children &&
              prop.children.map((childRoute, childKey) => {
                if (childRoute.layout === "/staff") {
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
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <StaffSidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"CityZen Staff Portal"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
              newsState={false}
              baseUrl={baseUrl}
            />
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/staff/dashboard" replace />}
                />
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
