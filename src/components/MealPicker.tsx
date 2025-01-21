import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";

const MealPicker = ({
  isOpen,
  onClose,
  selectedRecipe,
  onMealSelect,
  todayMeals,
}) => {
  const mealTimes = ["早餐", "午餐", "晚餐"];
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-medium">添加到今日食谱</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {todayStr} - {selectedRecipe?.title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {mealTimes.map((mealTime) => {
                  const existingMeals = todayMeals[mealTime] || [];

                  return (
                    <button
                      key={mealTime}
                      className="w-full p-3 rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        onMealSelect(mealTime);
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{mealTime}</span>
                        <span className="text-sm text-gray-500">
                          {existingMeals.length
                            ? `${existingMeals.length}个食谱`
                            : "未添加"}
                        </span>
                      </div>
                      {existingMeals.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {existingMeals.map((meal, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full"
                            >
                              {meal.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MealPicker;
