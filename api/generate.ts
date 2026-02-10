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
        console.error('Volcengine API Error Detail:', JSON.stringify(result));
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    // If the error comes from the SDK (e.g. axios error), it might have a response property
    if (error.response) {
       console.error('SDK Error Response:', JSON.stringify(error.response.data));
       return res.status(error.response.status || 500).json(error.response.data);
    }
    res.status(500).json({ error: error.message || 'Internal Server Error', details: error.toString() });
  }
}
