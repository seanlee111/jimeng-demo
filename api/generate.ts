import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Service } from '@volcengine/openapi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const accessKeyId = process.env.VOLC_ACCESS_KEY;
  const secretKey = process.env.VOLC_SECRET_KEY;

  if (!accessKeyId || !secretKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing API keys' });
  }

  try {
    const service = new Service({
      host: 'visual.volcengineapi.com',
      serviceName: 'cv',
      region: 'cn-north-1',
      accessKeyId,
      secretKey,
    });

    console.log('Calling Volcengine API with prompt:', prompt);

    const result = await service.fetchOpenAPI({
      Action: 'CVProcess',
      Version: '2022-08-31',
      method: 'POST',
      data: {
        req_key: 'high_aes_smart_drawing',
        prompt: prompt,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Volcengine API Response:', JSON.stringify(result));

    const responseData = result as any;

    if (responseData.code !== 10000) {
        // Volcengine success code is usually 10000
        // But the SDK might throw or return structure differently.
        // Let's pass the result back for inspection.
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
