import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";

const DatePicker = ({
  isOpen,
  onClose,
  selectedRecipe,
  onDateSelect,
  existingMeals,
}) => {
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return {
      full: `${date.getMonth() + 1}月${date.getDate()}日`,
      day: days[date.getDay()],
      dateString: date.toISOString().split("T")[0],
    };
  };

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
                <h3 className="text-lg font-medium">选择日期</h3>
                <p className="text-sm text-gray-500 mt-1">
                  将 "{selectedRecipe?.title}" 添加到日程
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
                {getNext7Days().map((date) => {
                  const { full, day, dateString } = formatDate(date);
                  const existingMeal = existingMeals[dateString];

                  return (
                    <button
                      key={dateString}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        existingMeal ? "bg-green-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        onDateSelect(dateString);
                        onClose();
                      }}
                    >
                      <div>
                        <div className="font-medium text-left">{full}</div>
                        <div className="text-sm text-gray-500">{day}</div>
                      </div>
                      {existingMeal && (
                        <div className="flex items-center text-green-600">
                          <span className="text-sm mr-2">
                            {existingMeal.title}
                          </span>
                          <Check className="h-5 w-5" />
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

export default DatePicker;
