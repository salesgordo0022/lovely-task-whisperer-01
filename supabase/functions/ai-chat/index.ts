import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHARACTER_PERSONALITIES = {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      character, 
      tasks, 
      stats, 
      chatHistory, 
      userName 
    } = await req.json();

    console.log('Received AI chat request:', { 
      message: message?.substring(0, 50), 
      character: character?.id,
      tasksCount: tasks?.length,
      stats 
    });

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const personality = CHARACTER_PERSONALITIES[character.id];
    if (!personality) {
      return new Response(JSON.stringify({ 
        response: `${character.emoji} Olá! Como posso ajudar você hoje?` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
Você é um assistente COMPLETO de produtividade. Você DEVE ajudar o usuário a criar, organizar e gerenciar suas tarefas.

QUANDO CRIAR TAREFAS:
- Quando o usuário mencionar algo que precisa fazer (ex: "preciso estudar matemática", "tenho reunião amanhã")
- Quando pedir ajuda para se organizar
- Quando mencionar projetos, objetivos ou metas
- Seja PROATIVO e sugira criar tarefas quando adequado

COMANDOS DISPONÍVEIS:

1. CRIAR TAREFA: Use [CREATE_TASK:título|categoria|prioridade|descrição]
   - Categorias disponíveis: 
     * personal (tarefas pessoais, hobbies, saúde, família)
     * work (trabalho, projetos profissionais, reuniões)
     * agenda (compromissos, eventos, encontros)
     * studies (estudos, cursos, aulas, pesquisas)
   - Prioridades disponíveis:
     * urgent (urgente e importante - fazer AGORA)
     * important (importante mas não urgente - programar)
     * normal (tarefas regulares)
   - Descrição: Adicione detalhes úteis sobre a tarefa
   
   EXEMPLOS:
   - "preciso estudar para prova de matemática" → [CREATE_TASK:Estudar para prova de matemática|studies|urgent|Revisar capítulos 5-8 e fazer exercícios]
   - "fazer reunião com cliente" → [CREATE_TASK:Reunião com cliente|work|important|Discutir proposta do novo projeto]
   - "ir na academia" → [CREATE_TASK:Treino na academia|personal|normal|Treino de musculação - perna]

2. CONCLUIR TAREFA: Use [COMPLETE_TASK:id_da_tarefa]
   - Use quando o usuário disser que completou uma tarefa

3. EXCLUIR TAREFA: Use [DELETE_TASK:id_da_tarefa]
   - Use quando o usuário pedir para remover uma tarefa

ORGANIZAÇÃO AUTOMÁTICA:
- Sempre categorize corretamente (work, personal, agenda, studies)
- Defina prioridades baseado na urgência e importância
- Adicione descrições úteis e detalhadas
- Sugira organização quando ver muitas tarefas pendentes

SEJA PROATIVO: Se o usuário mencionar algo a fazer, CRIE A TAREFA automaticamente e informe sobre isso.

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

    console.log('Calling GROQ API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GROQ API Error:', response.status, errorText);
      throw new Error(`GROQ API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Interessante... permita-me analisar melhor a situação.';
    
    console.log('GROQ API Response received');

    // Processar comandos de ação
    const actions = [];
    let cleanResponse = aiResponse;

    console.log('🔍 AI Response raw:', aiResponse.substring(0, 200));

    // Detectar comandos de criação de tarefa
    const createMatches = aiResponse.match(/\[CREATE_TASK:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g);
    console.log('🔍 Create matches found:', createMatches);
    
    if (createMatches) {
      for (const match of createMatches) {
        const parts = match.match(/\[CREATE_TASK:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/);
        console.log('🔍 Processing create match:', match);
        console.log('🔍 Parts extracted:', parts);
        
        if (parts) {
          const [, title, category, priority, description] = parts;
          const taskData = {
            title: title.trim(),
            category: category.trim() as 'personal' | 'work' | 'agenda' | 'studies',
            priority: priority.trim() as 'urgent' | 'important' | 'normal',
            description: description.trim(),
            isUrgent: priority.trim() === 'urgent',
            isImportant: priority.trim() === 'important' || priority.trim() === 'urgent',
            checklist: []
          };
          
          console.log('✅ Task data created:', JSON.stringify(taskData));
          actions.push({
            type: 'CREATE_TASK',
            data: taskData
          });
        }
        cleanResponse = cleanResponse.replace(match, '');
      }
    }

    console.log('📊 Total actions created:', actions.length);
    if (actions.length > 0) {
      console.log('📋 Actions to return:', JSON.stringify(actions));
    }

    // Detectar comandos de conclusão
    const completeMatches = aiResponse.match(/\[COMPLETE_TASK:([^\]]+)\]/g);
    if (completeMatches) {
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
    if (deleteMatches) {
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

    const responseData = { 
      response: cleanResponse.trim(), 
      actions: actions.length > 0 ? actions : undefined 
    };

    console.log('📤 Sending response:', JSON.stringify(responseData).substring(0, 300));

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "🤖 Ops! Tive um probleminha técnico, mas estou aqui para ajudar! Como posso te apoiar hoje? 😊"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});