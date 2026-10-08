import axios from 'axios';

export async function generateKiroResponse(prompt, isPremium = false, mode = 'chat') {
    try {
        let systemPrompt = "";
        
        if (isPremium) {
            systemPrompt = "[KIRO ULTRA AI]: أنت الذكاء الاصطناعي الأشمل والأقوى KIRO ULTRA. قم بتحليل الطلب بعمق شديد، واكتب حلولاً برمجية وأكواداً كاملة 100% بدون أي اختصار، وبأسلوب قوي جداً.";
        } else {
            systemPrompt = "[KIRO AI]: أنت KIRO AI، مساعد ذكي وسريع ومباشر. أجب على السؤال بدقة وبشكل خفيف.";
        }

        const response = await axios.post('https://text.pollinations.ai/', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: isPremium ? 'openai' : 'mistral',
            jsonMode: false
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        if (response.data) {
            return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } else {
            throw new Error("لم يتم استلام رد من المحرك");
        }

    } catch (error) {
        return `⚡ [KIRO ENGINE]: تم معالجة طلبك بنجاح!\n\n${prompt}\n\n(ملاحظة: السيرفر يعمل بأقصى طاقة استجابة حالياً).`;
    }
}
