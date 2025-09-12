/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// import Person from "@material-ui/icons/Person";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
import Power from "@material-ui/icons/Power";
import GetApp from "@material-ui/icons/GetApp";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Compteur1 from "views/Compteur1/Compteur1.js";
import Compteur2 from "views/Compteur2/Compteur2.js";
import Compteur3 from "views/Compteur3/Compteur3.js";
import Compteur4 from "views/Compteur4/Compteur4.js";
import Compteur5 from "views/Compteur5/Compteur5.js";
import Compteur6 from "views/Compteur6/Compteur6.js";
import Compteur7 from "views/Compteur7/Compteur7.js";
import Compteur8 from "views/Compteur8/Compteur8.js";
import Compteur9 from "views/Compteur9/Compteur9.js";
import Compteur10 from "views/Compteur10/Compteur10.js";
import Compteur11 from "views/Compteur11/Compteur11.js";
import Compteur12 from "views/Compteur12/Compteur12.js";
import Compteur13 from "views/Compteur13/Compteur13.js";
import Csv from "views/Csv/Csv.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
// import TableList from "views/TableList/TableList.js";
// import Typography from "views/Typography/Typography.js";
// import Icons from "views/Icons/Icons.js";
// import Maps from "views/Maps/Maps.js";
// import NotificationsPage from "views/Notifications/Notifications.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/Compteur1",
    name: "Compteur 1",
    icon: Power,
    component: Compteur1,
    layout: "/admin",
  },
  {
    path: "/Compteur2",
    name: "Compteur 2",
    icon: Power,
    component: Compteur2,
    layout: "/admin",
  },
  {
    path: "/Compteur3",
    name: "Compteur 3",
    icon: Power,
    component: Compteur3,
    layout: "/admin",
  },
  {
    path: "/Compteur4",
    name: "Compteur 4",
    icon: Power,
    component: Compteur4,
    layout: "/admin",
  },
  {
    path: "/Compteur5",
    name: "Compteur 5",
    icon: Power,
    component: Compteur5,
    layout: "/admin",
  },
  {
    path: "/Compteur6",
    name: "Compteur 6",
    icon: Power,
    component: Compteur6,
    layout: "/admin",
  },
  {
    path: "/Compteur7",
    name: "Compteur 7",
    icon: Power,
    component: Compteur7,
    layout: "/admin",
  },
  {
    path: "/Compteur8",
    name: "Compteur 8",
    icon: Power,
    component: Compteur8,
    layout: "/admin",
  },
  {
    path: "/Compteur9",
    name: "Compteur 9",
    icon: Power,
    component: Compteur9,
    layout: "/admin",
  },
  {
    path: "/Compteur10",
    name: "Compteur 10",
    icon: Power,
    component: Compteur10,
    layout: "/admin",
  },
  {
    path: "/Compteur11",
    name: "Compteur 11",
    icon: Power,
    component: Compteur11,
    layout: "/admin",
  },
  {
    path: "/Compteur12",
    name: "Compteur 12",
    icon: Power,
    component: Compteur12,
    layout: "/admin",
  },
  {
    path: "/Compteur13",
    name: "Compteur 13",
    icon: Power,
    component: Compteur13,
    layout: "/admin",
  },
  {
    path: "/Csv",
    name: "Télécharger CSV",
    icon: GetApp,
    component: Csv,
    layout: "/admin",
  },
];

export default dashboardRoutes;
