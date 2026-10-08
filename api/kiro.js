export default async function handler(req, res) {
    // إعدادات CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // قراءة البيانات من GET أو POST
        const prompt = req.query.prompt || req.body?.prompt;
        const isPremium = req.query.premium === 'true' || req.body?.isPremium === true;

        if (!prompt) {
            return res.status(400).json({
                status: false,
                error: "برجاء إرسال نص الطلب عبر prompt"
            });
        }

        // إعداد الـ Prompt
        let systemPrompt = isPremium 
            ? "[KIRO ULTRA AI]: أنت الذكاء الاصطناعي الخارق KIRO ULTRA. قم بتحليل الطلب بعمق واكتب حلولاً برمجية كاملة 100% بدون اختصار."
            : "[KIRO AI]: أنت KIRO AI، مساعد ذكي وسريع ومباشر. أجب على السؤال بدقة باختصار.";

        // استخدام fetch المدمج في Node.js
        const aiResponse = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                model: isPremium ? 'openai' : 'mistral',
                jsonMode: false
            })
        });

        if (!aiResponse.ok) {
            throw new Error(`Pollinations API responded with status: ${aiResponse.status}`);
        }

        const resultText = await aiResponse.text();

        return res.status(200).json({
            status: true,
            developer: "Ahmed Alaarag",
            engine: isPremium ? "KIRO-ULTRA-THOUGHT-V3" : "KIRO-STANDARD-V1",
            isPremium: isPremium,
            result: resultText
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message || "حدث خطأ داخل دالة السيرفر"
        });
    }
}
