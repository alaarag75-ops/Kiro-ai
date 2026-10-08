import express from 'express';
import cors from 'cors';
import { generateKiroResponse } from './kiroEngine.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// الصفحة الرئيسية للسيرفر
app.get('/', (req, res) => {
    res.json({
        status: true,
        server: "KIRO AI Dedicated API Server",
        developer: "Ahmed Alaarag",
        version: "3.0.0-ULTRA",
        endpoints: {
            generate: "/api/kiro?prompt=مرحبا&premium=true&mode=chat"
        }
    });
});

// GET Endpoint لاستخراج الأجوبة
app.get('/api/kiro', async (req, res) => {
    try {
        const prompt = req.query.prompt;
        const isPremium = req.query.premium === 'true' || req.query.premium === '1';
        const mode = req.query.mode || 'chat';

        if (!prompt) {
            return res.status(400).json({
                status: false,
                error: "يرجى كتابة نص الطلب في الـ parameter: ?prompt=..."
            });
        }

        const result = await generateKiroResponse(prompt, isPremium, mode);

        res.json({
            status: true,
            developer: "Ahmed Alaarag",
            engine: isPremium ? "KIRO-ULTRA-THOUGHT-V3" : "KIRO-STANDARD-V1",
            isPremium: isPremium,
            result: result
        });

    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});

// POST Endpoint للطلبات المعقدة
app.post('/api/kiro', async (req, res) => {
    try {
        const { prompt, isPremium, mode } = req.body;

        if (!prompt) {
            return res.status(400).json({ status: false, error: "المحتوى فارغ!" });
        }

        const result = await generateKiroResponse(prompt, isPremium, mode);

        res.json({
            status: true,
            developer: "Ahmed Alaarag",
            engine: isPremium ? "KIRO-ULTRA-THOUGHT-V3" : "KIRO-STANDARD-V1",
            result: result
        });

    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`🚀 KIRO AI Server is Running!`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`⚡ API Endpoint: http://localhost:${PORT}/api/kiro?prompt=مرحبا`);
    console.log(`=================================\n`);
});
          
