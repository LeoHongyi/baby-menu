import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { recipeDB } from "@/lib/utils";
import html2canvas from "html2canvas";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState({});
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedDayMeals, setSelectedDayMeals] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

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

  const handleShareMonth = () => {
    setShowShareModal(true);
  };

  const generateShareImage = async () => {
    setShareLoading(true);
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      const decorativeStyles = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
      }

      @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .cute-decoration {
        position: absolute;
        font-size: 24px;
        animation: float 3s ease-in-out infinite;
      }

      .cute-heart {
        position: absolute;
        width: 20px;
        height: 20px;
        background: pink;
        transform: rotate(45deg);
        animation: bounce 2s ease-in-out infinite;
      }
      .cute-heart:before,
      .cute-heart:after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background: pink;
        border-radius: 50%;
      }
      .cute-heart:before {
        left: -10px;
      }
      .cute-heart:after {
        top: -10px;
      }

      .cute-star {
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid #FFD700;
        animation: wiggle 2s ease-in-out infinite;
      }

      .cute-cloud {
        position: absolute;
        width: 40px;
        height: 20px;
        background: #f0f0f0;
        border-radius: 20px;
        animation: float 4s ease-in-out infinite;
      }
      .cute-cloud:before,
      .cute-cloud:after {
        content: '';
        position: absolute;
        background: #f0f0f0;
        border-radius: 50%;
      }
      .cute-cloud:before {
        width: 25px;
        height: 25px;
        top: -10px;
        left: 5px;
      }
      .cute-cloud:after {
        width: 20px;
        height: 20px;
        top: -5px;
        right: 5px;
      }

      .content-wrapper {
        position: relative;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 
          0 4px 6px rgba(0, 0, 0, 0.05),
          0 10px 15px rgba(0, 0, 0, 0.1);
      }

      .decoration-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
    `;

      // 创建装饰性背景容器
      const decorativeContainer = document.createElement("div");
      decorativeContainer.style.width = "1000px";
      decorativeContainer.style.padding = "60px";
      decorativeContainer.style.background = `
        linear-gradient(135deg, #fff6f6 0%, #fff8f0 100%)
      `;

      // 添加装饰性图案
      const patternStyles = `
        .pattern-bg {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background: 
            radial-gradient(circle at 0% 0%, #ff9a9e 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, #fad0c4 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, #ffd1ff 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, #fad0c4 0%, transparent 50%);
        }
        
        .pattern-dots {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: 
            radial-gradient(#ff9a9e 1px, transparent 1px),
            radial-gradient(#ffd1ff 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }
        
        .content-wrapper {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 10px 15px rgba(0, 0, 0, 0.1);
        }
      `;

      // 创建主内容容器
      const shareContainer = document.createElement("div");
      shareContainer.style.position = "relative";
      shareContainer.innerHTML = `
        <style>${decorativeStyles}</style>
        <div class="pattern-bg"></div>
        <div class="pattern-dots"></div>
           <div class="decoration-container">
          ${Array.from(
            { length: 5 },
            (_, i) => `
            <div class="cute-heart" style="
              top: ${Math.random() * 100}%;
              left: ${Math.random() * 100}%;
              animation-delay: ${i * 0.5}s;
            "></div>
            <div class="cute-star" style="
              top: ${Math.random() * 100}%;
              right: ${Math.random() * 100}%;
              animation-delay: ${i * 0.3}s;
            "></div>
            <div class="cute-cloud" style="
              top: ${Math.random() * 100}%;
              left: ${Math.random() * 100}%;
              animation-delay: ${i * 0.7}s;
            "></div>
          `
          ).join("")}
        </div>
        <div class="content-wrapper">
          <div style="
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
            font-weight: bold;
            color: #374151;
            letter-spacing: 1px;
          ">
            ${currentDate.getFullYear()}年${months[currentDate.getMonth()]}餐单
          </div>
          <div id="calendar-clone"></div>
       <div style="
            text-align: center;
            margin-top: 30px;
            color: #9CA3AF;
            font-size: 14px;
            position: relative;
          ">
            来自我的餐单计划
            <span style="
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              bottom: -25px;
              font-size: 20px;
              animation: bounce 1s ease-in-out infinite;
            ">💝</span>
          </div>
        </div>
      `;

      // 克隆日历内容
      const calendarContent = document
        .querySelector(".calendar-content")
        .cloneNode(true);

      // 移除交互元素
      calendarContent.querySelectorAll("button").forEach((button) => {
        if (!button.classList.contains("date-cell")) {
          button.style.display = "none";
        }
      });

      // 优化网格样式
      const gridContainer = calendarContent.querySelector(".grid");
      if (gridContainer) {
        gridContainer.style.backgroundColor = "#ffffff";
        gridContainer.style.gap = "1px";
        gridContainer.style.border = "1px solid #e5e7eb";
        gridContainer.style.borderRadius = "12px";
        gridContainer.style.overflow = "hidden";
      }

      // 优化日期格子样式
      calendarContent.querySelectorAll(".date-cell").forEach((cell) => {
        cell.style.height = "100px";
        cell.style.padding = "8px";
        cell.style.backgroundColor = "#ffffff";
        cell.style.transition = "none";
        cell.style.cursor = "default";
      });

      decorativeContainer.appendChild(shareContainer);
      container.appendChild(decorativeContainer);

      // 将克隆的日历内容插入到预留位置
      const calendarCloneContainer =
        shareContainer.querySelector("#calendar-clone");
      calendarCloneContainer.appendChild(calendarContent);

      // 生成图片
      const canvas = await html2canvas(decorativeContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: 1000,
        height: decorativeContainer.offsetHeight,
        onclone: (document) => {
          const clonedContent = document.querySelector(".calendar-content");
          if (clonedContent) {
            clonedContent.style.transform = "none";
            clonedContent.style.animation = "none";
          }
        },
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `餐单${currentDate.getFullYear()}年${
        months[currentDate.getMonth()]
      }.png`;
      link.href = image;
      link.click();

      document.body.removeChild(container);
    } catch (error) {
      console.error("生成分享图片失败:", error);
    }
    setShareLoading(false);
  };

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
        const monthPlans = await db.getMealPlansInRange(startDate, endDate);
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
  }, [currentDate, db]);

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
      <div
        id="calendar-container"
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
      >
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="calendar-content">
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
                onClick={handleShareMonth}
                className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-600"
                title="分享本月餐单"
              >
                <Share2 className="h-5 w-5" />
              </button>
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
                <div
                  key={index}
                  className="text-center text-sm text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            {/* 修改日期网格部分 */}
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
           date-cell relative bg-white p-2 min-h-[100px] cursor-pointer hover:bg-gray-50
          ${!dayInfo.isCurrentMonth ? "text-gray-400" : ""}
          ${isToday(dayInfo.date) ? "bg-pink-50 hover:bg-pink-100" : ""}
          ${isSelected(dayInfo.date) ? "ring-2 ring-pink-500" : ""}
        `}
                    onClick={() => handleDateSelect(dayInfo.date)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`
            flex items-center justify-center w-6 h-6 rounded-full
            ${isToday(dayInfo.date) ? "bg-pink-500 text-white" : ""}
          `}
                      >
                        {dayInfo.date.getDate()}
                      </span>
                      {hasMealPlan(dayInfo.date) && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      )}
                    </div>

                    {/* 餐单简要信息 */}
                    {hasMealPlan(dayInfo.date) && (
                      <div className="mt-1 space-y-1">
                        {["早餐", "午餐", "晚餐"].map((mealTime) => {
                          const dateStr = dayInfo.date
                            .toISOString()
                            .split("T")[0];
                          const meals = mealPlans[dateStr]?.[mealTime];
                          if (!meals?.length) return null;

                          return (
                            <div key={mealTime} className="group">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-400">
                                  {mealTime[0]}
                                </span>
                                <div className="text-xs text-gray-600 truncate group-hover:text-pink-500">
                                  {meals[0].title}
                                  {meals.length > 1 && ` +${meals.length - 1}`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 添加餐单提示 */}
                    {!hasMealPlan(dayInfo.date) && dayInfo.isCurrentMonth && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="text-xs text-gray-400">
                          点击添加餐单
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
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

      {/* 分享模态框 */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-xl p-4 z-50 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">分享餐单</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {/* 分享选项 */}
                <button
                  onClick={() => {
                    // 调用系统分享 API
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "我的餐单",
                          text: `${currentDate.getFullYear()}年${
                            months[currentDate.getMonth()]
                          }餐单`,
                          url: window.location.href,
                        })
                        .catch(console.error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Share2 className="h-5 w-5" />
                  分享给朋友
                </button>

                <button
                  onClick={generateShareImage}
                  disabled={shareLoading}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Download className="h-5 w-5" />
                  {shareLoading ? "生成中..." : "保存图片"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
