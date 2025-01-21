import { AnimatePresence, motion } from "framer-motion";
import { X, Check, TrashIcon, Plus } from "lucide-react";

const MealPicker = ({
  isOpen,
  onClose,
  selectedRecipe,
  onMealSelect,
  onMealRemove,
  todayMeals,
}) => {
  const mealTimes = ["早餐", "午餐", "晚餐"];

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
                        onMealSelect(mealTime);
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
