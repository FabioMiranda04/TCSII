import { Nav } from "../Nav";
import { AppRouter } from "../../routers/app.routers";

export const DashboardLayout = () => {
  return (
    <div className="app-layout">
      <Nav />
      <main className="main-content">
        <AppRouter />
      </main>
    </div>
  );
};

export default DashboardLayout;
