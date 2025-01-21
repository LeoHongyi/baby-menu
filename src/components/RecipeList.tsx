import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Heart,
  Baby,
  Filter,
  ChevronDown,
  ChevronUp,
  Apple,
  Carrot,
  Milk,
  Calendar,
  Plus,
  TrashIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MealPicker from "./MealPicker";
import DatePicker from "./DatePicker";
import { recipeDB } from "@/lib/utils";
// const recipes = [
//   {
//     id: 1,
//     title: "南瓜泥粥",
//     category: "正餐",
//     time: "20分钟",
//     ageRange: "6-8个月",
//     difficulty: "简单",
//     description: "软糯易消化，富含胡萝卜素和维生素A",
//     nutrition: "维生素A、膳食纤维",
//     ingredients: "南瓜、大米",
//     image: "🎃",
//     icon: <Carrot className="h-5 w-5 text-orange-400" />,
//   },
//   {
//     id: 2,
//     title: "苹果泥",
//     category: "点心",
//     time: "10分钟",
//     ageRange: "4-6个月",
//     difficulty: "简单",
//     description: "宝宝营养启蒙首选，助消化",
//     nutrition: "维生素C、膳食纤维",
//     ingredients: "苹果",
//     image: "🍎",
//     icon: <Apple className="h-5 w-5 text-red-400" />,
//   },
//   {
//     id: 3,
//     title: "蛋黄糊",
//     category: "正餐",
//     time: "15分钟",
//     ageRange: "7-8个月",
//     difficulty: "简单",
//     description: "补充优质蛋白质和铁元素",
//     nutrition: "蛋白质、铁、维生素B",
//     ingredients: "蛋黄、米粉",
//     image: "🥚",
//     icon: <Heart className="h-5 w-5 text-yellow-400" />,
//   },
//   {
//     id: 4,
//     title: "牛肉泥粥",
//     category: "早餐",
//     time: "30分钟",
//     ageRange: "8-12个月",
//     difficulty: "中等",
//     description: "补铁佳品，促进大脑发育",
//     nutrition: "蛋白质、铁、锌",
//     ingredients: "牛肉末、大米、胡萝卜",
//     image: "🥩",
//     icon: <Heart className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: 5,
//     title: "水果酸奶",
//     category: "早餐",
//     time: "5分钟",
//     ageRange: "12个月+",
//     difficulty: "简单",
//     description: "补充益生菌，提升免疫力",
//     nutrition: "钙、益生菌、维生素",
//     ingredients: "酸奶、香蕉、蓝莓",
//     image: "🥛",
//     icon: <Milk className="h-5 w-5 text-blue-400" />,
//   },
// ];

const categories = ["全部", "早餐", "点心", "正餐"];

const RecipeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [recipes, setRecipes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [todayMeals, setTodayMeals] = useState({
    早餐: null,
    午餐: null,
    晚餐: null,
  });
  const [plannedMeals, setPlannedMeals] = useState({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectMealTime = (mealTime) => {
    setTodayMeals((prev) => ({
      ...prev,
      [mealTime]: selectedRecipe,
    }));
  };

  const handleSelectDate = (dateString) => {
    setPlannedMeals((prev) => ({
      ...prev,
      [dateString]: selectedRecipe,
    }));
  };

  const handleAddClick = (recipe, type) => {
    setSelectedRecipe(recipe);
    if (type === "meal") {
      setShowMealModal(true);
    } else {
      setShowDateModal(true);
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const timer2 = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await recipeDB.init();
        setDb(recipeDB);
        console.log("数据库初始化成功");
      } catch (error) {
        console.error("数据库初始化失败:", error);
        setError("数据库初始化失败");

        // 如果初始化失败，尝试重置数据库
        try {
          console.log("尝试重置数据库...");
          await recipeDB.resetDatabase();
          // setDb(recipeDB);
          console.log("数据库重置成功");
        } catch (resetError) {
          console.error("数据库重置失败:", resetError);
          // setError("数据库重置失败");
        }
      }
    };

    initDatabase();
  }, []);

  useEffect(() => {
    const loadTodayMeals = async () => {
      if (!db) return;

      try {
        const today = getTodayString();
        const savedMeals = await db.getMealPlan(today);
        setTodayMeals(savedMeals);
      } catch (error) {
        console.error("加载今日食谱计划失败:", error);
      }
    };

    loadTodayMeals();
  }, [db]);

  useEffect(() => {
    const searchRecipes = async () => {
      try {
        setIsLoading(true);
        if (!db) {
          throw new Error("数据库未初始化");
        }
        const results = await db.searchRecipes(searchTerm, selectedCategory);
        console.log("results", results);
        setRecipes(results);
        setError(null);
      } catch (err) {
        console.error("搜索失败:", err);
        setError(err.message || "搜索失败");
      } finally {
        setIsLoading(false);
      }
    };

    searchRecipes();
  }, [searchTerm, db, selectedCategory]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "全部" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddMeal = async (mealTime) => {
    setTodayMeals((prev) => ({
      ...prev,
      [mealTime]: [...(prev[mealTime] || []), selectedRecipe],
    }));

    if (!db) return;

    const newMeals = {
      ...todayMeals,
      [mealTime]: [...(todayMeals[mealTime] || []), selectedRecipe],
    };

    try {
      const today = getTodayString();
      await db.saveMealPlan(today, newMeals);
      setTodayMeals(newMeals);
    } catch (error) {
      console.error("保存食谱计划失败:", error);
      alert("保存失败，请重试");
    }
  };

  const handleRemoveMeal = async (mealTime, index) => {
    setTodayMeals((prev) => ({
      ...prev,
      [mealTime]: prev[mealTime].filter((_, i) => i !== index),
    }));
    if (!db) return;

    const newMeals = {
      ...todayMeals,
      [mealTime]: todayMeals[mealTime].filter((_, i) => i !== index),
    };

    try {
      const today = getTodayString();
      await db.saveMealPlan(today, newMeals);
      setTodayMeals(newMeals);
    } catch (error) {
      console.error("保存食谱计划失败:", error);
      alert("删除失败，请重试");
    }
  };

  const RecipeItem = ({ recipe }) => (
    <motion.div layout>
      <motion.div
        className={`bg-white rounded-lg shadow-sm mb-2 overflow-hidden ${
          expandedId === recipe.id ? "ring-2 ring-pink-500" : ""
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => toggleExpand(recipe.id)}
            >
              <span className="font-medium">{recipe.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddClick(recipe, "meal");
                }}
                className="p-1.5 rounded-full hover:bg-gray-100"
                title="添加到今日"
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </button>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddClick(recipe, "date");
                }}
                className="p-1.5 rounded-full hover:bg-gray-100"
                title="添加到日程"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
              </button> */}
              {expandedId === recipe.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === recipe.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4"
            >
              <div className="pt-2 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Baby className="h-4 w-4 text-pink-400" />
                    <span className="text-gray-600">
                      适合年龄：{recipe.ageRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-600">
                      制作时间：{recipe.time}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                      {recipe.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{recipe.description}</p>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">营养价值：</span>
                      {recipe.nutrition}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">主要食材：</span>
                      {recipe.ingredients}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MealPicker
        isOpen={showMealModal}
        onClose={() => {
          setShowMealModal(false);
        }}
        selectedRecipe={selectedRecipe}
        onMealSelect={handleAddMeal}
        onMealRemove={handleRemoveMeal} // 添加这一行
        todayMeals={todayMeals}
      />

      <DatePicker
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        selectedRecipe={selectedRecipe}
        onDateSelect={handleSelectDate}
        existingMeals={plannedMeals}
      />
      {/* 加载动画 */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity,
              }}
              className="text-6xl"
            >
              👶
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="搜索食谱..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border-b">
          <div className="px-4 py-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <motion.div layout className="space-y-2">
          {filteredRecipes.map((recipe) => (
            <RecipeItem key={recipe.id} recipe={recipe} />
          ))}
        </motion.div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">未找到相关食谱</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
