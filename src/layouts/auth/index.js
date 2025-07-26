import Footer from "components/footer/FooterAuthDefault";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "routes.js";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function Auth() {
  const location = useLocation();

  const fullScreenRoutes = [
    "/auth/citizen/signup",
    "/auth/citizen/signin"
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
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300 overflow-hidden">
        {/* Decorative Gradient Blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <Routes>
            {getRoutes(routes)}
            <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
          </Routes>
        </div>
        
        {/* Footer - Aligned to bottom */}
        <div className="w-full py-4">
          <Footer />
        </div>
      </div>
    );
  }

  // --- Gradient + decorative layout for sign-in/auth pages ---
  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300 overflow-hidden">
      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <FixedPlugin />
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        </Routes>
      </div>
      
      {/* Footer - Aligned to bottom */}
      <div className="w-full py-4">
        <Footer />
      </div>
    </div>
  );
}