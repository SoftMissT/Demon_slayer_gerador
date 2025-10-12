// pages/api/auth/discord/url.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ url?: string; message?: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return res.status(500).json({ message: 'Configuração do Discord incompleta no servidor.' });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'identify', // Apenas para obter informações básicas do usuário
    });

    const authorizationUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

    res.status(200).json({ url: authorizationUrl });
}
