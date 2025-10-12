// pages/api/auth/discord/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForToken, getUserProfile, constructAvatarUrl } from '../../../../lib/discord';
import { isUserWhitelisted } from '../../../../lib/googleSheets';
import type { User } from '../../../../types';

interface ApiResponse {
    message?: string;
    id?: string;
    username?: string;
    avatar?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { code } = req.body;

    if (typeof code !== 'string') {
        return res.status(400).json({ message: 'Código de autorização inválido.' });
    }

    try {
        const tokenResponse = await exchangeCodeForToken(code);
        const userProfile = await getUserProfile(tokenResponse.access_token);
        
        const isWhitelisted = await isUserWhitelisted(userProfile.id);

        if (!isWhitelisted) {
            const message = `Acesso negado. O ID do Discord "${userProfile.id}" não foi encontrado na lista de autorizados. Verifique se este é o ID correto que consta na planilha.`;
            return res.status(403).json({ message });
        }
        
        const user: User = {
            id: userProfile.id,
            username: userProfile.global_name || userProfile.username,
            avatar: constructAvatarUrl(userProfile.id, userProfile.avatar),
        };

        res.status(200).json(user);

    } catch (error: any) {
        console.error('[DISCORD_CALLBACK_ERROR]', error);
        // If the error comes from googleSheets, it will be more specific now.
        res.status(500).json({ message: error.message || 'Ocorreu um erro interno durante a autenticação.' });
    }
}