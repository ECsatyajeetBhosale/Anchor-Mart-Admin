/**
 * App.tsx
 *
 * Root component — just renders the router.
 * Keep this file simple. All layout and routing lives in AppRouter.
 */

import { Toaster } from "@/components/ui/sonner";
import { ToastContainer } from "@/components/ui/toast";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer />
      <Toaster />
    </>
  );
}

export default App;
