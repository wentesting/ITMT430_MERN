import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
function AdminPrivateRoute({ component: Component, path, ...rest }) {
  const status = useSelector(state => state.setAdmin);
  return (
    <Route
      path={path}
      {...rest}
      render={props =>
        status.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/management",
              state: {
                prevLocation: path,
                error: "You need to login first!"
              }
            }}
          />
        )
      }
    />
  );
}

export default AdminPrivateRoute;
