import Footer from "components/footer/FooterAuthDefault";
// import authImg from "assets/img/auth/auth.png";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "routes.js";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function Auth() {
  const location = useLocation();

  // Full-screen routes that don't need the constrained layout
  const fullScreenRoutes = ['/auth/sign-up'];
  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  // getRoutes function
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.path}
            element={prop.component}
            key={key}
          />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  // Full-screen layout for get-started and similar pages
  if (isFullScreen) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Routes>
          {getRoutes(routes)}
          <Route
            path="/"
            element={<Navigate to="/auth/sign-in" replace />}
          />
        </Routes>
      </div>
    );
  }

  // Constrained layout for traditional auth forms - made smaller
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <FixedPlugin />
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%]  lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                {/* No Back Button or Link here */}
                <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-8 md:max-w-[65%] lg:max-w-[800px] lg:px-6 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1000px] xl:px-0 xl:pl-[50px]">
                  <div className="mb-auto flex flex-col pl-4 pr-4 md:pr-0 md:pl-8 lg:max-w-[60%] lg:pl-0 xl:max-w-full">
                    <Routes>
                      {getRoutes(routes)}
                      <Route
                        path="/"
                        element={<Navigate to="/auth/sign-in" replace />}
                      />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}