import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "routes.js";

export default function Auth() {
  const location = useLocation();

  const fullScreenRoutes = [
    "/auth/citizen/signup",
    "/auth/citizen/signin"
  ];

  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  const getRoutes = (routesArray) =>
    routesArray.map((prop, key) => {
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

  const fallbackPath = "/auth/citizen/signin";

  return (
    <Routes>
      {getRoutes(routes)}
      <Route path="/" element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  );
}
