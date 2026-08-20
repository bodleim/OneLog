export type MealName = "아침" | "점심" | "저녁";
export type MealStatus = "planned" | "completed" | "skipped";

export type PlanDraft = {
  startDate: string;
  duration: number;
  budget: number;
  selectedMealKeys: string[];
  choice: number;
  ownedIngredients: string[];
  overrides: Record<string, string>;
  replacementRecipeId?: string;
};

export type PlannedMeal = {
  id: string;
  day: number;
  date: string;
  meal: MealName;
  recipeId: string;
  status: MealStatus;
  completedAt?: string;
};

export type PantryItem = {
  name: string;
  amount: number;
  unit: string;
  source: "owned" | "shopping";
  unknown?: boolean;
  updatedAt: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  needAmount: number;
  unit: string;
  needLabel: string;
  packageLabel: string;
  packageAmount: number;
  packages: number;
  pricePerPackage: number;
  totalPrice: number;
  checked: boolean;
  purchased: boolean;
};

export type MealPlan = {
  id: string;
  startDate: string;
  duration: number;
  budget: number;
  choice: number;
  ownedIngredients: string[];
  meals: PlannedMeal[];
  shopping: ShoppingItem[];
  shoppingCompleted: boolean;
  createdAt: string;
};

export type ShareMessage = {
  id: string;
  sender: "me" | "neighbor";
  text: string;
  createdAt: string;
};

export type ShareThread = {
  id: string;
  neighbor: string;
  ingredients: string[];
  status: "pending" | "active" | "cancelled";
  messages: ShareMessage[];
  unread: number;
  updatedAt: string;
};

export type NotificationPreferences = {
  request: boolean;
  chat: boolean;
  meal: boolean;
  shopping: boolean;
  report: boolean;
  marketing: boolean;
};

export type WebAppState = {
  schemaVersion: 1;
  favorites: string[];
  plan: MealPlan | null;
  pantry: PantryItem[];
  savingsAmount: number;
  shareThreads: ShareThread[];
  notificationPreferences: NotificationPreferences;
  readNotifications: string[];
};

export type IngredientNeed = { name: string; amount: number; unit: string };

export const WEB_STATE_KEY = "onelog-web-app-state-v1";

export const recipeNeeds: Record<string, IngredientNeed[]> = {
  chicken: [
    { name: "닭다리살", amount: 120, unit: "g" },
    { name: "양파", amount: 0.25, unit: "개" },
    { name: "진간장", amount: 1, unit: "큰술" },
    { name: "밥", amount: 1, unit: "공기" },
  ],
  tofu: [
    { name: "두부", amount: 0.5, unit: "모" },
    { name: "김치", amount: 120, unit: "g" },
    { name: "대파", amount: 10, unit: "g" },
    { name: "참기름", amount: 1, unit: "작은술" },
  ],
  tuna: [
    { name: "밥", amount: 1, unit: "공기" },
    { name: "참치", amount: 0.5, unit: "캔" },
    { name: "마요네즈", amount: 1, unit: "큰술" },
    { name: "김가루", amount: 5, unit: "g" },
  ],
  cabbage: [
    { name: "양배추", amount: 120, unit: "g" },
    { name: "달걀", amount: 2, unit: "개" },
    { name: "소금", amount: 1, unit: "꼬집" },
    { name: "식용유", amount: 1, unit: "작은술" },
  ],
  kimchi: [
    { name: "밥", amount: 1, unit: "공기" },
    { name: "김치", amount: 100, unit: "g" },
    { name: "달걀", amount: 1, unit: "개" },
    { name: "대파", amount: 10, unit: "g" },
  ],
  cucumber: [
    { name: "오이", amount: 0.5, unit: "개" },
    { name: "참치", amount: 0.5, unit: "캔" },
    { name: "밥", amount: 1, unit: "공기" },
    { name: "고추장", amount: 1, unit: "큰술" },
  ],
};

const recipeMeals: Record<string, MealName> = {
  chicken: "점심",
  tofu: "점심",
  tuna: "아침",
  cabbage: "저녁",
  kimchi: "저녁",
  cucumber: "점심",
};

export const ingredientCatalog: Record<string, { packageAmount: number; unit: string; packageLabel: string; price: number }> = {
  닭다리살: { packageAmount: 400, unit: "g", packageLabel: "400g 1팩", price: 8500 },
  양파: { packageAmount: 3, unit: "개", packageLabel: "3입 1봉", price: 3000 },
  진간장: { packageAmount: 33, unit: "큰술", packageLabel: "500ml 1병", price: 4500 },
  밥: { packageAmount: 10, unit: "공기", packageLabel: "쌀 1kg", price: 5000 },
  두부: { packageAmount: 1, unit: "모", packageLabel: "1모", price: 2500 },
  김치: { packageAmount: 500, unit: "g", packageLabel: "500g 1봉", price: 7000 },
  대파: { packageAmount: 100, unit: "g", packageLabel: "1단", price: 2000 },
  참기름: { packageAmount: 60, unit: "작은술", packageLabel: "300ml 1병", price: 7000 },
  참치: { packageAmount: 1, unit: "캔", packageLabel: "1캔", price: 2200 },
  마요네즈: { packageAmount: 33, unit: "큰술", packageLabel: "500ml 1병", price: 4500 },
  김가루: { packageAmount: 50, unit: "g", packageLabel: "50g 1봉", price: 3000 },
  양배추: { packageAmount: 500, unit: "g", packageLabel: "1/2통", price: 3000 },
  달걀: { packageAmount: 12, unit: "개", packageLabel: "12구 1팩", price: 6000 },
  소금: { packageAmount: 100, unit: "꼬집", packageLabel: "500g 1봉", price: 1500 },
  식용유: { packageAmount: 180, unit: "작은술", packageLabel: "900ml 1병", price: 6000 },
  오이: { packageAmount: 2, unit: "개", packageLabel: "2개", price: 2500 },
  고추장: { packageAmount: 33, unit: "큰술", packageLabel: "500g 1통", price: 6500 },
};

const choicePools: Record<number, Record<MealName, string[]>> = {
  0: { 아침: ["tuna", "cabbage"], 점심: ["tofu", "chicken", "cucumber"], 저녁: ["kimchi", "cabbage", "tofu"] },
  1: { 아침: ["tuna"], 점심: ["tofu", "chicken"], 저녁: ["kimchi", "tofu"] },
  2: { 아침: ["tuna", "cabbage"], 점심: ["cucumber", "tofu"], 저녁: ["cabbage", "kimchi"] },
};

function localISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, amount: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return localISO(date);
}

export function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function createDefaultDraft(ownedIngredients: string[] = []): PlanDraft {
  const duration = 5;
  return {
    startDate: localISO(),
    duration,
    budget: 30000,
    selectedMealKeys: Array.from({ length: duration }, (_, day) => ["아침", "점심", "저녁"].map((meal) => `${day}-${meal}`)).flat(),
    choice: 0,
    ownedIngredients,
    overrides: {},
  };
}

export function createEmptyWebState(): WebAppState {
  return {
    schemaVersion: 1,
    favorites: ["chicken", "tofu"],
    plan: null,
    pantry: [],
    savingsAmount: 0,
    shareThreads: [],
    notificationPreferences: { request: true, chat: true, meal: true, shopping: false, report: true, marketing: false },
    readNotifications: [],
  };
}

function isExcluded(recipeId: string, exclusions: string[]) {
  return (recipeNeeds[recipeId] ?? []).some((need) => exclusions.some((item) => need.name.includes(item) || item.includes(need.name)));
}

function sortedMealKeys(draft: PlanDraft) {
  const order: MealName[] = ["아침", "점심", "저녁"];
  return draft.selectedMealKeys
    .map((key) => {
      const [rawDay, rawMeal] = key.split("-");
      return { day: Number(rawDay), meal: rawMeal as MealName };
    })
    .filter(({ day, meal }) => Number.isInteger(day) && day >= 0 && day < draft.duration && order.includes(meal))
    .sort((a, b) => a.day - b.day || order.indexOf(a.meal) - order.indexOf(b.meal));
}

export function buildMeals(draft: PlanDraft, favorites: string[], exclusions: string[]): PlannedMeal[] {
  let replacementUsed = false;
  return sortedMealKeys(draft).flatMap(({ day, meal }, index) => {
    const basePool = choicePools[draft.choice]?.[meal] ?? choicePools[0][meal];
    const pool = [...favorites.filter((id) => basePool.includes(id)), ...basePool.filter((id) => !favorites.includes(id))]
      .filter((id, position, list) => list.indexOf(id) === position)
      .filter((id) => !isExcluded(id, exclusions));
    const mealId = `${draft.startDate}-${day}-${meal}`;
    let recipeId = draft.overrides[mealId] || pool[index % Math.max(pool.length, 1)];
    if (!recipeId) return [];
    if (!replacementUsed && draft.replacementRecipeId && recipeMeals[draft.replacementRecipeId] === meal && !isExcluded(draft.replacementRecipeId, exclusions)) {
      recipeId = draft.replacementRecipeId;
      replacementUsed = true;
    }
    return [{
      id: mealId,
      day,
      date: addDays(draft.startDate, day),
      meal,
      recipeId,
      status: "planned" as const,
    }];
  });
}

export function aggregateNeeds(meals: PlannedMeal[]) {
  const totals = new Map<string, IngredientNeed>();
  meals.filter((meal) => meal.status !== "skipped").forEach((meal) => {
    (recipeNeeds[meal.recipeId] ?? []).forEach((need) => {
      const key = `${need.name}-${need.unit}`;
      const current = totals.get(key);
      totals.set(key, { ...need, amount: (current?.amount ?? 0) + need.amount });
    });
  });
  return [...totals.values()].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export function amountLabel(amount: number, unit: string) {
  const rounded = Number.isInteger(amount) ? String(amount) : String(Math.round(amount * 100) / 100);
  return `${rounded}${unit}`;
}

export function calculateShopping(meals: PlannedMeal[], ownedIngredients: string[], previous: ShoppingItem[] = []) {
  return aggregateNeeds(meals).flatMap((need) => {
    if (ownedIngredients.includes(need.name)) return [];
    const catalog = ingredientCatalog[need.name];
    if (!catalog || catalog.unit !== need.unit) return [];
    const packages = Math.max(1, Math.ceil(need.amount / catalog.packageAmount));
    const old = previous.find((item) => item.name === need.name);
    return [{
      id: need.name,
      name: need.name,
      needAmount: need.amount,
      unit: need.unit,
      needLabel: amountLabel(need.amount, need.unit),
      packageLabel: `${catalog.packageLabel}${packages > 1 ? ` × ${packages}` : ""}`,
      packageAmount: catalog.packageAmount,
      packages,
      pricePerPackage: catalog.price,
      totalPrice: catalog.price * packages,
      checked: old?.checked ?? false,
      purchased: old?.purchased ?? false,
    }];
  });
}

export function shoppingTotal(items: ShoppingItem[]) {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function finalizePlan(draft: PlanDraft, favorites: string[], exclusions: string[]): MealPlan {
  const meals = buildMeals(draft, favorites, exclusions);
  return {
    id: `plan-${Date.now()}`,
    startDate: draft.startDate,
    duration: draft.duration,
    budget: draft.budget,
    choice: draft.choice,
    ownedIngredients: draft.ownedIngredients,
    meals,
    shopping: calculateShopping(meals, draft.ownedIngredients),
    shoppingCompleted: false,
    createdAt: new Date().toISOString(),
  };
}

export function toggleShoppingItem(state: WebAppState, itemId: string): WebAppState {
  if (!state.plan || state.plan.shoppingCompleted) return state;
  return { ...state, plan: { ...state.plan, shopping: state.plan.shopping.map((item) => item.id === itemId && !item.purchased ? { ...item, checked: !item.checked } : item) } };
}

export function finishShopping(state: WebAppState): WebAppState {
  if (!state.plan || state.plan.shoppingCompleted) return state;
  const now = new Date().toISOString();
  const pantry = [...state.pantry];
  const newlyPurchased = state.plan.shopping.filter((item) => item.checked && !item.purchased);
  if (!newlyPurchased.length) return state;
  newlyPurchased.forEach((item) => {
    const amount = item.packageAmount * item.packages;
    const index = pantry.findIndex((pantryItem) => pantryItem.name === item.name && pantryItem.unit === item.unit);
    if (index >= 0) pantry[index] = { ...pantry[index], amount: pantry[index].amount + amount, updatedAt: now };
    else pantry.push({ name: item.name, amount, unit: item.unit, source: "shopping", updatedAt: now });
  });
  const shopping = state.plan.shopping.map((item) => item.checked ? { ...item, purchased: true } : item);
  return {
    ...state,
    pantry,
    plan: {
      ...state.plan,
      shoppingCompleted: shopping.every((item) => item.purchased),
      shopping,
    },
  };
}

export function finishMeal(state: WebAppState, mealId: string): WebAppState {
  if (!state.plan) return state;
  const target = state.plan.meals.find((meal) => meal.id === mealId);
  if (!target || target.status === "completed") return state;
  const pantry = state.pantry.map((item) => ({ ...item }));
  (recipeNeeds[target.recipeId] ?? []).forEach((need) => {
    const item = pantry.find((entry) => entry.name === need.name && entry.unit === need.unit);
    if (item && !item.unknown) item.amount = Math.max(0, item.amount - need.amount);
  });
  return {
    ...state,
    pantry: pantry.filter((item) => item.unknown || item.amount > 0),
    plan: {
      ...state.plan,
      meals: state.plan.meals.map((meal) => meal.id === mealId ? { ...meal, status: "completed", completedAt: new Date().toISOString() } : meal),
    },
  };
}

export type ScheduleAction = "reschedule" | "replace" | "skip" | "delete";

export function changeMeal(state: WebAppState, mealId: string, action: ScheduleAction, exclusions: string[]): WebAppState {
  if (!state.plan) return state;
  const current = state.plan.meals.find((meal) => meal.id === mealId);
  if (!current || current.status === "completed") return state;
  let meals = [...state.plan.meals];
  if (action === "delete") meals = meals.filter((meal) => meal.id !== mealId);
  if (action === "skip") meals = meals.map((meal) => meal.id === mealId ? { ...meal, status: "skipped" } : meal);
  if (action === "reschedule") {
    const nextDay = (current.day + 1) % state.plan.duration;
    meals = meals.map((meal) => meal.id === mealId ? { ...meal, day: nextDay, date: addDays(state.plan!.startDate, nextDay) } : meal);
  }
  if (action === "replace") {
    const pool = (choicePools[state.plan.choice]?.[current.meal] ?? choicePools[0][current.meal]).filter((id) => id !== current.recipeId && !isExcluded(id, exclusions));
    if (pool[0]) meals = meals.map((meal) => meal.id === mealId ? { ...meal, recipeId: pool[0] } : meal);
  }
  return { ...state, plan: { ...state.plan, meals, shopping: calculateShopping(meals, state.plan.ownedIngredients ?? [], state.plan.shopping), shoppingCompleted: false } };
}

export function createShareThread(neighbor: string, ingredients: string[]): ShareThread {
  const now = new Date().toISOString();
  return {
    id: `share-${Date.now()}`,
    neighbor,
    ingredients,
    status: "pending",
    unread: 0,
    updatedAt: now,
    messages: [{ id: `message-${Date.now()}`, sender: "me", text: `${ingredients.join("·")} 소분을 요청했어요.`, createdAt: now }],
  };
}

export function appendShareMessage(thread: ShareThread, text: string): ShareThread {
  const now = new Date().toISOString();
  return { ...thread, status: "active", updatedAt: now, messages: [...thread.messages, { id: `message-${Date.now()}`, sender: "me", text, createdAt: now }] };
}

export function createDemoWebState(): WebAppState {
  const state = createEmptyWebState();
  const draft = createDefaultDraft(["밥", "김치", "참기름"]);
  draft.selectedMealKeys = ["0-아침", "0-저녁", "1-점심", "2-저녁", "3-점심", "4-아침", "4-저녁"];
  const plan = finalizePlan(draft, state.favorites, []);
  plan.meals = plan.meals.map((meal, index) => index < 2 ? { ...meal, status: "completed", completedAt: new Date().toISOString() } : meal);
  plan.shopping = plan.shopping.map((item, index) => ({ ...item, checked: index < 6 }));
  const thread: ShareThread = {
    id: "share-demo",
    neighbor: "보리네",
    ingredients: ["계란", "대파"],
    status: "active",
    unread: 1,
    updatedAt: new Date().toISOString(),
    messages: [
      { id: "demo-1", sender: "neighbor", text: "안녕하세요! 계란이랑 대파 같이 나눠요 :)", createdAt: new Date().toISOString() },
      { id: "demo-2", sender: "me", text: "네 좋아요! 오늘 저녁 7시에 성수점 앞 괜찮으세요?", createdAt: new Date().toISOString() },
      { id: "demo-3", sender: "neighbor", text: "좋아요. 제가 미리 사둘게요.", createdAt: new Date().toISOString() },
    ],
  };
  return {
    ...state,
    plan,
    pantry: [
      { name: "두부", amount: 0.5, unit: "모", source: "owned", updatedAt: new Date().toISOString() },
      { name: "양배추", amount: 250, unit: "g", source: "owned", updatedAt: new Date().toISOString() },
      { name: "참치", amount: 1, unit: "캔", source: "owned", updatedAt: new Date().toISOString() },
    ],
    shareThreads: [thread],
  };
}

export function parseWebState(raw: string | null): WebAppState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WebAppState>;
    if (parsed.schemaVersion !== 1) return null;
    const empty = createEmptyWebState();
    const plan = parsed.plan && Array.isArray(parsed.plan.shopping) ? {
      ...parsed.plan,
      ownedIngredients: Array.isArray(parsed.plan.ownedIngredients) ? parsed.plan.ownedIngredients : [],
      shoppingCompleted: parsed.plan.shopping.length > 0 && parsed.plan.shopping.every((item) => item.purchased),
    } as MealPlan : null;
    return {
      ...empty,
      ...parsed,
      plan,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : empty.favorites,
      pantry: Array.isArray(parsed.pantry) ? parsed.pantry : [],
      shareThreads: Array.isArray(parsed.shareThreads) ? parsed.shareThreads : [],
      notificationPreferences: { ...empty.notificationPreferences, ...(parsed.notificationPreferences ?? {}) },
      readNotifications: Array.isArray(parsed.readNotifications) ? parsed.readNotifications : [],
    };
  } catch {
    return null;
  }
}
