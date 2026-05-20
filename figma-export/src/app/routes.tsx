import { createBrowserRouter } from "react-router";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { DevDashboard } from "./pages/DevDashboard";
import { NewProject } from "./pages/NewProject";
import { BugReport } from "./pages/BugReport";
import { FeedbackHub } from "./pages/FeedbackHub";
import { Settings } from "./pages/Settings";
import { BugTracker } from "./pages/BugTracker";
import { BugDiscussion } from "./pages/BugDiscussion";
import { ProjectDetails } from "./pages/ProjectDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/dev",
    Component: DevDashboard,
  },
  {
    path: "/dev/new-project",
    Component: NewProject,
  },
  {
    path: "/report-bug",
    Component: BugReport,
  },
  {
    path: "/feedback",
    Component: FeedbackHub,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/bug-tracker",
    Component: BugTracker,
  },
  {
    path: "/bug/:id",
    Component: BugDiscussion,
  },
  {
    path: "/project/:id",
    Component: ProjectDetails,
  }
]);
