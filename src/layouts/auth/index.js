import Footer from "components/footer/FooterAuthDefault";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "routes.js";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function Auth() {
  const location = useLocation();

  const fullScreenRoutes = [
    "/auth/sign-up",
    "/auth/get-started",
    "/auth/citizen-signup",
    "/auth/staff-signup"
  ];

  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        if (prop.children) {
          return (
            <Route path={prop.path} key={key} element={prop.component}>
              {prop.children.map((child, i) => (
                <Route path={child.path} element={child.component} key={i}>
                  {child.children &&
                    child.children.map((nested, j) => (
                      <Route
                        path={nested.path}
                        element={nested.component}
                        key={j}
                      />
                    ))}
                </Route>
              ))}
            </Route>
          );
        }

        return <Route path={prop.path} element={prop.component} key={key} />;
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  // --- Full screen layout for specific pages ---
  if (isFullScreen) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-gray-900 transition-colors">
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        </Routes>
      </div>
    );
  }

  // --- Gradient + decorative layout for sign-in/auth pages ---
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-12
                 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900
                 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Gradient Blobs (non-blinking) */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400 rounded-full blur-2xl opacity-25"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-200 rounded-full blur-2xl opacity-20"></div>

      {/* Main Layout */}
      <div className="relative z-10 w-full max-w-full">
        <FixedPlugin />
        <main className="mx-auto min-h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-screen-lg px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center">
              <div className="w-full">
                <Routes>
                  {getRoutes(routes)}
                  <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
