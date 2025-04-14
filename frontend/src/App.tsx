// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          {" "}
          {/* ✅ Bây giờ useNavigate hoạt động bình thường */}
          <Layout>
            <AppRouter />
          </Layout>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
