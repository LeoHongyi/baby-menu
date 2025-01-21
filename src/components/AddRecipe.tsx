import React, { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = true;

  const categories = ["早餐", "点心", "正餐"];
  const difficulties = ["简单", "中等", "较难"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("提交的数据:", formData);
    setIsSubmitting(false);
    navigate("/");
  };

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
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <Notebook className="h-4 w-4 mr-1.5 text-gray-400" />
                食谱图标
              </label>
              <div className="relative">
                {/* 当前选中的 emoji */}
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

                {/* Emoji 选择器弹出层 */}
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
                      {/* 点击外部关闭 */}
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
              </div>
            </div>
            {/* 分割线 */}
            <div className="h-px bg-gray-100 my-6" />
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
            <div className="mb-4">
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
            </div>

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
