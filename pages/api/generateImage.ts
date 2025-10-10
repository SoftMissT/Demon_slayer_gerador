
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    // A funcionalidade de geração de imagem foi desativada.
    res.status(403).json({ message: 'A geração de imagens foi desativada nesta versão do aplicativo.' });
}
