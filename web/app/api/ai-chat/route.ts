import { NextRequest, NextResponse } from "next/server";

const catalog = [
  { id: "chicken", title: "간장 닭다리 덮밥", minutes: 20, tags: ["든든", "점심", "덮밥"], ingredients: ["닭다리살", "양파", "진간장", "밥"] },
  { id: "tofu", title: "두부 김치", minutes: 15, tags: ["한식", "저녁", "두부"], ingredients: ["두부", "김치", "대파", "참기름"] },
  { id: "tuna", title: "참치 마요 주먹밥", minutes: 10, tags: ["간단", "아침", "밥"], ingredients: ["밥", "참치", "마요네즈", "김가루"] },
  { id: "cabbage", title: "양배추 달걀볶음", minutes: 12, tags: ["간단", "가벼운", "저녁"], ingredients: ["양배추", "달걀", "소금", "식용유"] },
  { id: "kimchi", title: "김치 볶음밥", minutes: 15, tags: ["매콤", "한식", "밥"], ingredients: ["밥", "김치", "달걀", "대파"] },
  { id: "cucumber", title: "오이 참치 비빔밥", minutes: 10, tags: ["가벼운", "점심", "간단"], ingredients: ["오이", "참치", "밥", "고추장"] },
];

function fallback(message: string, allowed = catalog) {
  const normalized = message.toLowerCase();
  let ids = ["cabbage", "tuna", "cucumber"];
  if (normalized.includes("매운") || normalized.includes("김치")) ids = ["kimchi", "tofu"];
  else if (normalized.includes("든든") || normalized.includes("고기")) ids = ["chicken", "kimchi"];
  else if (normalized.includes("아침")) ids = ["tuna", "cucumber"];
  const allowedIDs = new Set(allowed.map((item) => item.id));
  const candidates = [...ids, ...allowed.map((item) => item.id)].filter((id, index, list) => allowedIDs.has(id) && list.indexOf(id) === index).slice(0, 3);
  return { reply: candidates.length ? "요청하신 조건과 제외 재료를 반영해 바꿀 수 있는 메뉴를 골랐어요." : "현재 제외 재료 조건으로는 적용할 수 있는 메뉴가 없어요.", candidates, source: "fallback" as const };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message.slice(0, 500) : "";
  if (!message.trim()) return NextResponse.json({ error: "메시지를 입력해 주세요." }, { status: 400 });
  const preferenceObject = body.preferences && typeof body.preferences === "object" ? body.preferences : {};
  const preferenceExclusions = ["dislikes", "allergies"].flatMap((key) => Array.isArray(preferenceObject[key]) ? preferenceObject[key].filter((item: unknown) => typeof item === "string") : []).slice(0, 30) as string[];
  const knownIngredients = [...new Set([...catalog.flatMap((recipe) => recipe.ingredients), "계란"] )];
  const requestExclusions = knownIngredients.filter((ingredient) => [
    `${ingredient} 없이`, `${ingredient} 빼고`, `${ingredient} 제외`, `${ingredient}는 빼`, `${ingredient}은 빼`, `${ingredient}를 빼`, `${ingredient}을 빼`,
  ].some((phrase) => message.includes(phrase)));
  const exclusions = [...new Set([...preferenceExclusions, ...requestExclusions].flatMap((ingredient) => ingredient === "계란" ? ["계란", "달걀"] : ingredient === "달걀" ? ["달걀", "계란"] : [ingredient]))];
  const allowedCatalog = catalog.filter((recipe) => !recipe.ingredients.some((ingredient) => exclusions.some((excluded) => ingredient.includes(excluded) || excluded.includes(ingredient))));
  if (!allowedCatalog.length) return NextResponse.json(fallback(message, allowedCatalog));
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json(fallback(message, allowedCatalog));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        store: false,
        max_output_tokens: 300,
        input: [
          { role: "system", content: `너는 한끼로그 식단 수정 도우미다. 알레르기와 불호 재료가 제거된 허용 카탈로그 ID만 추천한다. 수량·가격·예산을 추측하거나 계산하지 않는다. 허용 카탈로그: ${JSON.stringify(allowedCatalog)}. JSON만 반환: {"reply":"짧은 한국어 설명","candidates":["id"]}` },
          { role: "user", content: JSON.stringify({ request: message, plan: body.plan ?? null, pantry: body.inventory ?? [], recentMessages: Array.isArray(body.history) ? body.history.slice(-8) : [] }).slice(0, 6000) },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "meal_plan_candidates",
            strict: true,
            schema: {
              type: "object",
              properties: {
                reply: { type: "string" },
                candidates: {
                  type: "array",
                  items: { type: "string", enum: allowedCatalog.map((item) => item.id) },
                  maxItems: 3,
                },
              },
              required: ["reply", "candidates"],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`);
    const payload = await response.json();
    const text = payload.output_text ?? payload.output?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? []).map((item: { text?: string }) => item.text ?? "").join("");
    const parsed = JSON.parse(text);
    const valid = Array.isArray(parsed.candidates) ? parsed.candidates.filter((id: string) => allowedCatalog.some((item) => item.id === id)).slice(0, 3) : [];
    return NextResponse.json({ reply: String(parsed.reply || "조건에 맞는 메뉴를 골랐어요."), candidates: valid.length ? valid : fallback(message, allowedCatalog).candidates, source: "openai" });
  } catch {
    return NextResponse.json(fallback(message, allowedCatalog));
  }
}
