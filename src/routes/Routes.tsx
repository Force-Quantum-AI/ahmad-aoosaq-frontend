// import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
// import App from "../App";
// // import Home from "@/pages/Home";
// import CreateAgent from "@/pages/CreateAgent";
// import NotFound from "@/pages/NotFound";
// import DashboardHome from "@/pages/Dashboard/DashboardHome";
// import ProtectedRoute from "./ProtectedRoute";
// import DashboardLayout from "./DashboardLayout";
// import DashboardAboutPage from "@/pages/Dashboard/DashboardAboutPage";
// import DashboardBusinessInfoPage from "@/pages/Dashboard/DashboardBusinessInfoPage";
// import DashboardBusinessServicesPage from "@/pages/Dashboard/DashboardBusinessServicesPage";
// import DashboardPhone from "@/pages/Dashboard/DashboardPhone";
// import DashboardIntegration from "@/pages/Dashboard/DashboardIntegration";
// import DashboardSettings from "@/pages/Dashboard/DashboardSettings";
// import ChyrHome from "@/pages/ChyrHome";
// import LoginCHYR from "@/pages/LoginCHYR";
// import SignupCHYR from "@/pages/SignupCHYR";
// import SuperAdminLayout from "./SuperAdminLayout";
// import SuperAdmin from "@/pages/SuperAdmin/SuperAdmin";
// import ContactUs from "@/pages/ContactUs";
// import PrivacyPolicy from "@/pages/PrivacyPolicy";
// import TermsOfServices from "@/pages/TermsOfServices";
// import { LandingConfigProvider, BrandType } from "@/contexts/LandingConfigContext";
// import BusinessRedirect from "./BusinessRedirect";

// const VALID_BRANDS: BrandType[] = ["CHYR", "AVRIANCE", "NOHM"];

// const RootProvider = () => {
//   const location = useLocation();
//   const pathParts = location.pathname.split('/');
//   const potentialBrand = (pathParts[1] || "").toUpperCase() as BrandType;

//   const resolvedBrand: BrandType = VALID_BRANDS.includes(potentialBrand)
//     ? potentialBrand
//     : "CHYR";

//   return (
//     <LandingConfigProvider initialBrand={resolvedBrand}>
//       <Outlet />
//     </LandingConfigProvider>
//   );
// };

// const routes = createBrowserRouter([
//   {
//     element: <RootProvider />,
//     children: [
//       {
//         path: "/",
//         element: <App />,
//         children: [
//           {
//             index: true,
//             element: <Navigate to="/CHYR" replace />,
//           },
//           {
//             path: ":brand",
//             element: <ChyrHome />,
//           },
//         ],
//       },
//       {
//         path: "/login",
//         element: <LoginCHYR />,
//       },
//       {
//         path: "/signup",
//         element: <SignupCHYR />,
//       },
//       {
//         path: "/create-agent",
//         element: <ProtectedRoute><CreateAgent /></ProtectedRoute>,
//       },
//       {
//         path: "/contact",
//         element: <ContactUs />,
//       },
//       {
//         path: "/privacy-policy",
//         element: <PrivacyPolicy />,
//       },
//       {
//         path: "/terms",
//         element: <TermsOfServices />,
//       },
//       // {
//       //   path: "/book-demo",
//       //   element: <BookDemo />,
//       // },
//       {
//         element: <ProtectedRoute />,
//         children: [
//           {
//             element: <BusinessRedirect />,
//             children: [
//               {
//                 path: "/dashboard",
//                 element: <DashboardLayout />,
//                 children: [
//                   { index: true, element: <DashboardHome /> },
//                   { path: "about", element: <DashboardAboutPage /> },
//                   { path: "business", element: <DashboardBusinessInfoPage /> },
//                   { path: "businessServices/:serviceId", element: <DashboardBusinessServicesPage /> },
//                   { path: "phone", element: <DashboardPhone /> },
//                   { path: "integrations", element: <DashboardIntegration /> },
//                   { path: "settings", element: <DashboardSettings /> },
//                 ],
//               },
//             ],
//           },

//           {
//             path: "/super-admin",
//             element: <SuperAdminLayout />,
//             children: [
//               {
//                 index: true,
//                 element: <SuperAdmin />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: "*",
//         element: <NotFound />,
//       },
//     ],
//   },
// ]);

// export default routes;


import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import App from "../App";
import CreateAgent from "@/pages/CreateAgent";
import NotFound from "@/pages/NotFound";
import DashboardHome from "@/pages/Dashboard/DashboardHome";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import DashboardAboutPage from "@/pages/Dashboard/DashboardAboutPage";
import DashboardBusinessInfoPage from "@/pages/Dashboard/DashboardBusinessInfoPage";
import DashboardBusinessServicesPage from "@/pages/Dashboard/DashboardBusinessServicesPage";
import DashboardPhone from "@/pages/Dashboard/DashboardPhone";
import DashboardIntegration from "@/pages/Dashboard/DashboardIntegration";
import DashboardSettings from "@/pages/Dashboard/DashboardSettings";
import ChyrHome from "@/pages/ChyrHome";
import LoginCHYR from "@/pages/LoginCHYR";
import SignupCHYR from "@/pages/SignupCHYR";
import SuperAdminLayout from "./SuperAdminLayout";
import SuperAdmin from "@/pages/SuperAdmin/SuperAdmin";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfServices from "@/pages/TermsOfServices";
import { LandingConfigProvider, BrandType } from "@/contexts/LandingConfigContext";
import BusinessRoute from "./BusinessRedirect";
import DashboardCallLogs from "@/pages/Dashboard/DashboardCallLogs";
import Home from "@/pages/Home";

const VALID_BRANDS: BrandType[] = ["CHYR", "AVRIANCE", "NOHM"];

const RootProvider = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const potentialBrand = (pathParts[1] || "").toUpperCase() as BrandType;

  const resolvedBrand: BrandType = VALID_BRANDS.includes(potentialBrand)
    ? potentialBrand
    : "CHYR";

  return (
    <LandingConfigProvider initialBrand={resolvedBrand}>
      <Outlet />
    </LandingConfigProvider>
  );
};

const routes = createBrowserRouter([
  {
    element: <RootProvider />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <Navigate to="/CHYR" replace /> },
          { path: ":brand", element: <ChyrHome /> },
        ],
      },
      // { path: "/hyln", element: <Home /> },

      { path: "/login", element: <LoginCHYR /> },
      { path: "/signup", element: <SignupCHYR /> },

      // Create Agent (only logged in users)
      {
        path: "/create-agent",
        element: (
          <ProtectedRoute>
            <CreateAgent />
          </ProtectedRoute>
        ),
      },

      { path: "/contact", element: <ContactUs /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsOfServices /> },

      //  DASHBOARD (auth + business required)
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <BusinessRoute />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                  { index: true, element: <DashboardHome /> },
                  { path: "about", element: <DashboardAboutPage /> },
                  { path: "business", element: <DashboardBusinessInfoPage /> },
                  { path: "businessServices/:serviceId", element: <DashboardBusinessServicesPage /> },
                  { path: "phone", element: <DashboardPhone /> },
                  { path: "callLogs", element: <DashboardCallLogs /> },
                  { path: "integrations", element: <DashboardIntegration /> },
                  { path: "settings", element: <DashboardSettings /> },
                ],
              },
            ],
          },

          // SUPER ADMIN ONLY
          {
            path: "/super-admin",
            element: <ProtectedRoute requireSuperAdmin={true} />,
            children: [
              {
                element: <SuperAdminLayout />,
                children: [
                  { index: true, element: <SuperAdmin /> },
                ],
              },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default routes;