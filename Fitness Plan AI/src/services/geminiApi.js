const API_URL = "http://127.0.0.1:5001/ai-plan";

export async function getAIPlan(payload) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();

    // ✅ IMPORTANT FIX
    return data.plan || "AI plan temporarily unavailable";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI plan temporarily unavailable";
  }
}