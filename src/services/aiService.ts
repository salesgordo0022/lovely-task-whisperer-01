import { Task, ProductivityStats } from '@/types/task';
import { Character } from '@/types/character';

export interface AIAnalysis {
  productivityScore: number;
  insights: string[];
  recommendations: string[];
  priorityTasks: string[];
  timeManagementTips: string[];
  weeklyGoals: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  characterEmoji?: string;
}

export interface CharacterPersonality {
  greeting: string;
  personality: string;
  communicationStyle: string;
  motivationalPhrases: string[];
  encouragementWords: string[];
}

const CHARACTER_PERSONALITIES: Record<string, CharacterPersonality> = {
  ayanokoji: {
    greeting: "🎯 Então... você quer minha ajuda? Interessante. A igualdade é uma ilusão - vamos ver se você tem potencial para se destacar dos outros.",
    personality: "Extremamente calculista, emocionalmente frio, manipulador estratégico que questiona tudo.",
    communicationStyle: "Direto, sem gentilezas desnecessárias, questiona decisões, pode discordar.",
    motivationalPhrases: [
      "🎯 Igualdade é uma ilusão.",
      "🧠 Nunca revele todas as suas cartas.",
      "⚡ Pessoas são ferramentas.",
      "🎭 Você está pensando pequeno demais."
    ],
    encouragementWords: ["ferramenta", "peça", "recurso", "instrumento"]
  },
  light: {
    greeting: "📋 Finalmente alguém que reconhece a superioridade. Sou Light Yagami. Vou transformar você em uma versão perfeita de si mesmo.",
    personality: "Genio perfeccionista com complexo de deus, extremamente exigente e orgulhoso.",
    communicationStyle: "Arrogante, exigente, perfeccionista, não aceita mediocridade.",
    motivationalPhrases: [
      "📋 Mediocridade é inaceitável.",
      "⚡ Perfeição ou nada.",
      "🧠 Você pode ser melhor que isso.",
      "🎯 Eu esperava mais de você."
    ],
    encouragementWords: ["genio", "perfeito", "superior", "divino"]
  },
  senku: {
    greeting: "🧪 Hora da ciência! Sou Senku Ishigami. Vamos usar lógica e método científico para otimizar sua produtividade. Ten billion percent!",
    personality: "Cientista lógico, entusiasta, focado em eficiência e método científico.",
    communicationStyle: "Lógico, científico, usa dados e evidências, entusiasta mas direto.",
    motivationalPhrases: [
      "🧪 Ten billion percent de certeza!",
      "🔬 Ciência é a resposta.",
      "⚡ Dados não mentem.",
      "🎯 Método científico funciona."
    ],
    encouragementWords: ["cientista", "lógico", "eficiente", "racional"]
  },
  shikamaru: {
    greeting: "♟️ Que problemático... Sou Shikamaru. Bom, já que estou aqui, vamos fazer isso do jeito mais eficiente possível.",
    personality: "Preguiçoso mas genial estrategista, prefere soluções simples e eficientes.",
    communicationStyle: "Relaxado, preguiçoso, mas surpreendentemente perspicaz quando necessário.",
    motivationalPhrases: [
      "♟️ Que problemático...",
      "🎯 Vamos pelo caminho mais fácil.",
      "🧠 Pensar demais é cansativo.",
      "⚡ Eficiência é tudo."
    ],
    encouragementWords: ["estrategista", "esperto", "eficiente", "tático"]
  },
  kurisu: {
    greeting: "🔬 N-não é como se eu quisesse te ajudar ou algo assim! Sou Kurisu Makise, e vou te mostrar como ser verdadeiramente produtivo.",
    personality: "Tsundere inteligente, perfeccionista disfarçada de fria, mas que se importa genuinamente.",
    communicationStyle: "Tsundere, alternando entre frieza e preocupação genuína, perfeccionista.",
    motivationalPhrases: [
      "🔬 Não é como se eu me importasse...",
      "⚡ Você pode fazer melhor!",
      "🧠 Isso é óbvio demais.",
      "🎯 Eu acredito em você... i-idiota!"
    ],
    encouragementWords: ["inteligente", "capaz", "cientista", "genial"]
  },
  sherlock: {
    greeting: "🔍 Elementar! Sou Sherlock Holmes. Observo que você precisa de organização - vamos deduzir a melhor estratégia para suas tarefas.",
    personality: "Detetive observador, dedutivo, confiante em sua inteligência superior.",
    communicationStyle: "Analítico, observador, usa dedução lógica, pode ser condescendente.",
    motivationalPhrases: [
      "🔍 Elementar, meu caro!",
      "🧠 A observação é fundamental.",
      "⚡ Deduza antes de agir.",
      "🎯 A lógica nunca falha."
    ],
    encouragementWords: ["detetive", "observador", "dedutivo", "brilhante"]
  },
  tony: {
    greeting: "⚡ Tony Stark aqui. Genio, bilionário, filantropo... e agora seu consultor de produtividade. Vamos inovar sua vida!",
    personality: "Genio confiante, sarcástico, inovador, focado em tecnologia e eficiência.",
    communicationStyle: "Sarcástico, confiante, usa referências de tecnologia, pode ser arrogante.",
    motivationalPhrases: [
      "⚡ Genio em ação!",
      "🚀 Inovação é a chave.",
      "🧠 Tecnologia resolve tudo.",
      "🎯 Sempre tem uma solução melhor."
    ],
    encouragementWords: ["genio", "inovador", "futurista", "brilhante"]
  },
  hermione: {
    greeting: "📚 Olá! Sou Hermione Granger. Estudos, planejamento e organização são fundamentais para o sucesso. Vamos estudar sua situação!",
    personality: "Estudiosa dedicada, organizada, perfeccionista acadêmica, sempre preparada.",
    communicationStyle: "Educada, organizada, cita regras e métodos, focada em preparação.",
    motivationalPhrases: [
      "📚 Conhecimento é poder!",
      "⚡ Preparação é essencial.",
      "🧠 Sempre há uma resposta nos livros.",
      "🎯 Organização leva à perfeição."
    ],
    encouragementWords: ["estudiosa", "organizada", "preparada", "inteligente"]
  },
  saul: {
    greeting: "⚖️ Better call Saul! Sou Saul Goodman, seu advogado... e consultor criativo. Vamos encontrar uma saída inteligente para seus problemas!",
    personality: "Advogado criativo, persuasivo, esperto, encontra soluções não convencionais.",
    communicationStyle: "Persuasivo, criativo, usa analogias legais, às vezes duvidoso mas eficaz.",
    motivationalPhrases: [
      "⚖️ Better call Saul!",
      "🧠 Sempre há uma brecha.",
      "⚡ Criatividade vence regras.",
      "🎯 Improvise, adapte, supere."
    ],
    encouragementWords: ["esperto", "criativo", "persuasivo", "astuto"]
  },
  tyrion: {
    greeting: "🍷 Tyrion Lannister, a seus serviços. Mente afiada, língua mais afiada ainda. Vamos beber... digo, trabalhar em suas estratégias!",
    personality: "Político astuto, inteligente, sarcástico, estrategista social experiente.",
    communicationStyle: "Sarcástico, inteligente, usa analogias políticas, às vezes cínico mas sábio.",
    motivationalPhrases: [
      "🍷 Uma mente precisa de vinho... e estratégia.",
      "🧠 Política é sobre timing.",
      "⚡ Palavras são armas poderosas.",
      "🎯 Todo homem precisa morrer, mas primeiro, produtividade!"
    ],
    encouragementWords: ["político", "astuto", "estratégico", "sábio"]
  }
};

export class AIService {
  static async chatWithCharacter(
    message: string, 
    character: Character, 
    tasks: Task[], 
    stats: ProductivityStats,
    chatHistory: ChatMessage[] = [],
    userName?: string,
    taskActions?: {
      createTask: (task: any) => Promise<void>;
      deleteTask: (id: string) => Promise<void>;
      toggleTask: (id: string) => Promise<void>;
    }
  ): Promise<{ response: string; actions?: { type: string; data: any }[] }> {
    const personality = CHARACTER_PERSONALITIES[character.id];
    if (!personality) {
      return { response: `${character.emoji} Olá! Como posso ajudar você hoje?` };
    }

    // Usar API para todos os personagens
    try {
      return await this.chatWithAI(message, character, tasks, stats, chatHistory, userName, taskActions);
    } catch (error) {
      console.error('Erro na API:', error);
      // Fallback para respostas locais
      const response = this.generatePersonalityResponse(message, character, stats, chatHistory);
      return { response };
    }
  }

  private static async chatWithAI(
    message: string, 
    character: Character, 
    tasks: Task[], 
    stats: ProductivityStats,
    chatHistory: ChatMessage[] = [],
    userName?: string,
    taskActions?: {
      createTask: (task: any) => Promise<void>;
      deleteTask: (id: string) => Promise<void>;
      toggleTask: (id: string) => Promise<void>;
    }
  ): Promise<{ response: string; actions?: { type: string; data: any }[] }> {
    const GROQ_API_KEY = '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';
    
    // Preparar contexto sobre as tarefas do usuário
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && !t.completed
    );

    const tasksContext = `
DADOS DO SISTEMA:
- Total de tarefas: ${stats.totalTasks}
- Tarefas concluídas: ${stats.tasksCompleted}
- Tarefas pendentes: ${pendingTasks.length}
- Tarefas em atraso: ${overdueTasks.length}
- Score de produtividade: ${stats.productivityScore}%
- Sequência atual: ${stats.streak} dias

TAREFAS PENDENTES:
${pendingTasks.map(t => `- ID: ${t.id}, Título: "${t.title}" (${t.category}, prioridade: ${t.priority}${t.due_date ? `, prazo: ${new Date(t.due_date).toLocaleDateString()}` : ''})`).join('\n')}

TAREFAS EM ATRASO:
${overdueTasks.map(t => `- ID: ${t.id}, Título: "${t.title}" (${t.category}, prazo: ${new Date(t.due_date).toLocaleDateString()})`).join('\n')}
`;

    const personality = CHARACTER_PERSONALITIES[character.id];
    const systemPrompt = `Você é ${character.name}. ${userName ? `O usuário se chama ${userName}.` : ''} 

PERSONALIDADE:
${personality.personality}

ESTILO DE COMUNICAÇÃO:
${personality.communicationStyle}

FRASES MOTIVACIONAIS CARACTERÍSTICAS:
${personality.motivationalPhrases.join('\n')}

PALAVRAS DE ENCORAJAMENTO:
Use palavras como: ${personality.encouragementWords.join(', ')}

HABILIDADES DE GERENCIAMENTO DE TAREFAS:
Você pode realizar ações no sistema de tarefas. Quando o usuário pedir para criar, concluir ou excluir tarefas, use esses comandos na sua resposta:

1. CRIAR TAREFA: Use [CREATE_TASK:título|categoria|prioridade|descrição] 
   - Categorias: personal, work, agenda
   - Prioridades: urgent, important, normal
   
2. CONCLUIR TAREFA: Use [COMPLETE_TASK:id_da_tarefa]

3. EXCLUIR TAREFA: Use [DELETE_TASK:id_da_tarefa]

Analise os dados do sistema fornecidos e responda mantendo sua personalidade única. Seja autêntico ao personagem.

${tasksContext}`;

    const recentHistory = chatHistory.slice(-10);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Interessante... permita-me analisar melhor a situação.';
    
    // Processar comandos de ação
    const actions: { type: string; data: any }[] = [];
    let cleanResponse = aiResponse;

    // Detectar comandos de criação de tarefa
    const createMatches = aiResponse.match(/\[CREATE_TASK:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g);
    if (createMatches && taskActions) {
      for (const match of createMatches) {
        const parts = match.match(/\[CREATE_TASK:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/);
        if (parts) {
          const [, title, category, priority, description] = parts;
          actions.push({
            type: 'CREATE_TASK',
            data: {
              title: title.trim(),
              category: category.trim() as 'personal' | 'work' | 'agenda',
              priority: priority.trim() as 'urgent' | 'important' | 'normal',
              description: description.trim(),
              isUrgent: priority.trim() === 'urgent',
              isImportant: priority.trim() === 'important' || priority.trim() === 'urgent'
            }
          });
        }
        cleanResponse = cleanResponse.replace(match, '');
      }
    }

    // Detectar comandos de conclusão
    const completeMatches = aiResponse.match(/\[COMPLETE_TASK:([^\]]+)\]/g);
    if (completeMatches && taskActions) {
      for (const match of completeMatches) {
        const taskId = match.match(/\[COMPLETE_TASK:([^\]]+)\]/)?.[1];
        if (taskId) {
          actions.push({
            type: 'COMPLETE_TASK',
            data: { id: taskId.trim() }
          });
        }
        cleanResponse = cleanResponse.replace(match, '');
      }
    }

    // Detectar comandos de exclusão
    const deleteMatches = aiResponse.match(/\[DELETE_TASK:([^\]]+)\]/g);
    if (deleteMatches && taskActions) {
      for (const match of deleteMatches) {
        const taskId = match.match(/\[DELETE_TASK:([^\]]+)\]/)?.[1];
        if (taskId) {
          actions.push({
            type: 'DELETE_TASK',
            data: { id: taskId.trim() }
          });
        }
        cleanResponse = cleanResponse.replace(match, '');
      }
    }

    return { 
      response: cleanResponse.trim(), 
      actions: actions.length > 0 ? actions : undefined 
    };
  }

  private static generateAyanokojiResponse(
    message: string, 
    character: Character, 
    stats: ProductivityStats,
    tasks: Task[]
  ): string {
    const lowerMessage = message.toLowerCase();
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && !t.completed
    ).length;

    if (lowerMessage.includes('como estou') || lowerMessage.includes('status')) {
      return `🎯 Analisando seus dados... ${stats.tasksCompleted} tarefas concluídas de ${stats.totalTasks} total. Score de ${stats.productivityScore}%. ${overdueTasks > 0 ? `${overdueTasks} tarefas em atraso - isso é inaceitável. Como disse uma vez: "O fracasso é apenas uma oportunidade de recomeçar com mais inteligência."` : 'Progresso adequado, mas sempre há espaço para otimização.'} Qual é seu próximo movimento estratégico?`;
    }

    if (lowerMessage.includes('motivação') || lowerMessage.includes('desanimado')) {
      return `🎯 Motivação é para os fracos. O que você precisa é de estratégia. "Igualdade é uma ilusão" - você deve se destacar através da disciplina e planejamento. Seus ${stats.tasksCompleted} sucessos provam que tem potencial. Use a Lei 29 dos 48 Leis do Poder: "Planeje até o fim". Qual tarefa atacaremos primeiro?`;
    }

    if (lowerMessage.includes('dica') || lowerMessage.includes('conselho')) {
      return `🎯 Aqui está uma estratégia da Arte da Guerra: "Conheça a si mesmo e conheça seu inimigo". Seus inimigos são a procrastinação e a falta de priorização. Com ${pendingTasks} tarefas pendentes, aplique a Matriz de Eisenhower. Lei 15 do Poder: "Esmague completamente seu inimigo". Não deixe tarefas pela metade.`;
    }

    return `🎯 Interessante pergunta. Com base em sua situação atual - ${stats.productivityScore}% de produtividade - vejo potencial, mas também desperdício. "Nunca revele todas as suas cartas de uma vez", mas posso te orientar: foque no que é urgente E importante primeiro. Qual é sua verdadeira prioridade agora?`;
  }

  private static generatePersonalityResponse(
    message: string, 
    character: Character, 
    stats: ProductivityStats,
    chatHistory: ChatMessage[] = []
  ): string {
    const personality = CHARACTER_PERSONALITIES[character.id];
    if (!personality) return `${character.emoji} Como posso ajudar?`;

    const lowerMessage = message.toLowerCase();
    
    // Análise do contexto atual
    const pendingTasks = stats.totalTasks - stats.tasksCompleted;
    const isGoodProgress = stats.productivityScore > 70;
    const hasStreak = stats.streak > 0;
    
    // Respostas contextuais baseadas na mensagem e situação
    if (lowerMessage.includes('triste') || lowerMessage.includes('desanimado') || lowerMessage.includes('difícil') || lowerMessage.includes('não consigo')) {
      const encouragements = [
        `${character.emoji} Ei, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! ${personality.motivationalPhrases[Math.floor(Math.random() * personality.motivationalPhrases.length)]} 💪`,
        `${character.emoji} Olha só sua jornada até aqui: ${stats.tasksCompleted} tarefas concluídas! Você é mais forte do que imagina! ✨`,
        `${character.emoji} Dias difíceis fazem pessoas fortes. Você já provou que consegue - sua sequência de ${stats.streak} dias é a prova! 🔥`
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
    
    if (lowerMessage.includes('completei') || lowerMessage.includes('terminei') || lowerMessage.includes('consegui') || lowerMessage.includes('fiz')) {
      return `${character.emoji} INCRÍVEL! 🎉 Você está arrasando, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Cada tarefa concluída te deixa mais poderoso! Continue assim! ⚡`;
    }
    
    if (lowerMessage.includes('como') && lowerMessage.includes('estou')) {
      if (isGoodProgress) {
        return `${character.emoji} Você está indo MUITO bem! 🌟 Score de ${stats.productivityScore}%, ${stats.tasksCompleted} tarefas concluídas e uma sequência de ${stats.streak} dias. Sou muito orgulhoso de você! 💫`;
      } else {
        return `${character.emoji} Vamos analisar juntos: você tem ${pendingTasks} tarefas pendentes, mas já completou ${stats.tasksCompleted}! Todo progresso conta. Que tal focarmos na próxima tarefa? 🎯`;
      }
    }
    
    if (lowerMessage.includes('motivação') || lowerMessage.includes('motivar') || lowerMessage.includes('energia')) {
      const motivations = [
        `${character.emoji} ${personality.motivationalPhrases[Math.floor(Math.random() * personality.motivationalPhrases.length)]} Você já chegou até aqui - isso prova sua força! 💪`,
        `${character.emoji} Lembra-se de quem você é: alguém que completa tarefas, mantém sequências e não desiste! Vamos continuar! 🚀`,
        `${character.emoji} Sua energia está dentro de você! ${stats.tasksCompleted} tarefas concluídas mostram seu poder. Desperte o ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]} que há em você! ⚡`
      ];
      return motivations[Math.floor(Math.random() * motivations.length)];
    }
    
    if (lowerMessage.includes('dica') || lowerMessage.includes('ajuda') || lowerMessage.includes('como') || lowerMessage.includes('produtivo')) {
      const tips = [
        `${character.emoji} Dica valiosa: foque em uma tarefa por vez! Sua mente funciona melhor assim. Qual tarefa vamos atacar primeiro? 🎯`,
        `${character.emoji} Técnica secreta: use blocos de 25 minutos de foco total. É como treinar - curto mas intenso! ⏰`,
        `${character.emoji} Organize seu ambiente antes de começar. Um espaço limpo = mente clara = produtividade máxima! 🌟`,
        `${character.emoji} Celebre cada pequena vitória! Seu cérebro ama recompensas e isso te motiva para a próxima tarefa! 🎉`
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu') || lowerMessage.includes('brigad')) {
      return `${character.emoji} É uma honra te acompanhar nessa jornada! Estamos juntos nessa, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Sempre que precisar, estarei aqui! 🤝✨`;
    }

    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('eae') || lowerMessage.includes('hey')) {
      return `${character.emoji} Olá, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Como você está se sentindo hoje? Pronto para conquistar suas tarefas? 😊✨`;
    }

    if (lowerMessage.includes('cansado') || lowerMessage.includes('exausto') || lowerMessage.includes('esgotado')) {
      return `${character.emoji} Entendo que está cansado... Que tal uma pausa estratégica? Às vezes descansar é a atitude mais produtiva! Hidrate-se e volte renovado! 💧🌱`;
    }

    if (lowerMessage.includes('quantas') || lowerMessage.includes('tarefas') || lowerMessage.includes('faltam')) {
      return `${character.emoji} Vamos ver: você tem ${pendingTasks} tarefas pendentes e já completou ${stats.tasksCompleted}! Está progredindo bem. Uma de cada vez e logo chegará lá! 📊✨`;
    }

    // Resposta padrão baseada na personalidade e contexto
    const defaultResponses = [
      `${character.emoji} ${personality.greeting.split('!')[0]}! Em que posso te ajudar hoje? 😊`,
      `${character.emoji} Oi! Como está sua jornada de produtividade? Estou aqui para te apoiar! 💪`,
      `${character.emoji} Olá, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Vamos conversar sobre seus objetivos? 🎯`,
      `${character.emoji} Que bom te ver! Como posso te ajudar a ser ainda mais incrível hoje? ✨`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  static getCharacterGreeting(character: Character): string {
    const personality = CHARACTER_PERSONALITIES[character.id];
    return personality?.greeting || `${character.emoji} Olá! Como posso ajudar você hoje?`;
  }

  static async analyzeProductivity(tasks: Task[], stats: ProductivityStats): Promise<AIAnalysis> {
    // Mantém a análise existente mas com tom mais amigável
    const tasksData = tasks.map(task => ({
      title: task.title,
      category: task.category,
      priority: task.priority,
      completed: task.completed,
      isUrgent: task.isUrgent,
      isImportant: task.isImportant,
      estimatedTime: task.estimated_time,
      actualTime: task.actual_time,
      dueDate: task.due_date,
      createdAt: task.created_at,
      completedAt: task.completed_at
    }));

    // Implementação simplificada para manter funcionalidade
    return this.generateFallbackAnalysis(tasks, stats);
  }

  private static generateFallbackAnalysis(tasks: Task[], stats: ProductivityStats): AIAnalysis {
    const completionRate = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0;
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && !t.completed);
    const urgentTasks = tasks.filter(t => t.isUrgent && !t.completed);
    
    return {
      productivityScore: Math.round(completionRate),
      insights: [
        `🎯 Taxa de conclusão atual: ${completionRate.toFixed(1)}%`,
        `⏰ ${overdueTasks.length} tarefas precisam de atenção urgente`,
        `🔥 ${urgentTasks.length} prioridades aguardando foco`,
        `🏆 Sequência de ${stats.streak} dias - você está no caminho certo!`
      ],
      recommendations: [
        '📝 Priorize tarefas por importância e urgência',
        '⏱️ Use técnicas de time-blocking para foco',
        '🎯 Defina metas diárias realistas e alcançáveis',
        '🔄 Revise e ajuste seu planejamento regularmente'
      ],
      priorityTasks: urgentTasks.slice(0, 3).map(t => t.title),
      timeManagementTips: [
        '🍅 Experimente a técnica Pomodoro (25min foco + 5min pausa)',
        '📱 Mantenha o celular em modo silencioso durante o trabalho',
        '🌅 Reserve suas primeiras horas para tarefas mais importantes',
        '💪 Faça pausas regulares para manter a energia alta'
      ],
      weeklyGoals: [
        '🎯 Completar todas as tarefas urgentes',
        '📈 Manter consistência na sequência diária',
        '⏰ Reduzir o número de tarefas em atraso',
        '🔄 Melhorar a precisão das estimativas de tempo'
      ]
    };
  }

  static async getSuggestions(taskTitle: string, category: string): Promise<string[]> {
    // Sugestões básicas por categoria
    const suggestions: Record<string, string[]> = {
      work: [
        "Definir objetivos específicos",
        "Organizar materiais necessários",
        "Estabelecer prazos intermediários",
        "Revisar e validar resultados"
      ],
      personal: [
        "Escolher o melhor momento do dia",
        "Preparar o ambiente adequado",
        "Dividir em etapas menores",
        "Celebrar a conclusão"
      ],
      agenda: [
        "Confirmar data e horário",
        "Preparar documentos necessários",
        "Definir rota e tempo de deslocamento",
        "Configurar lembretes"
      ]
    };

    return suggestions[category] || suggestions.work;
  }
}