import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Baby,
  ChefHat,
  Notebook,
  Carrot,
  HeartPulse,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { recipeDB } from "@/lib/utils";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "早餐",
    emoji: "🍜",
    time: "",
    ageRange: "",
    difficulty: "简单",
    description: "",
    nutrition: "",
    ingredients: "",
    steps: "",
  });
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = true;

  const categories = ["早餐", "点心", "正餐"];
  const difficulties = ["简单", "中等", "较难"];
  const commonIngredients = {
    主食类: ["米粉", "面条", "大米", "小米", "燕麦", "南瓜", "红薯", "土豆"],
    蛋奶类: ["鸡蛋", "鸡蛋黄", "牛奶", "酸奶", "奶酪"],
    肉类: ["鸡肉", "猪肉", "牛肉", "鱼肉", "虾仁"],
    蔬菜类: ["胡萝卜", "西兰花", "菠菜", "南瓜", "玉米", "豌豆", "青菜"],
    水果类: ["苹果", "香蕉", "梨", "橙子", "草莓", "蓝莓"],
    豆类: ["豆腐", "黄豆", "红豆", "毛豆", "豌豆"],
  };

  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [customIngredient, setCustomIngredient] = useState("");

  // 处理食材选择
  const handleIngredientSelect = (ingredient) => {
    const newSelected = new Set(selectedIngredients);
    if (newSelected.has(ingredient)) {
      newSelected.delete(ingredient);
    } else {
      newSelected.add(ingredient);
    }
    setSelectedIngredients(newSelected);

    // 更新表单数据
    const ingredientsList = Array.from(newSelected).join("、");
    setFormData((prev) => ({
      ...prev,
      ingredients: ingredientsList,
    }));
  };

  // 添加自定义食材
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim()) {
      const newSelected = new Set(selectedIngredients);
      newSelected.add(customIngredient.trim());
      setSelectedIngredients(newSelected);

      // 更新表单数据
      const ingredientsList = Array.from(newSelected).join("、");
      setFormData((prev) => ({
        ...prev,
        ingredients: ingredientsList,
      }));

      setCustomIngredient("");
    }
  };

  // 修改主要食材部分的渲染
  const renderIngredientsInput = () => (
    <div className="mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
        <Carrot className="h-4 w-4 mr-1.5 text-gray-400" />
        主要食材
      </label>

      {/* 已选食材展示 */}
      {selectedIngredients.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.from(selectedIngredients).map((ingredient) => (
            <motion.span
              key={ingredient}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm"
            >
              {ingredient}
              <button
                onClick={() => handleIngredientSelect(ingredient)}
                className="ml-1.5 hover:text-pink-700"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* 食材选择器开关 */}
      <motion.button
        type="button"
        onClick={() => setShowIngredientSelector(!showIngredientSelector)}
        className="w-full mb-2 px-4 py-3 border border-gray-200 rounded-lg text-left text-gray-600 flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >
        选择常见食材
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            showIngredientSelector ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* 食材选择器 */}
      <AnimatePresence>
        {showIngredientSelector && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {Object.entries(commonIngredients).map(([category, items]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => handleIngredientSelect(ingredient)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedIngredients.has(ingredient)
                            ? "bg-pink-500 text-white"
                            : "bg-white text-gray-600 border border-gray-200"
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 自定义食材输入 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customIngredient}
          onChange={(e) => setCustomIngredient(e.target.value)}
          placeholder="添加其他食材..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustomIngredient();
            }
          }}
        />
        <motion.button
          type="button"
          onClick={handleAddCustomIngredient}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          添加
        </motion.button>
      </div>
    </div>
  );

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

  const validateForm = () => {
    if (!formData.title) return "请输入食谱名称";
    if (!formData.ageRange) return "请输入适合年龄";
    if (!formData.time) return "请输入制作时间";
    if (!formData.ingredients) return "请输入主要食材";
    if (!formData.steps) return "请输入制作说明";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!db) {
        throw new Error("数据库未初始化");
      }

      // 添加食谱到数据库
      const recipeId = await db.addRecipe(formData);

      // 显示成功消息
      alert("食谱添加成功！");

      // 返回上一页
      navigate(-1);
    } catch (error) {
      console.error("保存食谱失败:", error);
      setError("保存食谱失败，请重试");
      alert("保存失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-50 z-50"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* 顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600"
            >
              <X className="h-5 w-5 mr-1" />
              关闭
            </button>
            <h1 className="text-lg font-medium">添加食谱</h1>
            <div className="w-12"></div> {/* 占位，保持标题居中 */}
          </div>
        </div>
        <div className="pt-14 pb-24 overflow-auto h-full">
          <div className="bg-white rounded-lg p-4">
            {/* Emoji 选择器 */}
            {/* Emoji 选择器 */}
            <div className="mb-4">
              {/* <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Notebook className="h-4 w-4 mr-1.5 text-gray-400" />
                食谱图标
              </label> */}
              {/* <div className="relative">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full h-20 bg-gray-50 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden group border border-gray-200"
                >
                  <span className="text-5xl">{formData.emoji}</span>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200" />
                </motion.button>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 left-0 right-0 mt-2"
                      >
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                          <div className="p-2 border-b flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              选择图标
                            </span>
                            <button
                              onClick={() => setShowEmojiPicker(false)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <Picker
                            data={data}
                            onEmojiSelect={(emoji) => {
                              setFormData((prev) => ({
                                ...prev,
                                emoji: emoji.native,
                              }));
                              setShowEmojiPicker(false);
                            }}
                            locale="zh"
                            theme="light"
                            skinTonePosition="none"
                            previewPosition="none"
                            categories={["foods", "fruits"]}
                            maxFrequentRows={0}
                            navPosition="bottom"
                            perLine={8}
                            emojiSize={28}
                            emojiButtonSize={38}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black bg-opacity-10"
                        onClick={() => setShowEmojiPicker(false)}
                      />
                    </>
                  )}
                </AnimatePresence>
              </div> */}
            </div>
            {/* 分割线 */}
            {/* <div className="h-px bg-gray-100 my-6" /> */}
            {/* 食谱名称 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Notebook className="h-4 w-4 mr-1.5 text-gray-400" />
                食谱名称
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="给宝宝的食谱起个名字"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* 适合年龄 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Baby className="h-4 w-4 mr-1.5 text-gray-400" />
                适合年龄
              </label>
              <input
                type="text"
                value={formData.ageRange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ageRange: e.target.value,
                  }))
                }
                placeholder="例如：6-8个月"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* 分类 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <ChefHat className="h-4 w-4 mr-1.5 text-gray-400" />
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 制作时间 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                制作时间
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                placeholder="例如：20分钟"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* 难度 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <AlertCircle className="h-4 w-4 mr-1.5 text-gray-400" />
                难度
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              >
                {difficulties.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 营养价值 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <HeartPulse className="h-4 w-4 mr-1.5 text-gray-400" />
                营养价值
              </label>
              <input
                type="text"
                value={formData.nutrition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nutrition: e.target.value,
                  }))
                }
                placeholder="例如：富含维生素C、膳食纤维"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* 主要食材 */}
            {renderIngredientsInput()}
            {/* <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Carrot className="h-4 w-4 mr-1.5 text-gray-400" />
                主要食材
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ingredients: e.target.value,
                  }))
                }
                placeholder="列出需要的食材和用量"
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div> */}

            {/* 制作说明 */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Notebook className="h-4 w-4 mr-1.5 text-gray-400" />
                制作说明
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, steps: e.target.value }))
                }
                placeholder="详细的制作步骤..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-lg text-white font-medium ${
              isSubmitting ? "bg-gray-400" : "bg-pink-500"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? "保存中..." : "保存食谱"}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddRecipe;
