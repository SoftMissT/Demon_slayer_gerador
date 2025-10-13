import type { Tematica } from '../types';

interface OriginData {
    nome: string;
    descricao: string;
    tracos_tipicos: string;
    ganchos_narrativos: string;
    tematicas: Tematica[];
}

export const ORIGINS_DATA: OriginData[] = [
  {
    "nome": "Tsuguko (Discípulo de Hashira)",
    "descricao": "Treinado sob o olhar de um Pilar, o Tsuguko é o herdeiro espiritual de uma Respiração lendária. Carrega o peso de continuar um legado e a pressão de estar à altura de seu mestre.",
    "tracos_tipicos": "disciplina rígida, instinto tático, lealdade inabalável.",
    "ganchos_narrativos": "rivalidade com outros discípulos, busca por suceder o Hashira, dilema entre seguir o próprio caminho ou o do mestre.",
    "tematicas": ["Período Edo (Japão Feudal)"]
  },
  {
    "nome": "Samurai",
    "descricao": "Descendente da antiga casta guerreira, o Samurai vive segundo o bushidō mesmo num mundo onde a honra se tornou relíquia. A lâmina é sua alma, e a morte em combate, sua oração.",
    "tracos_tipicos": "coragem fria, respeito pelas tradições, austeridade.",
    "ganchos_narrativos": "juramento quebrado, senhor caído, busca por redenção ou vingança.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia", "Shogunato Cibernético", "🎭 DOS CINCO REINOS (WUXIA/XIANXIA)"]
  },
  {
    "nome": "Ninja",
    "descricao": "Sombra e silêncio. O Ninja é o fantasma entre o bambuzal, mestre da infiltração, da emboscada e da informação. Serve quem paga… ou quem merece.",
    "tracos_tipicos": "agilidade, inteligência prática, instinto de sobrevivência.",
    "ganchos_narrativos": "traição dentro do clã, missão secreta, passado apagado.",
    "tematicas": ["Período Edo (Japão Feudal)", "Cyberpunk", "Shogunato Cibernético", "Neon-Noir Megacidade", "🌃 DO SUBMUNDO NOTURNO"]
  },
  {
    "nome": "Isolado da Natureza",
    "descricao": "Vivendo afastado da civilização, o Isolado aprendeu com a natureza o que o homem esqueceu. O vento é seu mestre, a montanha, seu templo.",
    "tracos_tipicos": "intuição afiada, resiliência, desapego.",
    "ganchos_narrativos": "retorna ao mundo após anos, guarda um segredo antigo, é o último de sua vila extinta.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia", "Pós-apocalíptico", "Mythpunk Amazônico", "Ártico Steampunk", "🧙 DA ALVORADA ANCESTRAL", "🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)"]
  },
  {
    "nome": "Aristocrata Urbano",
    "descricao": "Criado entre cidades, nobres e mercados, o Aristocrata conhece a lógica do convívio e da política. Sabe falar, negociar e enganar com a mesma destreza com que outros empunham espadas.",
    "tracos_tipicos": "sociabilidade, senso estético, pragmatismo.",
    "ganchos_narrativos": "envolvimento com guildas ou aristocratas, dívida de sangue, segredo de família.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia", "Steampunk", "Cyberpunk", "Tempos Atuais", "Futurista (Sci-Fi)", "Neon-Noir Megacidade", "💠 DA INFOCRACIA", "🌃 DO RENASCIMENTO SOMBRIO"]
  },
  {
    "nome": "Descendente de Linhagem Esquecida",
    "descricao": "Carrega um sangue antigo, esquecido pelos registros, talvez um clã caído, um demônio selado ou uma linhagem amaldiçoada. O passado o chama, mesmo que ele não saiba de onde.",
    "tracos_tipicos": "sonhos recorrentes, poder adormecido, destino trágico.",
    "ganchos_narrativos": "busca pela própria origem, memórias fragmentadas, despertar de um poder perigoso.",
    "tematicas": ["Medieval Fantasia", "DOS CAÇADORES DE SOMBRAS", "⚔️ DOS DEUSES CAÍDOS", "🕵️‍♂️ DO JAZZ & OCULTISMO", "⚗️ DA REVOLUÇÃO INDUSTRIAL OCULTA"]
  },
  {
    "nome": "Viajante Exótico",
    "descricao": "Veio de terras distantes, além dos mares ou desertos. Sua cultura, língua e costumes contrastam com os do Japão, tornando-o tanto admirado quanto suspeito.",
    "tracos_tipicos": "curiosidade, sotaque marcante, adaptabilidade.",
    "ganchos_narrativos": "busca de um artefato ancestral, exílio forçado, promessa feita a um morto.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia", "Steampunk", "Cyberpunk", "Pós-apocalíptico", "Futurista (Sci-Fi)", "Biopunk", "🤠 VELHO OESTE SOLAR", "🏴‍☠️ DOS IMPÉRIOS FLUTUANTES", "🏜️ DO SAARA ETERNO"]
  },
  {
    "nome": "Monge",
    "descricao": "Devoto da fé, da meditação ou da iluminação. O Monge vê os demônios como manifestações do sofrimento humano. Treinou corpo e espírito até o limite da compreensão.",
    "tracos_tipicos": "serenidade, força interior, empatia.",
    "ganchos_narrativos": "conflito entre fé e violência, visões proféticas, missão sagrada.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia", "🎭 DOS CINCO REINOS (WUXIA/XIANXIA)"]
  },
  {
    "nome": "Pupilo de Lenda Aposentada",
    "descricao": "Você cresceu sob a tutela de uma lenda aposentada, um guerreiro que já viu o inferno e escolheu viver à sombra. Herdou suas histórias, sua técnica… e talvez seus arrependimentos.",
    "tracos_tipicos": "espírito determinado, lealdade emocional, trauma herdado.",
    "ganchos_narrativos": "legado quebrado, segredos do passado do mentor, reencontro com o velho Hashira.",
    "tematicas": ["Período Edo (Japão Feudal)", "Medieval Fantasia"]
  },
  {
    "nome": "Sobrevivente do Ermo",
    "descricao": "Forjado nas ruínas de um mundo quebrado, o Sobrevivente não apenas resistiu, mas prosperou no caos. Aprendeu a transformar sucata em ferramentas e perigo em oportunidade, vendo o fim do mundo não como uma tragédia, mas como um recomeço brutal.",
    "tracos_tipicos": "resiliência extrema, pragmatismo implacável, improvisação genial.",
    "ganchos_narrativos": "proteger um artefato raro da velha era, liderar uma comunidade de refugiados contra um grupo hostil, carregar a culpa ou o segredo do evento que causou o apocalipse.",
    "tematicas": ["Pós-apocalíptico", "🌌 DOS CINZÁRIOS (PÓS-APOCALÍPTICO MÍSTICO)", "🧟 DA QUEDA DOS REINOS"]
  },
  {
    "nome": "Engenheiro de Autômatos",
    "descricao": "Mestre das engrenagens e do vapor, este indivíduo cria vida a partir de metal e lógica. Seus companheiros são autômatos, e sua oficina é seu santuário.",
    "tracos_tipicos": "mente analítica, paciência, afinidade com máquinas.",
    "ganchos_narrativos": "sua maior criação se rebelou, busca por uma fonte de energia lendária, perseguição por uma corporação que cobiça sua tecnologia.",
    "tematicas": ["Steampunk", "Shogunato Cibernético", "🤖 DA SINGULARIDADE (PÓS-HUMANA)"]
  },
  {
    "nome": "Bio-Hacker",
    "descricao": "Para este indivíduo, o corpo é apenas uma tela a ser pintada com o pincel da genética. Vive nas margens da sociedade, realizando modificações corporais ilegais e experimentando com a própria biologia.",
    "tracos_tipicos": "curiosidade mórbida, desrespeito por limites éticos, busca pela perfeição biológica.",
    "ganchos_narrativos": "uma modificação deu terrivelmente errado, busca por um código genético primordial, é caçado por um crime contra a natureza.",
    "tematicas": ["Biopunk", "Cyberpunk", "🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)"]
  },
  {
    "nome": "Netrunner",
    "descricao": "Um fantasma na máquina, o Netrunner navega pelas redes de dados como um explorador em um novo continente. Informação é sua moeda, e firewalls, seus únicos inimigos.",
    "tracos_tipicos": "inteligência afiada, isolamento social, vício em adrenalina digital.",
    "ganchos_narrativos": "encontrou um segredo corporativo que pode derrubar governos, é assombrado por uma IA renegada, precisa invadir o servidor mais protegido do mundo.",
    "tematicas": ["Cyberpunk", "Futurista (Sci-Fi)", "Neon-Noir Megacidade", "💠 DA INFOCRACIA", "🤖 DA SINGULARIDADE (PÓS-HUMANA)"]
  },
  {
    "nome": "Nômade do Deserto Eterno",
    "descricao": "Nascido sob um sol implacável, este indivíduo conhece os segredos da areia e do vento. Sua cultura valoriza a resiliência, a comunidade e a sabedoria ancestral para sobreviver onde nada mais sobrevive.",
    "tracos_tipicos": "resistência ao calor, navegação estelar, desconfiança de forasteiros.",
    "ganchos_narrativos": "proteger o último oásis, guiar uma caravana por território demoníaco, buscar uma relíquia perdida em uma cidade de areia.",
    "tematicas": ["🏜️ DO SAARA ETERNO", "Pós-apocalíptico", "Medieval Fantasia"]
  },
  {
    "nome": "Corsário dos Impérios Flutuantes",
    "descricao": "A vida nos céus é a única que conheceu. Criado a bordo de um navio aéreo, este personagem é um mestre da navegação, do combate em conveses instáveis e do comércio... ou da pilhagem.",
    "tracos_tipicos": "agilidade acrobática, carisma ousado, lealdade à tripulação.",
    "ganchos_narrativos": "caçar um navio fantasma, participar de uma corrida de dirigíveis lendária, motim a bordo.",
    "tematicas": ["🏴‍☠️ DOS IMPÉRIOS FLUTUANTES", "Steampunk", "Futurista (Sci-Fi)"]
  },
  {
    "nome": "Guardião das Selvas de Mythpunk",
    "descricao": "Vindo de uma civilização escondida na vastidão da selva amazônica, este guardião combina tecnologia antiga com a sabedoria da natureza. Seu corpo e armas são simbióticos com a flora e fauna locais.",
    "tracos_tipicos": "comunicação com a natureza, furtividade, conhecimento de venenos e curas.",
    "ganchos_narrativos": "defender a árvore-mãe de uma corporação invasora, buscar a cura para uma praga mística, guiar exploradores perdidos.",
    "tematicas": ["Mythpunk Amazônico", "Biopunk", "🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)"]
  },
  {
    "nome": "Herdeiro de um Deus Caído",
    "descricao": "O sangue de uma divindade morta corre em suas veias. Este poder latente é tanto uma bênção quanto uma maldição, atraindo seguidores e caçadores em igual medida.",
    "tracos_tipicos": "poder latente, conflito interno, senso de destino.",
    "ganchos_narrativos": "reunir os artefatos de seu ancestral divino, ser caçado por um culto que deseja seu poder, decidir se aceita ou rejeita seu legado.",
    "tematicas": ["⚔️ DOS DEUSES CAÍDOS", "Medieval Fantasia", "🌌 DOS CINZÁRIOS (PÓS-APOCALÍPTICO MÍSTICO)"]
  },
  {
    "nome": "Detetive do Oculto",
    "descricao": "Em uma cidade de jazz e sombras, onde o sobrenatural é apenas mais um segredo sujo, este detetive resolve casos que a polícia não ousa tocar. Viu coisas que não deveriam existir e vive para expô-las à luz... ou enterrá-las mais fundo.",
    "tracos_tipicos": "percepção aguçada, ceticismo endurecido, nervos de aço.",
    "ganchos_narrativos": "investigar um assassinato ritualístico, ser contratado por uma femme fatale vampira, impedir que um artefato amaldiçoado caia nas mãos erradas.",
    "tematicas": ["🕵️‍♂️ DO JAZZ & OCULTISMO", "Moderno", "DOS CAÇADORES DE SOMBRAS", "🌃 DO SUBMUNDO NOTURNO"]
  }
];