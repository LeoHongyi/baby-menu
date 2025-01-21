import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class RecipeDB {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null;

  constructor() {
    this.dbName = "BabyRecipesDB";
    this.dbVersion = 2; // 增加版本号可以强制更新数据库结构
    this.db = null;
  }

  async init(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }

    return new Promise((resolve, reject) => {
      console.log("开始打开数据库...");
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error(
          "数据库打开失败:",
          (event.target as IDBOpenDBRequest).error
        );
        reject("数据库打开失败");
      };

      request.onblocked = (event) => {
        console.error("数据库被阻塞:", event);
        reject("数据库被阻塞，请关闭其他标签页后重试");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log("数据库打开成功");

        // 验证所有必需的存储空间是否存在
        if (
          !this.db.objectStoreNames.contains("recipes") ||
          !this.db.objectStoreNames.contains("mealPlans")
        ) {
          console.error("存储空间不存在，需要升级数据库");
          this.db.close();
          this.dbVersion += 1;
          this.init().then(resolve).catch(reject);
          return;
        }

        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("正在升级/创建数据库...");
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建或更新 recipes 存储空间
        if (db.objectStoreNames.contains("recipes")) {
          db.deleteObjectStore("recipes");
        }
        const recipeStore = db.createObjectStore("recipes", {
          keyPath: "id",
          autoIncrement: true,
        });
        recipeStore.createIndex("title", "title", { unique: false });
        recipeStore.createIndex("category", "category", { unique: false });
        recipeStore.createIndex("createdAt", "createdAt", { unique: false });

        // 创建或更新 mealPlans 存储空间
        if (!db.objectStoreNames.contains("mealPlans")) {
          const mealPlanStore = db.createObjectStore("mealPlans", {
            keyPath: "date",
          });
          mealPlanStore.createIndex("date", "date", { unique: true });
        }

        console.log("所有存储空间创建成功");
      };
    });
  }

  async addRecipe(recipe: any): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      // 验证存储空间是否存在
      if (!this.db.objectStoreNames.contains("recipes")) {
        reject(new Error("存储空间不存在，请重新初始化数据库"));
        return;
      }

      try {
        const transaction = this.db.transaction(["recipes"], "readwrite");
        const store = transaction.objectStore("recipes");

        const recipeData = {
          ...recipe,
          createdAt: new Date().toISOString(),
        };

        const request = store.add(recipeData);

        request.onsuccess = () => {
          const id = request.result;
          console.log("食谱添加成功, ID:", id);
          resolve(id);
        };

        request.onerror = () => {
          console.error("添加食谱失败:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("添加食谱失败:", error);
        reject(error);
      }
    });
  }

  // 删除并重新创建数据库
  async resetDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 先关闭现有连接
      if (this.db) {
        this.db.close();
        this.db = null;
      }

      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        console.log("数据库删除成功，准备重新初始化");
        // 重新初始化数据库
        this.init()
          .then(() => {
            console.log("数据库重置成功");
            resolve();
          })
          .catch(reject);
      };

      deleteRequest.onerror = () => {
        console.error("删除数据库失败:", deleteRequest.error);
        reject(deleteRequest.error);
      };
    });
  }

  async searchRecipes(
    searchTerm: string = "",
    selectedCategory: string = "全部"
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      try {
        const transaction = this.db.transaction(["recipes"], "readonly");
        const store = transaction.objectStore("recipes");
        const request = store.getAll();

        request.onsuccess = () => {
          let results = request.result || [];

          // 过滤搜索结果
          results = results.filter((recipe) => {
            // 标题匹配
            const titleMatch = recipe.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

            // 食材匹配
            const ingredientsMatch = recipe.ingredients
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

            // 制作步骤匹配
            const stepsMatch = recipe.steps
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

            // 分类匹配（如果选择了特定分类）
            const categoryMatch =
              selectedCategory === "全部" ||
              recipe.category === selectedCategory;

            // 如果搜索词为空，只按分类筛选
            if (!searchTerm) {
              return categoryMatch;
            }

            // 返回任一字段匹配且分类匹配的结果
            return (
              (titleMatch || ingredientsMatch || stepsMatch) && categoryMatch
            );
          });

          // 按创建时间降序排序
          results.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          console.log(`搜索完成，找到 ${results.length} 个结果`);
          resolve(results);
        };

        request.onerror = () => {
          console.error("搜索失败:", request.error);
          reject(new Error("搜索失败"));
        };
      } catch (error) {
        console.error("搜索过程发生错误:", error);
        reject(error);
      }
    });
  }

  // 新增：保存每日食谱计划
  async saveMealPlan(
    date: string,
    meals: {
      早餐: any[];
      午餐: any[];
      晚餐: any[];
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      try {
        const transaction = this.db.transaction(["mealPlans"], "readwrite");
        const store = transaction.objectStore("mealPlans");

        const mealPlan = {
          date,
          meals,
          updatedAt: new Date().toISOString(),
        };

        const request = store.put(mealPlan);

        request.onsuccess = () => {
          console.log("食谱计划保存成功");
          resolve();
        };

        request.onerror = () => {
          console.error("保存食谱计划失败:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("保存食谱计划时发生错误:", error);
        reject(error);
      }
    });
  }

  // 新增：获取指定日期的食谱计划
  async getMealPlan(date: string): Promise<{
    早餐: any[];
    午餐: any[];
    晚餐: any[];
  }> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      try {
        const transaction = this.db.transaction(["mealPlans"], "readonly");
        const store = transaction.objectStore("mealPlans");
        const request = store.get(date);

        request.onsuccess = () => {
          resolve(
            request.result?.meals || {
              早餐: [],
              午餐: [],
              晚餐: [],
            }
          );
        };

        request.onerror = () => {
          console.error("获取食谱计划失败:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("获取食谱计划时发生错误:", error);
        reject(error);
      }
    });
  }

  // 新增：删除指定日期的食谱计划
  async deleteMealPlan(date: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      try {
        const transaction = this.db.transaction(["mealPlans"], "readwrite");
        const store = transaction.objectStore("mealPlans");
        const request = store.delete(date);

        request.onsuccess = () => {
          console.log("食谱计划删除成功");
          resolve();
        };

        request.onerror = () => {
          console.error("删除食谱计划失败:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("删除食谱计划时发生错误:", error);
        reject(error);
      }
    });
  }

  // 新增：获取指定日期范围内的所有食谱计划
  async getMealPlansInRange(
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("数据库未初始化"));
        return;
      }

      try {
        const transaction = this.db.transaction(["mealPlans"], "readonly");
        const store = transaction.objectStore("mealPlans");
        const request = store.getAll();

        request.onsuccess = () => {
          const allPlans = request.result || [];
          const filteredPlans = allPlans.filter(
            (plan) => plan.date >= startDate && plan.date <= endDate
          );
          resolve(filteredPlans);
        };

        request.onerror = () => {
          console.error("获取食谱计划范围失败:", request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error("获取食谱计划范围时发生错误:", error);
        reject(error);
      }
    });
  }
}

// 创建单例实例
export const recipeDB = new RecipeDB();
// export const recipeDB = new RecipeDB();
