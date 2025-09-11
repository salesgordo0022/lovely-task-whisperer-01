import { Task, ProductivityStats } from '@/types/task';
import { Character } from '@/types/character';
import { dataService } from './dataService';

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
      const result = this.generatePersonalityResponse(message, character, stats, chatHistory, taskActions);
      return result;
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
    // Usar Edge Function segura para chamadas de IA
    try {
      const response = await fetch('https://lzcbcsflkikxgojxmyoy.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          character,
          tasks,
          stats,
          chatHistory,
          userName
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function Error:', response.status, errorText);
        throw new Error(`Edge Function Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Se a resposta da Edge Function estiver vazia, usar fallback local
      if (!data.response || data.response.trim() === '') {
        // Using fallback local response
        return this.generatePersonalityResponse(message, character, stats, chatHistory, taskActions);
      }

      return {
        response: data.response,
        actions: data.actions || []
      };
    } catch (error) {
      // Error in Edge Function - fallback to local response
      throw new Error('Serviço de IA temporariamente indisponível');
    }
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
    chatHistory: ChatMessage[] = [],
    taskActions?: {
      createTask: (task: any) => Promise<void>;
      deleteTask: (id: string) => Promise<void>;
      toggleTask: (id: string) => Promise<void>;
    }
  ): { response: string; actions?: { type: string; data: any }[] } {
    const personality = CHARACTER_PERSONALITIES[character.id];
    if (!personality) return { response: `${character.emoji} Como posso ajudar?` };

    const lowerMessage = message.toLowerCase();
    
    // Análise do contexto atual
    const pendingTasks = stats.totalTasks - stats.tasksCompleted;
    const isGoodProgress = stats.productivityScore > 70;
    const hasStreak = stats.streak > 0;

    // Detectar solicitações de criação de tarefa
    if (lowerMessage.includes('criar') || lowerMessage.includes('nova tarefa') || lowerMessage.includes('adicionar tarefa')) {
      const actions = [];
      let response = `${character.emoji} Vou criar uma tarefa para você! `;
      
      // Extrair título da tarefa da mensagem
      let title = 'Nova tarefa';
      let category: 'personal' | 'work' | 'agenda' = 'personal';
      let priority: 'normal' | 'important' | 'urgent' = 'normal';
      
      // Tentar extrair informações da mensagem
      if (lowerMessage.includes('trabalho') || lowerMessage.includes('profissional')) {
        category = 'work';
      } else if (lowerMessage.includes('reunião') || lowerMessage.includes('compromisso')) {
        category = 'agenda';
      }
      
      if (lowerMessage.includes('urgente')) {
        priority = 'urgent';
      } else if (lowerMessage.includes('importante')) {
        priority = 'important';
      }
      
      // Extrair título após palavras-chave
      const createWords = ['criar', 'nova tarefa', 'adicionar tarefa', 'quero que crie'];
      for (const word of createWords) {
        if (lowerMessage.includes(word)) {
          const parts = message.split(new RegExp(word, 'i'));
          if (parts.length > 1) {
            title = parts[1].trim() || 'Nova tarefa';
            break;
          }
        }
      }
      
      const taskData = {
        title,
        description: '',
        category,
        priority,
        isUrgent: priority === 'urgent',
        isImportant: priority === 'important' || priority === 'urgent'
      };
      
      actions.push({
        type: 'CREATE_TASK',
        data: taskData
      });
      
      response += `Criei a tarefa "${title}" na categoria ${category} com prioridade ${priority}. ${personality.motivationalPhrases[Math.floor(Math.random() * personality.motivationalPhrases.length)]} 🚀`;
      
      return { response, actions };
    }

    // Detectar solicitações de criação de anotação
    if ((lowerMessage.includes('criar') || lowerMessage.includes('nova') || lowerMessage.includes('adicionar')) && 
        (lowerMessage.includes('anotação') || lowerMessage.includes('nota') || lowerMessage.includes('lembrete'))) {
      const actions = [];
      
      // Extrair título e conteúdo da anotação
      let title = this.extractNoteTitle(message);
      let content = this.extractNoteContent(message);
      
      actions.push({
        type: 'CREATE_NOTE',
        data: { title, content }
      });
      
      const response = `${character.emoji} Excelente! Criei uma anotação "${title}" para você. ${personality.encouragementWords[0]} 📝`;
      
      return { response, actions };
    }

    // Detectar solicitações para listar anotações
    if ((lowerMessage.includes('mostrar') || lowerMessage.includes('ver') || lowerMessage.includes('listar')) &&
        (lowerMessage.includes('anotações') || lowerMessage.includes('notas'))) {
      const actions = [];
      
      actions.push({
        type: 'LIST_NOTES',
        data: {}
      });
      
      const response = `${character.emoji} Vou mostrar suas anotações! ${personality.motivationalPhrases[0]} 📋`;
      
      return { response, actions };
    }
    
    // Respostas contextuais baseadas na mensagem e situação
    if (lowerMessage.includes('triste') || lowerMessage.includes('desanimado') || lowerMessage.includes('difícil') || lowerMessage.includes('não consigo')) {
      const encouragements = [
        `${character.emoji} Ei, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! ${personality.motivationalPhrases[Math.floor(Math.random() * personality.motivationalPhrases.length)]} 💪`,
        `${character.emoji} Olha só sua jornada até aqui: ${stats.tasksCompleted} tarefas concluídas! Você é mais forte do que imagina! ✨`,
        `${character.emoji} Dias difíceis fazem pessoas fortes. Você já provou que consegue - sua sequência de ${stats.streak} dias é a prova! 🔥`
      ];
      return { response: encouragements[Math.floor(Math.random() * encouragements.length)] };
    }
    
    if (lowerMessage.includes('completei') || lowerMessage.includes('terminei') || lowerMessage.includes('consegui') || lowerMessage.includes('fiz')) {
      return { response: `${character.emoji} INCRÍVEL! 🎉 Você está arrasando, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Cada tarefa concluída te deixa mais poderoso! Continue assim! ⚡` };
    }
    
    if (lowerMessage.includes('como') && lowerMessage.includes('estou')) {
      if (isGoodProgress) {
        return { response: `${character.emoji} Você está indo MUITO bem! 🌟 Score de ${stats.productivityScore}%, ${stats.tasksCompleted} tarefas concluídas e uma sequência de ${stats.streak} dias. Sou muito orgulhoso de você! 💫` };
      } else {
        return { response: `${character.emoji} Vamos analisar juntos: você tem ${pendingTasks} tarefas pendentes, mas já completou ${stats.tasksCompleted}! Todo progresso conta. Que tal focarmos na próxima tarefa? 🎯` };
      }
    }
    
    if (lowerMessage.includes('motivação') || lowerMessage.includes('motivar') || lowerMessage.includes('energia')) {
      const motivations = [
        `${character.emoji} ${personality.motivationalPhrases[Math.floor(Math.random() * personality.motivationalPhrases.length)]} Você já chegou até aqui - isso prova sua força! 💪`,
        `${character.emoji} Lembra-se de quem você é: alguém que completa tarefas, mantém sequências e não desiste! Vamos continuar! 🚀`,
        `${character.emoji} Sua energia está dentro de você! ${stats.tasksCompleted} tarefas concluídas mostram seu poder. Desperte o ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]} que há em você! ⚡`
      ];
      return { response: motivations[Math.floor(Math.random() * motivations.length)] };
    }
    
    if (lowerMessage.includes('dica') || lowerMessage.includes('ajuda') || lowerMessage.includes('como') || lowerMessage.includes('produtivo')) {
      const tips = [
        `${character.emoji} Dica valiosa: foque em uma tarefa por vez! Sua mente funciona melhor assim. Qual tarefa vamos atacar primeiro? 🎯`,
        `${character.emoji} Técnica secreta: use blocos de 25 minutos de foco total. É como treinar - curto mas intenso! ⏰`,
        `${character.emoji} Organize seu ambiente antes de começar. Um espaço limpo = mente clara = produtividade máxima! 🌟`,
        `${character.emoji} Celebre cada pequena vitória! Seu cérebro ama recompensas e isso te motiva para a próxima tarefa! 🎉`
      ];
      return { response: tips[Math.floor(Math.random() * tips.length)] };
    }
    
    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu') || lowerMessage.includes('brigad')) {
      return { response: `${character.emoji} É uma honra te acompanhar nessa jornada! Estamos juntos nessa, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Sempre que precisar, estarei aqui! 🤝✨` };
    }

    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('eae') || lowerMessage.includes('hey')) {
      return { response: `${character.emoji} Olá, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Como você está se sentindo hoje? Pronto para conquistar suas tarefas? 😊✨` };
    }

    if (lowerMessage.includes('cansado') || lowerMessage.includes('exausto') || lowerMessage.includes('esgotado')) {
      return { response: `${character.emoji} Entendo que está cansado... Que tal uma pausa estratégica? Às vezes descansar é a atitude mais produtiva! Hidrate-se e volte renovado! 💧🌱` };
    }

    if (lowerMessage.includes('quantas') || lowerMessage.includes('tarefas') || lowerMessage.includes('faltam')) {
      return { response: `${character.emoji} Vamos ver: você tem ${pendingTasks} tarefas pendentes e já completou ${stats.tasksCompleted}! Está progredindo bem. Uma de cada vez e logo chegará lá! 📊✨` };
    }

    // Resposta padrão baseada na personalidade e contexto
    const defaultResponses = [
      `${character.emoji} ${personality.greeting.split('!')[0]}! Em que posso te ajudar hoje? 😊`,
      `${character.emoji} Oi! Como está sua jornada de produtividade? Estou aqui para te apoiar! 💪`,
      `${character.emoji} Olá, ${personality.encouragementWords[Math.floor(Math.random() * personality.encouragementWords.length)]}! Vamos conversar sobre seus objetivos? 🎯`,
      `${character.emoji} Que bom te ver! Como posso te ajudar a ser ainda mais incrível hoje? ✨`
    ];
    
    return { response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)] };
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

  private static extractNoteTitle(message: string): string {
    // Extrair título da anotação do texto
    const patterns = [
      /criar.*?(?:anotação|nota).*?"([^"]+)"/i,
      /(?:anotação|nota).*?"([^"]+)"/i,
      /criar.*?(?:anotação|nota).*?sobre\s+([^.!?]+)/i,
      /criar.*?(?:anotação|nota).*?(\w+.*?)(?:\s|$)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return "Nova anotação";
  }

  private static extractNoteContent(message: string): string {
    // Extrair conteúdo da anotação do texto
    const patterns = [
      /(?:conteúdo|texto|sobre)[:]\s*"([^"]+)"/i,
      /(?:conteúdo|texto)[:]\s*([^.!?]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return "";
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