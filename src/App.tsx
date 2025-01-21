import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";

import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import WeeklyMealPlanner from "./components/WeeklyMealPlanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <RecipeList />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout>
              <AddRecipe />
            </Layout>
          }
        />
        <Route
          path="/weekly"
          element={
            <Layout>
              <WeeklyMealPlanner />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// 布局组件
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isAddPage = window.location.pathname === "/add";
  const isWeeklyPage = window.location.pathname === "/weekly";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          {isAddPage || isWeeklyPage ? (
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

          {!isAddPage && !isWeeklyPage && (
            <Link
              to="/add"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white"
            >
              <Plus className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-14">{children}</div>
    </div>
  );
};

export default App;
