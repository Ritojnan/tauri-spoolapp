import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./css/Style.css";

import RootLayout from "./layouts/RootLayout.jsx";
import Email from "./components/Email";
import Default from "./components/Default";
import Search from "./components/Search";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Email />} />
      <Route path="email" element={<Email />} />
      <Route path="search" element={<Search/>} />
      <Route path="*" element={<Default/> } />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
