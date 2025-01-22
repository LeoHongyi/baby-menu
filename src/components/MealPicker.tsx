import { AnimatePresence, motion } from "framer-motion";
import { X, Check, TrashIcon, Plus, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

const MealPicker = ({
  isOpen,
  onClose,
  selectedRecipe,
  onMealSelect,
  onMealRemove,
  todayMeals,
}) => {
  const mealTimes = ["早餐", "午餐", "晚餐"];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 生成未来7天的日期选项
  const dateOptions = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  // 格式化日期显示
  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "今天";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "明天";
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "short",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-25 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
          >
            {/* 日期选择器 */}
            <div className="mb-4">
              <div
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <motion.div animate={{ rotate: showDatePicker ? 180 : 0 }}>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </div>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      {dateOptions.map((date) => (
                        <motion.div
                          key={date.toISOString()}
                          className={`p-2 rounded-md cursor-pointer ${
                            date.toDateString() === selectedDate.toDateString()
                              ? "bg-pink-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {formatDate(date)}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              {mealTimes.map((mealTime) => (
                <div key={mealTime}>
                  <h3 className="font-medium mb-2">{mealTime}</h3>
                  <div className="space-y-2">
                    {/* 已添加的食谱列表 */}
                    {todayMeals[mealTime]?.map((meal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span>{meal.title}</span>
                        <button
                          onClick={() => onMealRemove(mealTime, index)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <TrashIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}

                    {/* 添加按钮始终显示在底部 */}
                    <div
                      className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        // 传入选中的日期
                        onMealSelect(mealTime, selectedDate);
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Plus className="h-4 w-4" />
                        <span>添加食谱</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full mt-4 py-3 bg-gray-100 rounded-lg text-gray-600"
            >
              关闭
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MealPicker;
