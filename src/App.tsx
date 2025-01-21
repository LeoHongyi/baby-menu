// App.js
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import "./App.css";

import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe"; // Component doesn't exist yet
import WeeklyMealPlanner from "./components/WeeklyMealPlanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout showHeader showAdd>
              <RecipeList />
            </Layout>
          }
        />
        <Route path="/add" element={<AddRecipe />} />
        <Route
          path="/weekly"
          element={
            <Layout showHeader showBack>
              <WeeklyMealPlanner />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// 布局组件
const Layout = ({
  children,
  showHeader = true,
  showAdd = false,
  showBack = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                返回
              </button>
            ) : (
              <h1 className="text-lg font-medium">家庭食谱</h1>
            )}

            {showAdd && (
              <Link
                to="/add"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white transition-transform hover:rotate-90 active:rotate-90"
              >
                <Plus className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className={showHeader ? "pt-14" : ""}>{children}</div>
    </div>
  );
};

export default App;
