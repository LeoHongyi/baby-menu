import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Heart,
  Baby,
  Filter,
  X,
  Apple,
  Milk,
  Carrot,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "./SkeletonCard";
import { useNavigate } from "react-router-dom";

const recipes = [
  {
    id: 1,
    title: "南瓜泥粥",
    category: "辅食初期",
    time: "20分钟",
    ageRange: "6-8个月",
    difficulty: "简单",
    description: "软糯易消化，富含胡萝卜素和维生素A",
    nutrition: "维生素A、膳食纤维",
    ingredients: "南瓜、大米",
    image: "🎃",
    icon: <Carrot className="h-5 w-5 text-orange-400" />,
  },
  {
    id: 2,
    title: "苹果泥",
    category: "辅食初期",
    time: "10分钟",
    ageRange: "4-6个月",
    difficulty: "简单",
    description: "宝宝营养启蒙首选，助消化",
    nutrition: "维生素C、膳食纤维",
    ingredients: "苹果",
    image: "🍎",
    icon: <Apple className="h-5 w-5 text-red-400" />,
  },
  {
    id: 3,
    title: "蛋黄糊",
    category: "辅食中期",
    time: "15分钟",
    ageRange: "7-8个月",
    difficulty: "简单",
    description: "补充优质蛋白质和铁元素",
    nutrition: "蛋白质、铁、维生素B",
    ingredients: "蛋黄、米粉",
    image: "🥚",
    icon: <Heart className="h-5 w-5 text-yellow-400" />,
  },
  {
    id: 4,
    title: "牛肉泥粥",
    category: "辅食后期",
    time: "30分钟",
    ageRange: "8-12个月",
    difficulty: "中等",
    description: "补铁佳品，促进大脑发育",
    nutrition: "蛋白质、铁、锌",
    ingredients: "牛肉末、大米、胡萝卜",
    image: "🥩",
    icon: <Heart className="h-5 w-5 text-red-500" />,
  },
  {
    id: 5,
    title: "水果酸奶",
    category: "辅食后期",
    time: "5分钟",
    ageRange: "12个月+",
    difficulty: "简单",
    description: "补充益生菌，提升免疫力",
    nutrition: "钙、益生菌、维生素",
    ingredients: "酸奶、香蕉、蓝莓",
    image: "🥛",
    icon: <Milk className="h-5 w-5 text-blue-400" />,
  },
];

const categories = ["全部", "辅食初期", "辅食中期", "辅食后期"];

// 骨架屏组件

const RecipeList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "全部" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      variants={itemVariants}
      layout
      className="bg-white rounded-lg shadow-sm overflow-hidden"
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          >
            {recipe.image}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium text-gray-900">
                {recipe.title}
              </h3>
              {recipe.icon}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">
              {recipe.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Baby className="h-4 w-4 text-pink-400" />
            <span className="text-gray-600">适合年龄：{recipe.ageRange}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-gray-600">制作时间：{recipe.time}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
              {recipe.category}
            </span>
            <span className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-full">
              {recipe.difficulty}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-500">
              <span className="font-medium">营养价值：</span>
              {recipe.nutrition}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">主要食材：</span>
              {recipe.ingredients}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* 主内容 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
      >
        {/* 固定顶部搜索栏 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm"
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索宝宝食谱..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/weekly")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white"
              >
                <Calendar className="h-5 w-5" />
              </motion.button>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
              >
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 分类标签 */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-b"
          >
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
          </motion.div>
        </motion.div>

        {/* 菜谱列表 */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <SkeletonCard key={item} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </motion.div>
          )}

          {/* 空状态 */}
          {!isLoading && filteredRecipes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">未找到相关食谱</p>
            </motion.div>
          )}
        </div>

        {/* 筛选抽屉 */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">筛选</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">分类</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              selectedCategory === category
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsFilterOpen(false);
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RecipeList;
