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
} from "lucide-react";
import { motion } from "framer-motion";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "辅食初期",
    time: "",
    ageRange: "",
    difficulty: "简单",
    description: "",
    nutrition: "",
    ingredients: "",
    steps: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["辅食初期", "辅食中期", "辅食后期"];
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
    <div className="pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-lg p-4">
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
                setFormData((prev) => ({ ...prev, ageRange: e.target.value }))
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
                setFormData((prev) => ({ ...prev, category: e.target.value }))
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
                setFormData((prev) => ({ ...prev, difficulty: e.target.value }))
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
                setFormData((prev) => ({ ...prev, nutrition: e.target.value }))
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
        <div className="max-w-lg mx-auto">
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
      </div>
    </div>
  );
};

export default AddRecipe;
