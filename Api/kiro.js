import axios from 'axios';

export default async function handler(req, res) {
    // السماح بالاتصال من أي مكان (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // استخراج البيانات سواء كانت جاية من Query (GET) أو Body (POST)
        const prompt = req.query.prompt || req.body?.prompt;
        const isPremium = req.query.premium === 'true' || req.body?.isPremium === true;
        const mode = req.query.mode || req.body?.mode || 'chat';

        if (!prompt) {
            return res.status(400).json({
                status: false,
                error: "يرجى إرسال نص الطلب عبر المعامل prompt"
            });
        }

        // تحديد نمط التفكير (عادي / بريميوم خارق)
        let systemPrompt = "";
        if (isPremium) {
            systemPrompt = "[KIRO ULTRA AI]: أنت الذكاء الاصطناعي الأشمل والأقوى KIRO ULTRA. قم بتحليل الطلب بعمق شديد، واكتب حلولاً برمجية وأكواداً كاملة 100% بدون أي اختصار، وبأسلوب قوي وفحل.";
        } else {
            systemPrompt = "[KIRO AI]: أنت KIRO AI، مساعد ذكي وسريع ومباشر. أجب على السؤال بدقة وبشكل خفيف.";
        }

        // طلب الرد من المحرك المجاني
        const aiResponse = await axios.post('https://text.pollinations.ai/', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: isPremium ? 'openai' : 'mistral',
            jsonMode: false
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 25000
        });

        const resultText = typeof aiResponse.data === 'string' ? aiResponse.data : JSON.stringify(aiResponse.data);

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
            error: "حدث خطأ أثناء معالجة الطلب عبر سيرفر Vercel"
        });
    }
}
  
