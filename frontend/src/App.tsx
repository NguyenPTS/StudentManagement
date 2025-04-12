// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
