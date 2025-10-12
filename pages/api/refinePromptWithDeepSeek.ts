
import type { NextApiRequest, NextApiResponse } from 'next';

interface RefineResponse {
    refinedPrompt?: string;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RefineResponse>
) {
    res.status(403).json({ message: 'Esta funcionalidade foi desativada temporariamente devido a problemas com a API externa. Pedimos desculpa pelo inconveniente.' });
}
