import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ChevronRight,
  ChevronLeft,
  Save,
  Copy,
  Home,
  MessageCircleQuestion,
  UserCheck,
  BookOpen,
  Gavel,
  ChevronDown,
  FileText,
  Users,
  Printer,
  PlusCircle,
  Trash2,
  HelpCircle
} from 'lucide-react';
import instrucaoPdf from './documento/Instrução.pdf';
import capaHeaderImg from './documento/Captura de tela 2026-04-05 194744.jpg';
import logoHeaderImg from './documento/27.1- Logo Vetorizado CFO 2026 - MIV .png';

// --- SISTEMA DE TOAST (Substituto do alert) ---
const showToast = (message, type = 'success') => {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

function ToastContainer() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center space-x-2 ${
        toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-bold">{toast.message}</span>
      </div>
    </div>
  );
}

// --- MATRIZ DE CÁLCULO DE RISCO (ANEXO D DA INSTRUÇÃO) ---
function calcularRisco(simCount, nsNaCount) {
  const getRow = (sims) => {
    if (sims <= 2) return 0;
    if (sims === 3) return 1;
    if (sims === 4) return 2;
    if (sims === 5) return 3;
    if (sims === 6) return 4;
    if (sims === 7) return 5;
    if (sims === 8) return 6;
    if (sims === 9) return 7;
    return 8; // 10-19
  };
  
  const getCol = (nsNa) => {
    if (nsNa >= 11) return 11;
    return nsNa;
  };

  const matrix = [
    ['B','B','B','B','B','B','B','B','B','B','B','M'], // 0-2 sims
    ['B','B','B','B','B','B','B','B','M','M','M','M'], // 3 sims
    ['B','B','B','B','M','M','M','M','M','M','M','M'], // 4 sims
    ['M','M','M','M','M','M','M','M','M','M','E','M'], // 5 sims
    ['M','M','M','M','M','M','M','M','E','E','E','M'], // 6 sims
    ['M','M','M','M','M','M','E','E','E','E','E','M'], // 7 sims
    ['M','M','M','M','E','E','E','E','E','E','E','M'], // 8 sims
    ['M','M','E','E','E','E','E','E','E','E','E','M'], // 9 sims
    ['E','E','E','E','E','E','E','E','E','E','E','E'], // 10-19 sims
  ];

  const resultado = matrix[getRow(simCount)][getCol(nsNaCount)];
  if (resultado === 'B') return { nivel: 'Baixo', cor: 'bg-emerald-500', text: 'text-emerald-700' };
  if (resultado === 'M') return { nivel: 'Médio', cor: 'bg-yellow-500', text: 'text-yellow-700' };
  return { nivel: 'Elevado', cor: 'bg-red-600', text: 'text-red-700' };
}

// --- PERGUNTAS DO FONAR ---
const perguntasFonar = [
  "A violência vem aumentando de gravidade e/ou de frequência no último mês?",
  "A vítima está grávida ou teve bebê nos últimos 18 meses?",
  "Possui filhos com o agressor E estão vivendo conflito sobre guarda/visitas/pensão?",
  "O(A) agressor(a) persegue a vítima, demonstra ciúmes excessivo ou tenta controlar sua vida?",
  "A vítima se separou recentemente do(a) agressor(a), tentou ou tem intenção de se separar?",
  "O(A) agressor(a) também é violento com outras pessoas (familiares, amigos, colegas)?",
  "A vítima possui animal doméstico E o agressor maltrata ou agride o animal?",
  "O(A) agressor(a) já agrediu a vítima fisicamente outras vezes?",
  "Alguma vez o(a) agressor(a) tentou estrangular, sufocar ou afogar a vítima?",
  "O(A) agressor(a) já fez ameaças de morte ou tentou matar a vítima?",
  "O(A) agressor(a) já usou, ameaçou usar arma de fogo contra a vítima ou tem fácil acesso a uma?",
  "O(A) agressor(a) já ameaçou ou feriu a vítima com outro tipo de arma ou instrumento (faca)?",
  "A vítima necessitou de atendimento médico e/ou internação após agressões anteriores?",
  "O(A) agressor(a) é usuário de drogas e/ou bebidas alcoólicas?",
  "O(A) agressor(a) faz uso de medicação controlada para doença mental/psiquiátrica?",
  "A vítima já teve MPU antes E o agressor já descumpriu alguma MPU?",
  "O(A) agressor(a) já ameaçou ou tentou se matar alguma vez?",
  "O(A) agressor(a) já obrigou a vítima a ter relações sexuais contra a vontade?",
  "O(A) agressor(a) está com dificuldades financeiras, desempregado ou não para em emprego?"
];

// Método infalível para cópia de área de transferência
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast("Copiado com sucesso para a área de transferência!");
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showToast("Copiado com sucesso para a área de transferência!");
    }
  } catch (err) {
    showToast("Erro ao copiar o texto. Por favor, selecione e copie manualmente.", "error");
  }
};

export default function App() {
  const [telaAtual, setTelaAtual] = useState('capa');
  
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center font-sans text-zinc-900 selection:bg-yellow-200">
      <ToastContainer />
      <div className="w-full max-w-md bg-zinc-50 shadow-2xl flex flex-col relative overflow-hidden print:shadow-none print:max-w-none print:bg-white">
        
        {/* Header Institucional PMMG (Padrão Intranet) */}
        {telaAtual !== 'capa' && (
        <div className="bg-zinc-950 text-white px-4 py-1 flex items-center justify-between z-10 border-b-[3px] border-yellow-500 shadow-sm print:hidden">
          <div className="flex items-center space-x-3">
            <img
              src={logoHeaderImg}
              alt="Logo PMMG"
              className="h-36 w-36 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="font-black text-[2.3rem] leading-none tracking-wide">PMMG</h1>
              <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.22em] mt-2">Apoio Multimissão</span>
            </div>
          </div>
          {telaAtual !== 'home' && (
            <button 
              onClick={() => setTelaAtual('home')} 
              className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors bg-zinc-900 border border-zinc-800 group"
            >
              <Home className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" strokeWidth={2} />
            </button>
          )}
        </div>
        )}

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 print:overflow-visible print:bg-white">
          {telaAtual === 'capa' && <CoverScreen setTelaAtual={setTelaAtual} />}
          {telaAtual === 'home' && <HomeScreen setTelaAtual={setTelaAtual} />}
          {telaAtual === 'primeira' && <PrimeiraResposta setTelaAtual={setTelaAtual} />}
          {telaAtual === 'segunda' && <SegundaResposta setTelaAtual={setTelaAtual} />}
          {telaAtual === 'guia_legal' && <GuiaCrimes />}
          {telaAtual === 'modelos' && <ModelosReds />}
          {telaAtual === 'faq' && <FaqScreen />}
        </div>
      </div>
    </div>
  );
}

function CoverScreen({ setTelaAtual }) {
  return (
    <div className="min-h-screen bg-[#f7f3ea] print:hidden">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f7f3ea] text-center shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
        <div className="overflow-hidden">
          <img
            src={capaHeaderImg}
            alt="Cabeçalho do guia Maria da Penha"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="bg-white px-8 pb-10 pt-8">
          <div className="space-y-7">
            <div className="space-y-5">
              <h1 className="text-[1.95rem] font-black uppercase leading-[0.98] tracking-[-0.03em] text-zinc-950">
                Guia De Apoio A Ocorrências De Maria Da Penha
              </h1>
              <p className="mx-auto max-w-[18rem] text-[0.95rem] font-light leading-9 text-[#c8aa62]">
                Fluxo rápido para atendimento, qualificação, FONAR e encaminhamento
              </p>
            </div>

            <p className="mx-auto max-w-sm text-[0.92rem] leading-9 text-[#d1ac68]">
              Ferramenta de apoio operacional, de caráter auxiliar.
              <br />
              <span className="font-bold text-[#c74f34]">Não pertencente à Instituição</span> e sem valor
              substitutivo dos procedimentos legais e regulamentares.
              <span className="font-bold text-[#c74f34]"> Uso exclusivo para consulta e suporte.</span>
            </p>

            <div className="pt-2 flex w-full flex-col gap-4">
              <button
                onClick={() => setTelaAtual('home')}
                className="w-full rounded-[1.15rem] bg-zinc-950 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-all active:scale-[0.98] hover:bg-zinc-800"
              >
                Entrar No Guia
              </button>
              <a
                href={instrucaoPdf}
                download="Instrução.pdf"
                className="inline-flex w-full items-center justify-center rounded-[1.15rem] border border-zinc-300 bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-zinc-700 shadow-sm transition-colors hover:border-[#b79d4f] hover:bg-[#fff8e7]"
              >
                <FileText className="mr-2 h-4 w-4" strokeWidth={2} />
                Baixar Instrução Em PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TELA INICIAL (MENU)
// ==========================================
function HomeScreen({ setTelaAtual }) {
  return (
    <div className="p-5 space-y-6 pb-12 animate-in fade-in duration-300 print:hidden">
      
      {/* Banner Informativo Suave */}
      <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm flex items-start space-x-3">
        <Info className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-0.5" />
        <div>
          <h2 className="font-bold text-zinc-800 text-sm tracking-wide">IN 3.05.015/2026</h2>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Bem-vindo ao Guia de Bolso. Selecione a fase do atendimento ou consulte as tipificações e manuais.
          </p>
          <a
            href={instrucaoPdf}
            download="Instrução.pdf"
            className="mt-3 inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors hover:bg-yellow-50 hover:text-zinc-900"
          >
            <FileText className="mr-2 h-4 w-4" strokeWidth={2} />
            Baixar instrução em PDF
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {/* Botão 1ª Resposta */}
        <button 
          onClick={() => setTelaAtual('primeira')}
          className="w-full bg-zinc-950 hover:bg-zinc-800 text-white p-5 rounded-2xl flex items-center shadow-md transition-all active:scale-[0.98] border border-zinc-800 group"
        >
          <div className="bg-zinc-800/50 p-3.5 rounded-xl mr-4 group-hover:bg-yellow-500/10 transition-colors">
            <AlertTriangle className="w-7 h-7 text-yellow-500" strokeWidth={1.5} />
          </div>
          <div className="text-left flex-1">
            <span className="font-black text-lg block tracking-wide">1ª Resposta</span>
            <span className="text-xs text-zinc-400 mt-0.5 block font-medium">Ocorrência de emergência no local</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-yellow-500" />
        </button>

        {/* Botão 2ª Resposta */}
        <button 
          onClick={() => setTelaAtual('segunda')}
          className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-5 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
        >
          <div className="bg-zinc-100 p-3.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
            <ClipboardList className="w-7 h-7 text-zinc-700" strokeWidth={1.5} />
          </div>
          <div className="text-left flex-1">
            <span className="font-black text-lg block tracking-wide">2ª Resposta</span>
            <span className="text-xs text-zinc-500 mt-0.5 block font-medium">Visita Tranquilizadora (Até 72h)</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500" />
        </button>

        <div className="pt-2">
          <div className="border-t border-zinc-200 w-16 mx-auto mb-4"></div>
        </div>

        {/* Grupo de Botões de Consulta */}
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => setTelaAtual('guia_legal')}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <BookOpen className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">Tipificações (Crimes)</span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">Guia rápido de enquadramento</span>
            </div>
          </button>

          <button 
            onClick={() => setTelaAtual('modelos')}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <FileText className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">Modelos de REDS</span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">Anexos oficiais da Instrução</span>
            </div>
          </button>
          
          <button 
            onClick={() => setTelaAtual('faq')}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <HelpCircle className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">Perguntas Frequentes</span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">FAQ da atuação policial em VDF</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TELA: PERGUNTAS FREQUENTES (FAQ)
// ==========================================
const faqData = [
  { p: "1. O que é a Primeira Resposta?", r: "Atendimento imediato no local: cessar agressão, proteger vítima, conter autor, formalizar REDS, preencher FONAR e adotar medidas legais cabíveis." },
  { p: "2. Quais providências compõem a 1ª Resposta?", r: "Preservar a vítima, interromper a violência, qualificar partes, registar REDS, preencher FONAR e conduzir em flagrante, se aplicável." },
  { p: "3. O que é a Segunda Resposta?", r: "Visita tranquilizadora pós-ocorrência para reavaliar risco, orientar a vítima e reforçar a presença da Polícia Militar." },
  { p: "4. Quem faz a Segunda Resposta?", r: "Equipa de Radiopatrulha Multimissão, preferencialmente a mesma que atendeu a ocorrência inicial (evitando revitimização)." },
  { p: "5. Qual o prazo para a 2ª Resposta?", r: "A visita deve ser feita em até 72 horas após a ocorrência inicial." },
  { p: "6. O que verificar na 2ª Resposta?", r: "Novas ameaças, contactos do autor, quebras de MPU, risco atual e a necessidade de acionar a RpPM (3ª Resposta)." },
  { p: "7. O que é a Terceira Resposta?", r: "Acompanhamento especializado e contínuo para casos de maior risco, voltado a parceiros íntimos." },
  { p: "8. Quem executa a Terceira Resposta?", r: "Regra geral: Radiopatrulha de Proteção à Mulher (RpPM). Na sua ausência, equipa Multimissão devidamente instruída." },
  { p: "9. Qual a duração da Terceira Resposta?", r: "Acompanhamento estruturado com duração de até 90 dias." },
  { p: "10. Em quanto tempo inicia a 3ª Resposta?", r: "A primeira visita deve ocorrer no prazo de até 7 dias após a seleção/triagem do caso." },
  { p: "11. Quantas visitas tem a 3ª Resposta?", r: "6 visitas sequenciais: inclusão da vítima, notificação do autor, testemunhas, e monitorização até ao encerramento." },
  { p: "12. Que casos vão para a 3ª Resposta?", r: "Alto risco no FONAR, violência grave/reiterada, risco associado à MPU, e casos onde vítima ou autor seja Policial Militar." },
  { p: "13. Cabe TCO em violência doméstica?", r: "NÃO. É vedado o TCO. Regista-se sempre o REDS e conduz-se em caso de flagrante." },
  { p: "14. Qual a postura ideal da guarnição?", r: "Técnica, segura e humanizada. Ouvir vítima e autor em separado, sem emitir julgamentos e focando na clareza dos factos." },
  { p: "15. O FONAR é obrigatório?", r: "SIM. É um instrumento essencial da 1ª Resposta para definir o grau de risco e a necessidade de acompanhamento futuro." },
  { p: "16. Devo verificar a existência de MPU?", r: "SIM, desde o primeiro atendimento. A existência de MPU ativa altera o risco e as providências a tomar." },
  { p: "17. Como agir perante quebra de MPU?", r: "É uma infração muito grave (Art. 24-A). É passível de prisão em flagrante imediata no local." },
  { p: "18. O que é obrigatório no REDS?", r: "Relação das partes, histórico, existência de MPU, armas, drogas/álcool, contexto exato e a presença de crianças no local." },
  { p: "19. Crianças podem ser testemunhas?", r: "NÃO, como formais. A presença delas é apenas considerada na análise de risco. Anote revelações espontâneas." },
  { p: "20. A fala momentânea da vítima basta?", r: "NÃO. Devido ao ciclo da violência (fase 'lua de mel'), a vítima pode minimizar o ato. Analise o conjunto dos factos objetivos." },
  { p: "21. A lei ampara mulheres trans e travestis?", r: "SIM. A proteção aplica-se integralmente a mulheres trans, travestis e a relacionamentos homoafetivos femininos." },
  { p: "22. Qual o resumo essencial para o PM?", r: "Separar as partes, avaliar risco (FONAR), registar REDS completo, lembrar que não cabe TCO, e definir a 2ª ou 3ª Resposta." }
];

function FaqScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">FAQ / Dúvidas Frequentes</h2>
        <p className="text-sm text-zinc-500 mt-1">Atendimento policial em ocorrência de VDF.</p>
      </div>

      <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mb-6">
        <MessageCircleQuestion className="w-5 h-5 flex-shrink-0 text-zinc-700 mt-0.5" strokeWidth={2} />
        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
          Dúvidas rápidas baseadas no material de instrução sobre os três níveis de atuação e posturas legais.
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`bg-white border ${isOpen ? 'border-yellow-400 shadow-md ring-1 ring-yellow-400/20' : 'border-zinc-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200`}>
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-zinc-50/50 transition-colors"
              >
                <div className="pr-4">
                  <h3 className={`font-bold text-[14px] leading-tight ${isOpen ? 'text-zinc-900' : 'text-zinc-800'}`}>{faq.p}</h3>
                </div>
                <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${isOpen ? 'bg-yellow-100 text-yellow-700' : 'bg-zinc-100 text-zinc-500'}`}>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200">
                  <div className="border-t border-zinc-100 pt-3">
                    <p className="text-zinc-600 text-[13px] leading-relaxed font-medium">
                      {faq.r}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// TELA: GUIA DE CRIMES (ACORDEÃO)
// ==========================================
const baseCrimes = [
  { titulo: "1. Lesão Corporal", categoria: "Violência Física", pena: "Reclusão, de 1 a 4 anos (Art. 129, §13, CP)", descricao: "Ofender a integridade corporal ou a saúde de outra pessoa.", verbos: ["agredir", "bater", "socar", "chutar", "empurrar", "estrangular", "ferir"], exemplos: "Dar tapa e deixar vermelhidão; dar soco e causar hematoma; apertar o pescoço e deixar marcas.", confusao: "Ameaça (quando não houve lesão, só promessa); Vias de fato (contato físico sem lesão relevante); Tentativa de feminicídio (quando a intenção era matar).", pergunta: "Houve agressão física com dor, marca ou prejuízo à saúde?" },
  { titulo: "2. Ameaça", categoria: "Violência Psicológica", pena: "Detenção, 1 a 6 meses, ou multa (Art. 147, CP)", descricao: "Ameaçar alguém, por palavra, escrito, gesto ou outro meio, de causar mal injusto e grave.", verbos: ["ameaçar", "intimidar", "prometer matar", "prometer bater"], exemplos: "«Vou te matar»; «se chamar a polícia, eu te arrebento»; áudio dizendo que vai incendiar a casa.", confusao: "Injúria (xingamento sem promessa de mal grave); Violência psicológica (humilhação contínua); Perseguição (repetição de atos).", pergunta: "O autor prometeu um mal grave e injusto?" },
  { titulo: "3. Violência Psicológica", categoria: "Violência Psicológica", pena: "Reclusão, 6 meses a 2 anos, e multa (Art. 147-B, CP)", descricao: "Causar dano emocional, prejudicar desenvolvimento ou visar degradar/controlar ações por ameaça, humilhação, isolamento ou chantagem.", verbos: ["humilhar", "constranger", "controlar", "isolar", "ridicularizar"], exemplos: "Proibir contato com família; vigiar celular; humilhar diariamente; ameaçar expor vídeos íntimos.", confusao: "Ameaça (promessa de mal é o centro); Perseguição (foco no seguimento e vigilância); Injúria (ofensa pontual).", pergunta: "O foco da conduta foi dominar, humilhar, isolar ou destruir o emocional?" },
  { titulo: "4. Descumprimento de MPU", categoria: "Contra a Adm. da Justiça", pena: "Detenção, de 3 meses a 2 anos (Art. 24-A, LMP)", descricao: "Descumprir decisão judicial que deferiu medida protetiva de urgência.", verbos: ["descumprir", "aproximar-se", "contatar", "perseguir apesar da ordem"], exemplos: "Juiz proibiu contato e ele ligou/mandou WhatsApp; proibiu aproximação e foi à casa ou trabalho.", confusao: "Perseguição (pode existir sem MPU); O foco aqui é se havia ordem judicial ativa violada.", pergunta: "Já existia ordem judicial e o autor desobedeceu?" },
  { titulo: "5. Perseguição (Stalking)", categoria: "Violência Psicológica", pena: "Reclusão, 6 meses a 2 anos (+1/2 se mulher) (Art. 147-A)", descricao: "Perseguir alguém, reiteradamente e por qualquer meio, ameaçando integridade, restringindo locomoção ou invadindo privacidade.", verbos: ["seguir", "rondar", "monitorar", "vigiar", "importunar repetidamente"], exemplos: "Esperar na porta do trabalho todo dia; criar perfis falsos nas redes sociais; ligar dezenas de vezes ao dia.", confusao: "Ameaça (exige repetição para ser stalking); Descumprimento de medida (se houver ordem, responde por ambos).", pergunta: "Houve repetição de atos de seguimento, vigilância ou invasão da privacidade?" },
  { titulo: "6. Injúria, Difamação e Calúnia", categoria: "Violência Moral", pena: "Injúria: 1-6m / Difamação: 3m-1a / Calúnia: 6m-2a", descricao: "Injúria: ofender a dignidade. Difamação: imputar fato ofensivo à reputação. Calúnia: imputar falsamente um crime.", verbos: ["xingar", "difamar", "inventar crime"], exemplos: "Injúria: chamar de «vagabunda». Difamação: dizer no trabalho que ela trai. Calúnia: dizer que ela furtou algo (sabendo ser falso).", confusao: "Xingou = Injúria. Falou mal = Difamação. Acusou de crime = Calúnia.", pergunta: "Foi xingamento? Fato ofensivo? Ou crime falso?" },
  { titulo: "7. Dano, Furto ou Apropriação", categoria: "Violência Patrimonial", pena: "Dano: 1-6m / Furto: 1-4a / Apropriação: 1-4a (CP)", descricao: "Reter, subtrair, destruir objetos, documentos, instrumentos de trabalho ou recursos da mulher.", verbos: ["quebrar", "rasgar", "pegar", "esconder", "reter"], exemplos: "Dano: quebrar celular ou rasgar roupas. Furto: levar o dinheiro dela. Apropriação: reter cartão bancário ou CNH para controlá-la.", confusao: "Dano destrói. Furto tira dela. Apropriação é reter o que já estava com ele pacificamente.", pergunta: "Ele quebrou, levou ou reteve bens para controlar ou prejudicar?" },
  { titulo: "8. Estupro", categoria: "Violência Sexual", pena: "Reclusão, de 6 a 10 anos (Art. 213, CP)", descricao: "Constranger alguém, com violência ou grave ameaça, a ter conjunção carnal ou praticar/permitir ato libidinoso.", verbos: ["constranger", "forçar", "obrigar", "violentar"], exemplos: "Obrigar relação sexual ou ato libidinoso mediante força ou ameaça.", confusao: "Importunação sexual (ato sem consentimento, mas sem violência ou grave ameaça).", pergunta: "Houve ato sexual forçado por violência ou grave ameaça?" },
  { titulo: "9. Cárcere e Constrangimento", categoria: "Privação de Liberdade", pena: "Cárcere: 1 a 3 anos (Art. 148). Const.: 3m a 1 ano (Art. 146).", descricao: "Cárcere Privado: privar a liberdade de locomoção. Constrangimento Ilegal: obrigar a fazer algo que a lei não manda.", verbos: ["trancar", "prender", "obrigar", "forçar a fazer"], exemplos: "Cárcere: trancar a vítima no quarto, tirar a chave. Constrangimento: obrigar a apagar mensagens, forçar a entrar no carro.", confusao: "Cárcere: foca em prender no local. Constrangimento: foca em impor comportamento à força.", pergunta: "Foi impedida de sair fisicamente ou obrigada a fazer algo à força?" },
  { titulo: "10. Feminicídio (e Tentativa)", categoria: "Crime Contra a Vida", pena: "Reclusão, de 20 a 40 anos (Art. 121-A, CP)", descricao: "Matar mulher por razões da condition do sexo feminino (violência doméstica/familiar ou menosprezo à mulher).", verbos: ["matar", "executar", "tentar matar", "desferir golpes"], exemplos: "Esfaquear ou atirar contra a companheira ou ex-companheira para tirar sua vida.", confusao: "Lesão corporal (quando não há intenção de matar, apenas ferir).", pergunta: "Os atos mostram intenção clara de matar ou execução voltada à morte?" }
];

function GuiaCrimes() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Tipificações</h2>
        <p className="text-sm text-zinc-500 mt-1">Guia rápido para enquadramento legal correto.</p>
      </div>

      <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mb-6">
        <Gavel className="w-5 h-5 flex-shrink-0 text-zinc-700 mt-0.5" strokeWidth={2} />
        <p className="text-xs leading-relaxed text-zinc-600">
          Nem toda agressão é <strong className="text-zinc-800">lesão corporal</strong>, e nem toda ofensa é <strong className="text-zinc-800">difamação</strong>. Use este guia antes de fechar o REDS.
        </p>
      </div>

      <div className="space-y-3">
        {baseCrimes.map((crime, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`bg-white border ${isOpen ? 'border-yellow-400 shadow-md ring-1 ring-yellow-400/20' : 'border-zinc-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200`}>
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-zinc-50/50 transition-colors"
              >
                <div>
                  <h3 className={`font-bold text-[15px] ${isOpen ? 'text-zinc-900' : 'text-zinc-800'}`}>{crime.titulo}</h3>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mt-1 tracking-widest">{crime.categoria}</p>
                </div>
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-yellow-100 text-yellow-700' : 'bg-zinc-100 text-zinc-500'}`}>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200">
                  <div className="border-t border-zinc-100 pt-4 space-y-4 text-sm">
                    
                    <div className="inline-flex bg-zinc-100 border border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide">
                      ⚖️ Pena: {crime.pena}
                    </div>

                    <p className="text-zinc-600 leading-relaxed"><strong className="text-zinc-900">Na lei:</strong> {crime.descricao}</p>

                    <div>
                      <span className="font-bold text-zinc-400 block mb-2 text-[10px] uppercase tracking-widest">Verbos-chave</span>
                      <div className="flex flex-wrap gap-1.5">
                        {crime.verbos.map((verbo, vIdx) => (
                          <span key={vIdx} className="bg-white border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide shadow-sm">
                            {verbo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                      <p className="text-zinc-600 text-xs leading-relaxed"><strong className="text-zinc-900">Exemplos:</strong> {crime.exemplos}</p>
                    </div>

                    <p className="text-zinc-600 text-xs leading-relaxed">
                      <strong className="text-red-500 font-bold block mb-1">⚠️ Não confundir com:</strong> 
                      {crime.confusao}
                    </p>

                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/60 mt-2">
                      <p className="text-yellow-700 font-black text-[10px] uppercase tracking-widest mb-1.5">Pergunta-chave</p>
                      <p className="text-yellow-900 text-sm font-medium leading-snug">{crime.pergunta}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// TELA: MODELOS DE REDS (ANEXOS B e C)
// ==========================================
const modelosOficiais = [
  {
    titulo: "1ª Resposta - Padrão (Anexo B)",
    categoria: "Ocorrência Inicial",
    descricao: "Modelo oficial para redação do histórico da Primeira Resposta em ocorrências gerais de Violência Doméstica.",
    texto: `Acionados pelo COPOM/SOU/SOF, comparecemos ao local dos fatos, onde realizamos contato com a Sra. [NOME DA VÍTIMA], a qual nos relatou que teve um relacionamento [CASAMENTO/NAMORO/UNIÃO ESTÁVEL] com o Sr. [NOME DO AUTOR] durante [TEMPO]; que estão separados há [TEMPO], porém residem num imóvel [TIPO/DE QUEM]; que possuem [QTD] filhos; que o autor não aceita o término do relacionamento, é ciumento e possessivo; que o autor faz uso constante de [ÁLCOOL/DROGAS]; que não possui arma de fogo (ou que tem acesso a arma).

Que no dia, durante um atrito causado devido a [MOTIVO], o autor [DESCREVER AGRESSÃO/AMEAÇA], gerando um hematoma e afirmou: "[DIZERES DO AUTOR]"; ainda pegou o celular da vítima e o jogou contra a parede, danificando-o; que esta não foi a primeira vez que foi vítima de violência por parte dele, contudo, sempre teve medo de denunciá-lo (ou que já registrou boletins). 

Segundo a versão do AUTOR/ENVOLVIDO, este relatou que [VERSÃO DO AUTOR].
Segundo a versão da TESTEMUNHA, esta informou que [VERSÃO DA TESTEMUNHA].

Apesar do relato, a equipe não percebeu sinal de desordem ou objetos quebrados (ou a equipe percebeu sinais que condizem com a versão).
A vítima possui medida protetiva de número [NÚMERO], a qual prevê [CONDIÇÕES].

Em decorrência dos relatos (ou lesão), a vítima foi encaminhada ao hospital [NOME], onde foi atendida com a ficha [NÚMERO].
No local dos fatos, foi recolhido [OBJETOS/ARMAS], relacionado em campo próprio.
Consultado o banco de dados, foram encontrados registros anteriores: REDS [NÚMEROS].

A vítima foi orientada a comparecer à DEAM (ou DP) para representar criminalmente o fato narrado.`
  },
  {
    titulo: "1ª Resposta - Com MPU (Anexo C)",
    categoria: "Afastamento pelo PM (Art. 12-C)",
    descricao: "Modelo oficial para quando a própria guarnição PM aplica o afastamento do lar (em cidades que não são Sede de Comarca e sem Delegado disponível).",
    texto: `Durante atendimento à ocorrência, foram identificadas situações de violência(s) do tipo [FÍSICA/PSICOLÓGICA/SEXUAL/PATRIMONIAL/MORAL], bem como outros elementos de risco, conforme avaliação realizada no local. As condutas foram atribuídas ao(à) Senhor(a) [NOME DO AUTOR] em desfavor da Sra. [NOME DA VÍTIMA] e de seus dependentes (se houver), todos vinculados por relação interpessoal ou de convivência, em contexto de violência doméstica e familiar nos moldes da Lei Federal nº 11.340/06.

O cenário verificado evidenciou que a situação se deu em ambiente sob domínio do agressor, em circunstâncias que dificultam ou impedem reações defensivas por parte da vítima, em razão de vínculos afetivos e relações de confiança que colocam a mulher em condição de vulnerabilidade e demandam do Estado uma resposta imediata e eficaz para cessar os riscos à sua integridade física e psicológica.

Diante do exposto, e com fundamento no inciso II do artigo 22, combinado com o inciso III do artigo 12-C da Lei nº 11.340/06, impõe-se a aplicação da Medida Protetiva de Urgência consistente no afastamento do lar, domicílio ou local de convivência do(a) Sr(a). [NOME DO AUTOR] em relação à Sra. [NOME DA VÍTIMA] qualificados, respectivamente, como [AUTOR/VÍTIMA], situado à [ENDEREÇO COMPLETO].

Certifico, para os devidos fins, que a medida foi executada às [HORAS] horas do dia [DATA], com a devida ciência prévia ao agressor acerca do teor e dos efeitos da Medida Protetiva de Afastamento imposta, em conformidade com a legislação vigente, para posterior apreciação da autoridade judicial competente, conforme prevê o §1º do art. 12-C da Lei nº 11.340/06.`
  },
  {
    titulo: "2ª Resposta - Visita Tranquilizadora",
    categoria: "Pós Emergência (POP 1.03.059)",
    descricao: "Modelo prático para redação da visita de retorno realizada pela Rp Multimissão em até 72h após o crime.",
    texto: `ATENDIMENTO DE 2ª Resposta - VISITA TRANQUILIZADORA
REDS de Origem: [NÚMERO DO REDS DA 1ª RESPOSTA]

Em cumprimento à IN 3.05.015/2026 (POP 1.03.059), a guarnição (Multimissão) realizou contato com a vítima, Sra. [NOME DA VÍTIMA], no intuito de verificar suas condições físicas e emocionais após o registro do crime de violência doméstica.

SITUAÇÃO ATUAL DECLARADA PELA VÍTIMA:
A vítima relatou novos contatos ou ameaças do autor? [SIM / NÃO]
A vítima já possui MPU deferida e vigente pelo Juiz? [SIM / NÃO]

SÍNTESE DA VISITA TRANQUILIZADORA:
[Descrever brevemente o estado da vítima. Ex: A vítima encontra-se mais calma, está abrigada na casa da mãe e informa que o autor não a procurou novamente.]

AVALIAÇÃO DA GUARNIÇÃO (TRIAGEM):
[OPÇÃO 1 - SEM RISCO IMINENTE]: Não foi constatado risco iminente de revitimização na presente data. A vítima foi exaustivamente orientada sobre seus direitos, Lei Maria da Penha e a acionar o 190 caso necessário.
[OPÇÃO 2 - COM RISCO / ENCAMINHAMENTO]: Foi constatado RISCO ELEVADO in loco de nova revitimização em relação íntima de afeto. A P3 DA UNIDADE FOI CIENTIFICADA PARA ENCAMINHAMENTO DESTE CASO À RpPM (TERCEIRA RESPOSTA).`
  }
];

function ModelosReds() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Modelos REDS</h2>
        <p className="text-sm text-zinc-500 mt-1">Anexos oficiais da IN 3.05.015/2026 para cópia.</p>
      </div>

      <div className="bg-zinc-900 text-white p-4 rounded-2xl flex items-start space-x-3 shadow-md border border-zinc-800 mb-6">
        <FileText className="w-6 h-6 flex-shrink-0 text-yellow-500 mt-0.5" strokeWidth={1.5} />
        <p className="text-xs leading-relaxed font-medium">
          Utilize estes esqueletos oficiais para garantir que o seu Histórico do REDS contém todos os elementos jurídicos exigidos pelo Estado-Maior da PMMG.
        </p>
      </div>

      <div className="space-y-3">
        {modelosOficiais.map((modelo, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`bg-white border ${isOpen ? 'border-yellow-400 shadow-md ring-1 ring-yellow-400/20' : 'border-zinc-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200`}>
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-zinc-50/50 transition-colors"
              >
                <div>
                  <h3 className={`font-bold text-[15px] ${isOpen ? 'text-zinc-900' : 'text-zinc-800'}`}>{modelo.titulo}</h3>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mt-1 tracking-widest">{modelo.categoria}</p>
                </div>
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-yellow-100 text-yellow-700' : 'bg-zinc-100 text-zinc-500'}`}>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200">
                  <div className="border-t border-zinc-100 pt-4 space-y-4">
                    
                    <p className="text-zinc-500 text-xs leading-relaxed font-medium mb-3">{modelo.descricao}</p>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 shadow-inner relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase ml-1">Histórico Padrão</span>
                        <button 
                          onClick={() => copyToClipboard(modelo.texto)}
                          className="bg-white border border-zinc-200 hover:bg-yellow-500 hover:text-zinc-950 text-zinc-700 py-1.5 px-3 rounded-lg text-xs flex items-center font-bold transition-all shadow-sm active:scale-95"
                        >
                          <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar Texto
                        </button>
                      </div>
                      <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-white p-3.5 rounded-lg max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-sm">
                        {modelo.texto}
                      </pre>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ACORDEÃO DE PESSOA (Vítima, Autor, Testemunha)
// ==========================================
function FormPessoaAccordion({ title, isOpen, onToggle, data, onChange, onRemove }) {
  return (
    <div className={`bg-white border ${isOpen ? 'border-yellow-400 shadow-md ring-1 ring-yellow-400/20' : 'border-zinc-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200`}>
      <button 
        onClick={onToggle}
        className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-zinc-50/50 transition-colors"
      >
        <div className="flex items-center">
          <Users className={`w-5 h-5 mr-3 ${isOpen ? 'text-yellow-600' : 'text-zinc-400'}`} />
          <h3 className={`font-black text-[14px] uppercase tracking-wide ${isOpen ? 'text-zinc-900' : 'text-zinc-700'}`}>
            {title} {data.nome && <span className="font-medium text-xs normal-case text-zinc-500 ml-2">- {data.nome}</span>}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {onRemove && (
             <span onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" />
             </span>
          )}
          <div className={`p-1.5 rounded-xl transition-colors ${isOpen ? 'bg-yellow-100 text-yellow-700' : 'bg-zinc-100 text-zinc-500'}`}>
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200">
          <div className="border-t border-zinc-100 pt-4 grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Nome Completo</label>
              <input type="text" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                value={data.nome} onChange={e => onChange('nome', e.target.value)} />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">RG</label>
                <input type="text" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                  value={data.rg} onChange={e => onChange('rg', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">CPF</label>
                <input type="text" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                  value={data.cpf} onChange={e => onChange('cpf', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Data Nascimento</label>
                <input type="text" placeholder="DD/MM/AAAA" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                  value={data.nasc} onChange={e => onChange('nasc', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Telefone</label>
                <input type="tel" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm font-mono" 
                  value={data.telefone} onChange={e => onChange('telefone', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Nome da Mãe</label>
              <input type="text" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                value={data.mae} onChange={e => onChange('mae', e.target.value)} />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Endereço Completo</label>
              <textarea rows="2" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-zinc-900 font-medium" 
                value={data.endereco} onChange={e => onChange('endereco', e.target.value)}></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE: PROGRESS BAR LINEAR 
// ==========================================
function ProgressBar({ step, total, labels }) {
  return (
    <div className="mb-8 print:hidden">
      <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2.5 px-1 text-center">
        {labels.map((label, i) => (
          <span key={i} className={step >= (i+1) ? 'text-zinc-900' : ''}>{label}</span>
        ))}
      </div>
      <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-yellow-500 transition-all duration-500 ease-out rounded-full" 
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: CHECKBOX CARD
// ==========================================
function CheckboxCard({ label, subtitle, checked, onChange, alert }) {
  return (
    <label className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm ${checked ? 'bg-yellow-50/30 border-yellow-400 ring-1 ring-yellow-400/20' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'}`}>
      <div className="flex items-center h-5 mt-0.5">
        <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 bg-white transition-colors cursor-pointer" 
          checked={checked} onChange={onChange} />
      </div>
      <div className="ml-3 flex flex-col">
        <span className={`text-sm font-bold ${checked ? 'text-zinc-900' : 'text-zinc-700'}`}>{label}</span>
        {subtitle && <span className="text-xs text-zinc-500 mt-1 leading-snug">{subtitle}</span>}
        {alert && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1.5">{alert}</span>}
      </div>
    </label>
  );
}

// ==========================================
// FLUXO DE PRIMEIRA RESPOSTA (5 Passos)
// ==========================================
function PrimeiraResposta({ setTelaAtual }) {
  const [step, setStep] = useState(1);
  
  // Estado estruturado para pessoas
  const [dados, setDados] = useState({
    vitima: { nome: '', rg: '', cpf: '', nasc: '', telefone: '', mae: '', endereco: '' },
    autor: { nome: '', rg: '', cpf: '', nasc: '', telefone: '', mae: '', endereco: '' },
    testemunhas: [], // Array de objetos { nome, rg... }
    
    // Histórico / Dinâmica
    relacao: '', temFilhos: '',
    tempoRelacao: '', tempoSeparacao: '', residencia: '',
    ciumento: false, naoAceitaTermino: false, usoDrogas: '', arma: '',
    motivo: '', versaoVitima: '', versaoAutor: '',
    desordem: '', socorro: '', materiais: '', mpu: '',
    origemAcionamento: '', dataHoraFato: '', filhosDetalhe: '',
    lesoes: '', dizeresAutor: '', danos: '', provas: '',
    destinoVitima: '', destinoAutor: '', acompanhamento: ''
  });
  
  // Controlo de Abas Abertas
  const [openPessoaIndex, setOpenPessoaIndex] = useState('vitima');

  // Checklists da Cena
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  
  const [fonar, setFonar] = useState(Array(19).fill('')); 

  const handleNext = () => { window.scrollTo(0,0); setStep(step + 1); };
  const handlePrev = () => { window.scrollTo(0,0); setStep(step - 1); };

  // Funções de Update de Pessoas
  const updateVitima = (field, val) => setDados({...dados, vitima: {...dados.vitima, [field]: val}});
  const updateAutor = (field, val) => setDados({...dados, autor: {...dados.autor, [field]: val}});
  const addTestemunha = () => {
    const newTestemunhas = [...dados.testemunhas, { nome: '', rg: '', cpf: '', nasc: '', telefone: '', mae: '', endereco: '' }];
    setDados({...dados, testemunhas: newTestemunhas});
    setOpenPessoaIndex(`testemunha_${newTestemunhas.length - 1}`);
  };
  const updateTestemunha = (idx, field, val) => {
    const newT = [...dados.testemunhas];
    newT[idx][field] = val;
    setDados({...dados, testemunhas: newT});
  };
  const removeTestemunha = (idx) => {
    const newT = dados.testemunhas.filter((_, i) => i !== idx);
    setDados({...dados, testemunhas: newT});
  };

  return (
    <div className="p-5 pb-24 print:p-0 print:pb-0">
      <ProgressBar step={step} total={5} labels={["Cena", "Qualificação", "Histórico", "FONAR", "Relatório"]} />

      {/* PASSO 1: CONTROLE DA CENA */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Controle da Cena</h2>
            <p className="text-sm text-zinc-500 mt-1">Garanta a segurança antes de registar os dados.</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <Info className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
            <p className="text-sm leading-relaxed text-amber-900">
              <strong className="text-amber-700">Abordagem Técnica:</strong> Separe a vítima do autor imediatamente. Fale com a mulher num ambiente onde o autor não possa ouvir ou intimidá-la com o olhar.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 ml-1">Checklist Obrigatório</h3>
            
            <CheckboxCard label="As partes foram separadas em segurança?" checked={check1} onChange={(e) => setCheck1(e.target.checked)} />
            <CheckboxCard label="A vítima precisa de socorro médico urgente?" checked={check2} onChange={(e) => setCheck2(e.target.checked)} />
            <CheckboxCard label="Há flagrante delito ou quebra de Medida Protetiva?" alert="Atenção: Não faça TCO nestes casos." checked={check3} onChange={(e) => setCheck3(e.target.checked)} />
            <CheckboxCard label="Há crianças no local?" subtitle="Elas não devem ser interrogadas. Anote apenas revelações espontâneas." checked={check4} onChange={(e) => setCheck4(e.target.checked)} />
          </div>

          <button onClick={handleNext} className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide mt-8">
            Avançar <ChevronRight className="ml-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* PASSO 2: QUALIFICAÇÃO REDS (ACORDEÕES) */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Qualificação</h2>
            <p className="text-sm text-zinc-500 mt-1">Preencha os dados dos envolvidos para o REDS.</p>
          </div>
          
          {/* ALERTA QAPP */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5" strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">Aviso de Segurança</span>
              <p className="text-sm leading-relaxed text-red-900 font-medium">
                Consulte obrigatoriamente o <strong>QAPP / ISP</strong> para verificar a situação de todos os envolvidos e confirmar a existência de Mandados de Prisão em aberto.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <FormPessoaAccordion 
              title="1. Vítima" 
              isOpen={openPessoaIndex === 'vitima'} 
              onToggle={() => setOpenPessoaIndex(openPessoaIndex === 'vitima' ? null : 'vitima')}
              data={dados.vitima} 
              onChange={updateVitima} 
            />

            <FormPessoaAccordion 
              title="2. Autor" 
              isOpen={openPessoaIndex === 'autor'} 
              onToggle={() => setOpenPessoaIndex(openPessoaIndex === 'autor' ? null : 'autor')}
              data={dados.autor} 
              onChange={updateAutor} 
            />

            {dados.testemunhas.map((test, idx) => (
              <FormPessoaAccordion 
                key={idx}
                title={`3. Testemunha ${idx + 1}`} 
                isOpen={openPessoaIndex === `testemunha_${idx}`} 
                onToggle={() => setOpenPessoaIndex(openPessoaIndex === `testemunha_${idx}` ? null : `testemunha_${idx}`)}
                data={test} 
                onChange={(field, val) => updateTestemunha(idx, field, val)}
                onRemove={() => removeTestemunha(idx)}
              />
            ))}

            <button 
              onClick={addTestemunha}
              className="w-full bg-zinc-100 hover:bg-zinc-200 border border-dashed border-zinc-300 text-zinc-600 font-bold py-3.5 rounded-2xl flex justify-center items-center transition-colors text-sm"
            >
              <PlusCircle className="mr-2 w-4 h-4" strokeWidth={2} /> Adicionar Testemunha
            </button>

          </div>

          <div className="flex space-x-3 pt-4">
            <button onClick={handlePrev} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button onClick={handleNext} className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide">
              Avançar p/ Histórico <ChevronRight className="ml-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 3: HISTÓRICO (Dinâmica) */}
      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Histórico</h2>
            <p className="text-sm text-zinc-500 mt-1">Contexto e dinâmica para o registo policial.</p>
          </div>
          
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">Relação e Contexto</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Relação</label>
                  <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.relacao} onChange={e => setDados({...dados, relacao: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="Casamento">Casamento</option>
                    <option value="União Estável">União Estável</option>
                    <option value="Namoro">Namoro</option>
                    <option value="Ficantes">Ficantes</option>
                    <option value="Familiar (Mãe/Filho)">Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Filhos Comuns?</label>
                  <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.temFilhos} onChange={e => setDados({...dados, temFilhos: e.target.value})}>
                    <option value="">...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Tempo Juntos</label>
                  <input type="text" placeholder="Ex: 5 anos" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.tempoRelacao} onChange={e => setDados({...dados, tempoRelacao: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Tempo Separados</label>
                  <input type="text" placeholder="Ex: 2 meses" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.tempoSeparacao} onChange={e => setDados({...dados, tempoSeparacao: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Local do Fato / Moradia</label>
                <input type="text" placeholder="Ex: Casa alugada no nome da vítima" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                  value={dados.residencia} onChange={e => setDados({...dados, residencia: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Origem do Acionamento</label>
                  <input type="text" placeholder="Ex: COPOM / 190 / terceiro" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.origemAcionamento} onChange={e => setDados({...dados, origemAcionamento: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Data / Hora do Fato</label>
                  <input type="text" placeholder="Ex: 05/04/2026 18:40" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.dataHoraFato} onChange={e => setDados({...dados, dataHoraFato: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Filhos / Crianças Relacionadas</label>
                <input type="text" placeholder="Ex: 2 filhos, 6 e 9 anos; presentes no local" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                  value={dados.filhosDetalhe} onChange={e => setDados({...dados, filhosDetalhe: e.target.value})} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">Perfil do Autor</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-yellow-500 rounded border-zinc-300 focus:ring-yellow-500" 
                    checked={dados.ciumento} onChange={e => setDados({...dados, ciumento: e.target.checked})} />
                  <span className="text-sm font-medium text-zinc-800">Ciumento/Possessivo</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-yellow-500 rounded border-zinc-300 focus:ring-yellow-500" 
                    checked={dados.naoAceitaTermino} onChange={e => setDados({...dados, naoAceitaTermino: e.target.checked})} />
                  <span className="text-sm font-medium text-zinc-800">Não aceita término</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Álcool / Drogas</label>
                  <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.usoDrogas} onChange={e => setDados({...dados, usoDrogas: e.target.value})}>
                    <option value="">Não Faz Uso</option>
                    <option value="álcool">Apenas Álcool</option>
                    <option value="drogas">Drogas Ilícitas</option>
                    <option value="álcool e drogas">Álcool e Drogas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Arma de Fogo</label>
                  <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.arma} onChange={e => setDados({...dados, arma: e.target.value})}>
                    <option value="">Não Possui</option>
                    <option value="possui">Possui Arma</option>
                    <option value="tem acesso a">Tem Acesso</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">Dinâmica e Desfecho</h3>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Motivo do Atrito</label>
                <input type="text" placeholder="Ex: Ciúmes, dinheiro..." className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                  value={dados.motivo} onChange={e => setDados({...dados, motivo: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Versão da Vítima</label>
                <textarea rows="2" placeholder="O que o autor fez ou disse..." className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-zinc-900 font-medium" 
                  value={dados.versaoVitima} onChange={e => setDados({...dados, versaoVitima: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Versão do Autor</label>
                <textarea rows="2" placeholder="A versão do autor ou se ele não foi localizado..." className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-zinc-900 font-medium" 
                  value={dados.versaoAutor} onChange={e => setDados({...dados, versaoAutor: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-1 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Lesões Aparente(s)</label>
                  <input type="text" placeholder="Ex: hematoma no braço esquerdo, vermelhidão no pescoço" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.lesoes} onChange={e => setDados({...dados, lesoes: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Dizeres / Ameaças do Autor</label>
                  <textarea rows="2" placeholder="Ex: 'vou te matar', 'vou quebrar tudo'..." className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-zinc-900 font-medium"
                    value={dados.dizeresAutor} onChange={e => setDados({...dados, dizeresAutor: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Danos / Objetos Atingidos</label>
                  <input type="text" placeholder="Ex: celular da vítima danificado, porta quebrada" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.danos} onChange={e => setDados({...dados, danos: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Provas / Elementos Disponíveis</label>
                  <input type="text" placeholder="Ex: fotos, prints, vídeos, testemunha presencial" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.provas} onChange={e => setDados({...dados, provas: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-2 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Sinais / Desordem</label>
                  <input type="text" placeholder="Ex: Porta arrombada" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.desordem} onChange={e => setDados({...dados, desordem: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Socorro Médico</label>
                  <input type="text" placeholder="Ex: UPA, Ficha 123" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.socorro} onChange={e => setDados({...dados, socorro: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Materiais Apreendidos</label>
                  <input type="text" placeholder="Ex: Uma faca" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.materiais} onChange={e => setDados({...dados, materiais: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">MPU Ativa?</label>
                  <input type="text" placeholder="Ex: Processo nº 123" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm" 
                    value={dados.mpu} onChange={e => setDados({...dados, mpu: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Destino da Vítima / Proteção</label>
                  <input type="text" placeholder="Ex: permaneceu com familiar; orientada sobre DEAM e MPU" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.destinoVitima} onChange={e => setDados({...dados, destinoVitima: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Situação do Autor</label>
                  <input type="text" placeholder="Ex: preso em flagrante / não localizado / liberado" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.destinoAutor} onChange={e => setDados({...dados, destinoAutor: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">Encaminhamentos / Acompanhamento</label>
                  <input type="text" placeholder="Ex: DEAM, visita tranquilizadora, RpPM, retorno P3" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-zinc-900 font-medium text-sm"
                    value={dados.acompanhamento} onChange={e => setDados({...dados, acompanhamento: e.target.value})} />
                </div>
              </div>
            </div>

          </div>

          <div className="flex space-x-3 pt-4">
            <button onClick={handlePrev} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button onClick={handleNext} className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide">
              Entrevista FONAR <ChevronRight className="ml-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 4: FONAR (ENTREVISTA) */}
      {step === 4 && (
        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
          <div className="sticky top-0 bg-zinc-50 pt-2 pb-2 z-10">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Entrevista - FONAR</h2>
            <p className="text-sm text-zinc-500 mt-1">Avaliação de Risco Obrigatória.</p>
            
            <div className="bg-white p-3.5 mt-4 rounded-xl flex items-start space-x-3 shadow-sm border border-zinc-200">
              <MessageCircleQuestion className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5" strokeWidth={2} />
              <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                Faça as perguntas de forma empática. É <strong className="text-zinc-900">obrigatório responder a todas</strong> as 19 questões para calcular o risco.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            {perguntasFonar.map((pergunta, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border transition-all duration-200 shadow-sm ${fonar[idx] === 'sim' ? 'bg-red-50/50 border-red-200' : fonar[idx] === 'nao' ? 'bg-emerald-50/50 border-emerald-200' : fonar[idx] === 'nsna' ? 'bg-zinc-100 border-zinc-200' : 'bg-white border-zinc-200'}`}>
                <p className="text-[13px] font-bold text-zinc-800 mb-3.5 leading-snug"><span className="text-yellow-600 mr-1.5 font-black">{idx + 1}.</span> {pergunta}</p>
                <div className="grid grid-cols-3 gap-2.5">
                  <button 
                    onClick={() => { const nf = [...fonar]; nf[idx] = 'sim'; setFonar(nf); }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === 'sim' ? 'bg-red-500 text-white shadow-md ring-2 ring-red-500/20' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>
                    Sim
                  </button>
                  <button 
                    onClick={() => { const nf = [...fonar]; nf[idx] = 'nao'; setFonar(nf); }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === 'nao' ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500/20' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>
                    Não
                  </button>
                  <button 
                    onClick={() => { const nf = [...fonar]; nf[idx] = 'nsna'; setFonar(nf); }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === 'nsna' ? 'bg-zinc-700 text-white shadow-md ring-2 ring-zinc-700/20' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>
                    NS / NA
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-zinc-50 pt-4 pb-6 flex space-x-3">
            <button onClick={handlePrev} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button 
              onClick={handleNext} 
              disabled={fonar.includes('')}
              className={`flex-1 font-bold py-4 rounded-2xl flex justify-center items-center transition-all tracking-wide shadow-md ${fonar.includes('') ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-950 hover:bg-zinc-800 text-white active:scale-[0.98]'}`}>
              Gerar Relatório <ChevronRight className={`ml-2 w-5 h-5 ${fonar.includes('') ? 'text-zinc-300' : 'text-yellow-500'}`} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 5: RESULTADO EM LISTA COM DOWNLOAD PDF */}
      {step === 5 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="print:hidden">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Relatório Estruturado</h2>
            <p className="text-sm text-zinc-500 mt-1">Dados listados prontos para envio ou impressão.</p>
          </div>
          
          {(() => {
            const simCount = fonar.filter(a => a === 'sim').length;
            const nsNaCount = fonar.filter(a => a === 'nsna').length;
            const risco = calcularRisco(simCount, nsNaCount);
            
            let respostasTexto = "";
            perguntasFonar.forEach((pergunta, index) => {
              let resp = "NÃO INFORMADO";
              if (fonar[index] === 'sim') resp = "SIM";
              else if (fonar[index] === 'nao') resp = "NÃO";
              else if (fonar[index] === 'nsna') resp = "NÃO SABE / N/A";
              respostasTexto += `${index + 1}. ${pergunta}\n-> R: ${resp}\n\n`;
            });

            // Formatando Testemunhas para Texto
            let testemunhasTxt = "Nenhuma testemunha registada.";
            if (dados.testemunhas.length > 0) {
              testemunhasTxt = dados.testemunhas.map((t, i) => 
                `Testemunha ${i+1}:\nNome: ${t.nome || '[N/I]'}\nRG: ${t.rg || '[N/I]'} | CPF: ${t.cpf || '[N/I]'}\nNasc: ${t.nasc || '[N/I]'} | Telefone: ${t.telefone || '[N/I]'}\nMãe: ${t.mae || '[N/I]'}\nEndereço: ${t.endereco || '[N/I]'}`
              ).join('\n\n');
            }

            const textoReds = `=========================================
DADOS DE QUALIFICAÇÃO (COPIAR/COMPARTILHAR)
=========================================

[ VÍTIMA ]
Nome: ${dados.vitima.nome || '[N/I]'}
RG: ${dados.vitima.rg || '[N/I]'} | CPF: ${dados.vitima.cpf || '[N/I]'}
Nascimento: ${dados.vitima.nasc || '[N/I]'} | Mãe: ${dados.vitima.mae || '[N/I]'}
Telefone: ${dados.vitima.telefone || '[N/I]'}
Endereço: ${dados.vitima.endereco || '[N/I]'}

[ AUTOR ]
Nome: ${dados.autor.nome || '[N/I]'}
RG: ${dados.autor.rg || '[N/I]'} | CPF: ${dados.autor.cpf || '[N/I]'}
Nascimento: ${dados.autor.nasc || '[N/I]'} | Mãe: ${dados.autor.mae || '[N/I]'}
Telefone: ${dados.autor.telefone || '[N/I]'}
Endereço: ${dados.autor.endereco || '[N/I]'}

[ TESTEMUNHAS ]
${testemunhasTxt}

=========================================
HISTÓRICO DO REDS (CONFORME ANEXO B)
=========================================
[ SUBSÍDIOS PARA CONFECÇÃO ]
Origem do acionamento: ${dados.origemAcionamento || '[N/I]'}
Data / hora do fato: ${dados.dataHoraFato || '[N/I]'}
Relação: ${dados.relacao || '[N/I]'} | Filhos comuns: ${dados.temFilhos || '[N/I]'}
Detalhe de filhos / crianças: ${dados.filhosDetalhe || '[N/I]'}
Tempo de relacionamento: ${dados.tempoRelacao || '[N/I]'} | Tempo de separação: ${dados.tempoSeparacao || '[N/I]'}
Moradia / local do fato: ${dados.residencia || '[N/I]'}
Autor ciumento / possessivo: ${dados.ciumento ? 'SIM' : 'NÃO'} | Não aceita término: ${dados.naoAceitaTermino ? 'SIM' : 'NÃO'}
Uso de álcool / drogas: ${dados.usoDrogas || '[N/I]'} | Arma de fogo: ${dados.arma || '[N/I]'}
Motivo do atrito: ${dados.motivo || '[N/I]'}
Versão da vítima: ${dados.versaoVitima || '[N/I]'}
Versão do autor: ${dados.versaoAutor || '[N/I]'}
Lesões aparentes: ${dados.lesoes || '[N/I]'}
Dizeres / ameaças do autor: ${dados.dizeresAutor || '[N/I]'}
Danos / objetos atingidos: ${dados.danos || '[N/I]'}
Sinais / desordem no local: ${dados.desordem || '[N/I]'}
Atendimento médico: ${dados.socorro || '[N/I]'}
Materiais apreendidos: ${dados.materiais || '[N/I]'}
MPU ativa: ${dados.mpu || '[N/I]'}
Provas / elementos disponíveis: ${dados.provas || '[N/I]'}
Destino da vítima / proteção: ${dados.destinoVitima || '[N/I]'}
Situação do autor: ${dados.destinoAutor || '[N/I]'}
Encaminhamentos / acompanhamento: ${dados.acompanhamento || '[N/I]'}

=========================================
AVALIAÇÃO DE RISCO - FONAR
=========================================
Risco Calculado: ${risco.nivel.toUpperCase()}
(Respostas SIM: ${simCount} | Respostas NS/NA: ${nsNaCount})

Respostas Detalhadas:
${respostasTexto.trim()}`;

            const redsPadraoReferencia = modelosOficiais[0].texto;

            const promptIa = `Com base nos dados abaixo, redija um histórico policial para REDS de violência doméstica, em português formal, objetivo, técnico e impessoal.

Regras:
- Use apenas os dados fornecidos.
- Não invente fatos.
- Se algum dado estiver ausente, simplesmente omita ou use redação neutra.
- Organize o texto em narrativa corrida, no padrão policial militar.
- Considere o modelo de referência abaixo apenas como base de estilo.

MODELO DE REFERÊNCIA:
${redsPadraoReferencia}

DADOS APURADOS:
${textoReds}

TAREFA:
Produza somente o histórico final do REDS, pronto para revisão policial.`;

            return (
              <>
                <div className={`${risco.cor} text-white p-6 rounded-2xl text-center shadow-lg border border-black/10 print:hidden`}>
                  <p className="text-[10px] font-black opacity-90 uppercase tracking-widest mb-1 text-white/80">Nível de Risco Calculado</p>
                  <p className="text-4xl font-black uppercase tracking-widest drop-shadow-sm">{risco.nivel}</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm relative mt-4 print:border-none print:shadow-none print:p-0" id="print-area">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2 print:hidden">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">Dados Estruturados</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.print()}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Printer className="w-4 h-4 mr-1.5" strokeWidth={2} /> Imprimir
                      </button>
                      <button 
                        onClick={() => copyToClipboard(textoReds)}
                        className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar Texto
                      </button>
                    </div>
                  </div>
                  
                  {/* Este é o bloco que será impresso / gerado no PDF. Com a classe print:text-black garantimos leitura */}
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-96 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner print:max-h-full print:bg-white print:border-none print:text-black print:text-[12px] print:overflow-visible">
                    {textoReds}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">REDS Padrão de Referência</span>
                    <button
                      onClick={() => copyToClipboard(redsPadraoReferencia)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar Modelo
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {redsPadraoReferencia}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">Prompt Sugerido Para IA</span>
                    <button
                      onClick={() => copyToClipboard(promptIa)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar Prompt
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {promptIa}
                  </pre>
                </div>
              </>
            );
          })()}

          <div className="flex space-x-3 pt-4 print:hidden">
            <button onClick={handlePrev} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button onClick={() => setTelaAtual('home')} className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide">
              <CheckCircle2 className="mr-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} /> Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// FLUXO DE SEGUNDA RESPOSTA (3 Passos)
// ==========================================
function SegundaResposta({ setTelaAtual }) {
  const [step, setStep] = useState(1);
  const [dados, setDados] = useState({
    redsOrigem: '', contatoAutor: false, mpuVigente: false, riscoElevado: false, relacaoIntima: false, resumo: '',
    vitima: { nome: '', rg: '', cpf: '', nasc: '', telefone: '', mae: '', endereco: '' }
  });
  
  const [openPessoaIndex, setOpenPessoaIndex] = useState('vitima');
  const updateVitima = (field, val) => setDados({...dados, vitima: {...dados.vitima, [field]: val}});

  const textoReds2 = `=========================================
ATENDIMENTO DE 2ª RESPOSTA - VISITA TRANQUILIZADORA
=========================================
REDS de Origem: ${dados.redsOrigem || '[N/I]'}

[ DADOS DA VÍTIMA ]
Nome: ${dados.vitima.nome || '[N/I]'}
RG: ${dados.vitima.rg || '[N/I]'} | CPF: ${dados.vitima.cpf || '[N/I]'}
Data Nasc: ${dados.vitima.nasc || '[N/I]'}
Nome da Mãe: ${dados.vitima.mae || '[N/I]'}
Telefone: ${dados.vitima.telefone || '[N/I]'}
Endereço: ${dados.vitima.endereco || '[N/I]'}

[ SITUAÇÃO ATUAL ]
Novos contactos ou ameaças do autor? ${dados.contatoAutor ? 'SIM' : 'NÃO'}
MPU deferida e vigente? ${dados.mpuVigente ? 'SIM' : 'NÃO'}

[ SÍNTESE DA VISITA ]
${dados.resumo || '[NÃO INFORMADO]'}

[ TRIAGEM DA GUARNIÇÃO ]
${dados.riscoElevado 
  ? `-> Constatado RISCO ELEVADO in loco.\n-> Relação íntima: ${dados.relacaoIntima ? 'SIM' : 'NÃO'}.\n-> A P3 DEVE SER CIENTIFICADA PARA ENCAMINHAMENTO À RpPM (TERCEIRA RESPOSTA).` 
  : '-> Não foi constatado risco iminente. Vítima orientada a ligar 190 caso necessário.'}`;

  return (
    <div className="p-5 pb-24 print:p-0 print:pb-0">
      <ProgressBar step={step} total={3} labels={["Qualificação", "Visita", "Relatório"]} />
      
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Qualificação</h2>
            <p className="text-sm text-zinc-500 mt-1">Dados para a Vítima no sistema REDS.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Nº do REDS (Origem)</label>
              <input type="text" placeholder="Ex: 2026-000123456-001" className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition text-zinc-900 shadow-sm font-medium" 
                value={dados.redsOrigem} onChange={e => setDados({...dados, redsOrigem: e.target.value})} />
            </div>

            {/* ALERTA QAPP */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mt-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">Aviso de Segurança</span>
                <p className="text-sm leading-relaxed text-red-900 font-medium">
                  Consulte obrigatoriamente o <strong>QAPP / ISP</strong> para verificar a situação de todos os envolvidos e confirmar a existência de Mandados de Prisão em aberto.
                </p>
              </div>
            </div>

            <FormPessoaAccordion 
              title="Vítima" 
              isOpen={openPessoaIndex === 'vitima'} 
              onToggle={() => setOpenPessoaIndex(openPessoaIndex === 'vitima' ? null : 'vitima')}
              data={dados.vitima} 
              onChange={updateVitima} 
            />
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide mt-8">
            Avançar <ChevronRight className="ml-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Visita Tranquilizadora</h2>
            <p className="text-sm text-zinc-500 mt-1">2ª Resposta (Pós Emergência)</p>
          </div>
          
          <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <UserCheck className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5" strokeWidth={2} />
            <p className="text-sm leading-relaxed text-zinc-600 font-medium">
              A visita deve ser feita em até <strong className="text-zinc-900">72 horas</strong> após o facto. Chegue de forma discreta para proteger a vítima.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <CheckboxCard 
                label="O autor voltou a procurá-la/ameaçá-la?" 
                checked={dados.contatoAutor} onChange={e => setDados({...dados, contatoAutor: e.target.checked})} 
              />
              <CheckboxCard 
                label="O juiz já deferiu a Medida Protetiva?" 
                checked={dados.mpuVigente} onChange={e => setDados({...dados, mpuVigente: e.target.checked})} 
              />
            </div>

            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl space-y-4 shadow-sm mt-4">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} /> Triagem RpPM Especializada
              </p>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-red-900 leading-snug w-4/5">Você percebe RISCO ELEVADO de nova agressão?</span>
                <input type="checkbox" className="w-5 h-5 rounded border-red-300 text-red-500 focus:ring-red-500 bg-white" checked={dados.riscoElevado} onChange={e => setDados({...dados, riscoElevado: e.target.checked})} />
              </label>
              
              {dados.riscoElevado && (
                <div className="pt-4 border-t border-red-200/60 animate-in fade-in duration-300">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-bold text-red-800 leading-snug w-4/5">É relação íntima? (Marido, Namorado, Ex)</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-red-300 text-red-500 focus:ring-red-500 bg-white" checked={dados.relacaoIntima} onChange={e => setDados({...dados, relacaoIntima: e.target.checked})} />
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1 mt-2">Resumo da Visita</label>
              <textarea rows="3" className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition text-zinc-900 shadow-sm font-medium" 
                value={dados.resumo} onChange={e => setDados({...dados, resumo: e.target.value})}
                placeholder="Ex: A vítima encontra-se calma. Foi orientada a ligar 190 se o autor aparecer."></textarea>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(1)} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button onClick={() => setStep(3)} className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide">
              Gerar Relatório <ChevronRight className="ml-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="print:hidden">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Relatório Estruturado</h2>
            <p className="text-sm text-zinc-500 mt-1">Lista com os dados apurados para o REDS.</p>
          </div>
          
          {dados.riscoElevado && dados.relacaoIntima ? (
             <div className="bg-red-50 border border-red-100 p-6 rounded-2xl shadow-sm text-center print:hidden">
               <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-500 animate-pulse" strokeWidth={2} />
               <p className="font-black text-lg text-red-900 tracking-wide">Repassar à RpPM</p>
               <p className="text-sm mt-2 text-red-700 font-medium leading-relaxed">Alerte a P3 da sua Unidade. Este caso necessita do <strong className="font-bold">Protocolo de Terceira Resposta</strong>.</p>
             </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm text-center print:hidden">
               <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" strokeWidth={2} />
               <p className="font-black text-lg text-emerald-900 tracking-wide">Monitoramento Básico</p>
               <p className="text-sm mt-2 text-emerald-700 font-medium leading-relaxed">Finalize o REDS. A equipa multimissão voltará a fazer visitas se a P3 julgar necessário.</p>
             </div>
          )}

          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm mt-6 print:border-none print:shadow-none print:p-0" id="print-area-2">
            <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2 print:hidden">
              <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">Dados Estruturados</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                >
                  <Printer className="w-4 h-4 mr-1.5" strokeWidth={2} /> Imprimir
                </button>
                <button 
                  onClick={() => copyToClipboard(textoReds2)}
                  className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                >
                  <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                </button>
              </div>
            </div>
            <pre className="text-[11px] text-zinc-600 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-96 overflow-y-auto border border-zinc-100 leading-relaxed print:max-h-full print:bg-white print:border-none print:text-black print:text-[12px] print:overflow-visible">
              {textoReds2}
            </pre>
          </div>

          <div className="flex space-x-3 pt-4 print:hidden">
            <button onClick={() => setStep(2)} className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"><ChevronLeft className="w-6 h-6" strokeWidth={2} /></button>
            <button onClick={() => setTelaAtual('home')} className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide">
              <Save className="mr-2 w-5 h-5 text-yellow-500" strokeWidth={2.5} /> Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
