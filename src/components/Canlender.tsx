import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { recipeDB } from "@/lib/utils";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState({});
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedDayMeals, setSelectedDayMeals] = useState(null);

  // 在组件加载和月份变化时加载该月的所有餐单
  useEffect(() => {
    const loadMonthMealPlans = async () => {
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // 格式化日期为 YYYY-MM-DD
      const startDate = firstDay.toISOString().split("T")[0];
      const endDate = lastDay.toISOString().split("T")[0];

      try {
        const monthPlans = await recipeDB.getMealPlansInRange(
          startDate,
          endDate
        );
        const plansMap = {};
        monthPlans.forEach((plan) => {
          plansMap[plan.date] = plan.meals;
        });
        setMealPlans(plansMap);
      } catch (error) {
        console.error("加载月度餐单失败:", error);
      }
    };

    loadMonthMealPlans();
  }, [currentDate]);

  // 处理日期选择
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split("T")[0];

    try {
      const dayMeals = await recipeDB.getMealPlan(dateStr);
      setSelectedDayMeals(dayMeals);
      setShowMealPlan(true);
    } catch (error) {
      console.error("加载当日餐单失败:", error);
    }
  };

  // 获取当月的所有日期
  const getDaysInMonth = () => {
    const days = [];
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    // 添加上个月的日期
    for (let i = 0; i < startDay; i++) {
      const prevMonthLastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days.push({
        date: new Date(
          prevMonthLastDay.setDate(
            prevMonthLastDay.getDate() - (startDay - i - 1)
          )
        ),
        isCurrentMonth: false,
      });
    }

    // 添加当月的日期
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // 添加下个月的日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          i
        ),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // 检查日期是否有餐单
  const hasMealPlan = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return (
      mealPlans[dateStr] &&
      (mealPlans[dateStr].早餐?.length > 0 ||
        mealPlans[dateStr].午餐?.length > 0 ||
        mealPlans[dateStr].晚餐?.length > 0)
    );
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="p-4 bg-white rounded-lg shadow">
        {/* 日历头部 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <h2 className="text-lg font-medium">
            {currentDate.getFullYear()}年 {months[currentDate.getMonth()]}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* 星期表头 */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          <AnimatePresence mode="wait">
            {getDaysInMonth().map((dayInfo, index) => (
              <motion.div
                key={dayInfo.date.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`
                  relative bg-white p-1 min-h-[80px] cursor-pointer
                  ${!dayInfo.isCurrentMonth ? "text-gray-400" : ""}
                  ${isToday(dayInfo.date) ? "bg-pink-50" : ""}
                  ${isSelected(dayInfo.date) ? "ring-2 ring-pink-500" : ""}
                `}
                onClick={() => handleDateSelect(dayInfo.date)}
              >
                <div className="text-right mb-1">
                  <span className="text-sm">{dayInfo.date.getDate()}</span>
                </div>
                {hasMealPlan(dayInfo.date) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 餐单弹窗 */}
      <AnimatePresence>
        {showMealPlan && selectedDayMeals && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-4 z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedDate.toLocaleDateString("zh-CN", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                餐单
              </h3>
              <button
                onClick={() => setShowMealPlan(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {["早餐", "午餐", "晚餐"].map((mealTime) => (
                <div key={mealTime}>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {mealTime}
                  </h4>
                  {selectedDayMeals[mealTime]?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDayMeals[mealTime].map((meal, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          {meal.title}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">暂无安排</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
