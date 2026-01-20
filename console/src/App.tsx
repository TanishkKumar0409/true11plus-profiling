import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import { AuthNavigations } from "./common/RouteData";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            {AuthNavigations.map((page, index) => (
              <Route
                path={page.href}
                element={
                  // <ProtectedRoutes
                  //   authUser={authUser}
                  //   authLoading={authLoading}
                  // >
                  <page.component />
                  // </ProtectedRoutes>
                }
                key={index}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
