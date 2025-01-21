import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ArrowLeft, Plus, Book, Calendar } from "lucide-react";
import "./App.css";

import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import WeeklyMealPlanner from "./components/WeeklyMealPlanner";
import CalendarMenu from "./components/Canlender";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout showHeader showAdd showNav>
              <RecipeList />
            </Layout>
          }
        />
        <Route path="/add" element={<AddRecipe />} />
        <Route
          path="/weekly"
          element={
            <Layout showNav>
              <CalendarMenu />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// 底部导航组件
const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around items-center h-14">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            currentPath === "/" ? "text-pink-500" : "text-gray-500"
          }`}
        >
          <Book className="h-5 w-5" />
          <span className="text-xs">食谱</span>
        </Link>
        <Link
          to="/weekly"
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            currentPath === "/weekly" ? "text-pink-500" : "text-gray-500"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">食谱日历</span>
        </Link>
      </div>
    </div>
  );
};

// 布局组件
const Layout = ({
  children,
  showHeader = true,
  showAdd = false,
  showBack = false,
  showNav = false,
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

      <div className={`${showHeader ? "pt-14" : ""} ${showNav ? "pb-16" : ""}`}>
        {children}
      </div>

      {showNav && <BottomNav />}
    </div>
  );
};

export default App;
