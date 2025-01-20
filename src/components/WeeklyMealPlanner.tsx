import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shuffle,
  Edit2,
  Save,
  Plus,
  X,
  Calendar,
  Clock,
  Baby,
} from "lucide-react";

const mealTypes = ["早餐", "上午点心", "午餐", "下午点心", "晚餐"];

const sampleRecipes = {
  "4-6个月": [
    { name: "苹果泥", time: "10分钟", type: ["上午点心", "下午点心"] },
    { name: "胡萝卜泥", time: "15分钟", type: ["午餐", "晚餐"] },
    { name: "南瓜泥", time: "15分钟", type: ["午餐", "晚餐"] },
    { name: "米糊", time: "20分钟", type: ["早餐", "晚餐"] },
  ],
  "6-8个月": [
    { name: "蛋黄菜粥", time: "25分钟", type: ["早餐", "晚餐"] },
    { name: "红薯泥", time: "20分钟", type: ["午餐"] },
    { name: "香蕉牛奶", time: "5分钟", type: ["上午点心", "下午点心"] },
    { name: "豆腐泥", time: "15分钟", type: ["午餐", "晚餐"] },
    { name: "西兰花泥", time: "15分钟", type: ["午餐"] },
  ],
  "8-12个月": [
    { name: "肉末蔬菜粥", time: "30分钟", type: ["午餐", "晚餐"] },
    { name: "水果酸奶", time: "5分钟", type: ["上午点心", "下午点心"] },
    { name: "鸡肝泥", time: "20分钟", type: ["午餐"] },
    { name: "蒸蛋", time: "15分钟", type: ["早餐", "晚餐"] },
    { name: "鱼肉粥", time: "25分钟", type: ["午餐", "晚餐"] },
  ],
};

const WeeklyMealPlanner = () => {
  const [ageRange, setAgeRange] = useState("6-8个月");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: { meals: Array(5).fill("") },
    tuesday: { meals: Array(5).fill("") },
    wednesday: { meals: Array(5).fill("") },
    thursday: { meals: Array(5).fill("") },
    friday: { meals: Array(5).fill("") },
    saturday: { meals: Array(5).fill("") },
    sunday: { meals: Array(5).fill("") },
  });

  const days = [
    { key: "monday", label: "周一" },
    { key: "tuesday", label: "周二" },
    { key: "wednesday", label: "周三" },
    { key: "thursday", label: "周四" },
    { key: "friday", label: "周五" },
    { key: "saturday", label: "周六" },
    { key: "sunday", label: "周日" },
  ];

  const generateRandomMeal = (mealType) => {
    const availableRecipes = sampleRecipes[ageRange].filter((recipe) =>
      recipe.type.includes(mealType)
    );
    if (availableRecipes.length === 0) return "";
    return availableRecipes[Math.floor(Math.random() * availableRecipes.length)]
      .name;
  };

  const generateWeeklyPlan = () => {
    const newPlan = {};
    days.forEach((day) => {
      newPlan[day.key] = {
        meals: mealTypes.map((mealType) => generateRandomMeal(mealType)),
      };
    });
    setWeeklyPlan(newPlan);
  };

  const handleMealClick = (day, mealIndex) => {
    if (!isEditing) return;
    setSelectedDay(day);
    setSelectedMealType(mealTypes[mealIndex]);
    setShowAddModal(true);
  };

  const handleAddMeal = (recipe) => {
    if (!selectedDay || selectedMealType === null) return;

    setWeeklyPlan((prev) => {
      const newPlan = { ...prev };
      const mealIndex = mealTypes.indexOf(selectedMealType);
      newPlan[selectedDay].meals[mealIndex] = recipe.name;
      return newPlan;
    });

    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部控制栏 */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {Object.keys(sampleRecipes).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={generateWeeklyPlan}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg"
              >
                <Shuffle className="h-4 w-4" />
                随机生成
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isEditing
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  完成编辑
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  编辑食谱
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* 食谱表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 bg-gray-50 border-r">
              <span className="text-sm text-gray-500">时间</span>
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className="p-3 bg-gray-50 border-r last:border-r-0"
              >
                <span className="text-sm font-medium">{day.label}</span>
              </div>
            ))}
          </div>

          {mealTypes.map((mealType, mealIndex) => (
            <div
              key={mealType}
              className="grid grid-cols-8 border-b last:border-b-0"
            >
              <div className="p-3 bg-gray-50 border-r">
                <span className="text-sm text-gray-500">{mealType}</span>
              </div>
              {days.map((day) => (
                <motion.div
                  key={day.key}
                  className={`p-3 border-r last:border-r-0 ${
                    isEditing ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={() => handleMealClick(day.key, mealIndex)}
                  whileHover={isEditing ? { scale: 0.98 } : {}}
                >
                  <span className="text-sm">
                    {weeklyPlan[day.key].meals[mealIndex] || "-"}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 添加食谱模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">选择食谱</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {sampleRecipes[ageRange]
                  .filter((recipe) => recipe.type.includes(selectedMealType))
                  .map((recipe, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 0.99 }}
                      onClick={() => handleAddMeal(recipe)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{recipe.name}</span>
                        <span className="text-sm text-gray-500">
                          {recipe.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Baby className="h-4 w-4" />
              适合年龄: {ageRange}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              计划周期: 一周
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              用餐次数: {mealTypes.length}次/天
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMealPlanner;
