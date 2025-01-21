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
    this.dbVersion = 1; // 增加版本号可以强制更新数据库结构
    this.db = null;
  }

  async init(): Promise<void> {
    // 如果已经存在旧的数据库连接，先关闭它
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

        // 验证存储空间是否存在
        if (!this.db.objectStoreNames.contains("recipes")) {
          console.error("存储空间不存在，需要升级数据库");
          // 关闭当前连接
          this.db.close();
          // 增加版本号重新打开数据库
          this.dbVersion += 1;
          this.init().then(resolve).catch(reject);
          return;
        }

        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("正在升级/创建数据库...");
        const db = (event.target as IDBOpenDBRequest).result;

        // 如果存储空间已存在，先删除它
        if (db.objectStoreNames.contains("recipes")) {
          db.deleteObjectStore("recipes");
        }

        // 创建新的存储空间
        try {
          const store = db.createObjectStore("recipes", {
            keyPath: "id",
            autoIncrement: true,
          });

          // 创建索引
          store.createIndex("title", "title", { unique: false });
          store.createIndex("category", "category", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });

          console.log("存储空间创建成功");
        } catch (error) {
          console.error("创建存储空间失败:", error);
          reject(error);
        }
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
}

// 创建单例实例
export const recipeDB = new RecipeDB();
// export const recipeDB = new RecipeDB();
