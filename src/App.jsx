import React, { useEffect, useId, useRef, useState } from "react";
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
  HelpCircle,
  MapPin,
  Phone,
  Clock3,
  HeartHandshake,
  ExternalLink,
  Mic,
  MicOff,
  ImagePlus,
} from "lucide-react";
import instrucaoPdf from "./documento/Instrução.pdf";
import capaHeaderImg from "./documento/Captura de tela 2026-04-05 194744.jpg";
import logoHeaderImg from "./documento/27.1- Logo Vetorizado CFO 2026 - MIV .png";
import fluxogramaImg from "./documento/fluxograma.jpg";

// --- SISTEMA DE TOAST (Substituto do alert) ---
const showToast = (message, type = "success") => {
  const event = new CustomEvent("show-toast", { detail: { message, type } });
  window.dispatchEvent(event);
};

function ToastContainer() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, []);

  if (!toast) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300"
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border flex items-center space-x-2 ${
          toast.type === "error"
            ? "bg-red-50 text-red-800 border-red-200"
            : "bg-emerald-50 text-emerald-800 border-emerald-200"
        }`}
      >
        {toast.type === "error" ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5" />
        )}
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
    ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "M"], // 0-2 sims
    ["B", "B", "B", "B", "B", "B", "B", "B", "M", "M", "M", "M"], // 3 sims
    ["B", "B", "B", "B", "M", "M", "M", "M", "M", "M", "M", "M"], // 4 sims
    ["M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "E", "M"], // 5 sims
    ["M", "M", "M", "M", "M", "M", "M", "M", "E", "E", "E", "M"], // 6 sims
    ["M", "M", "M", "M", "M", "M", "E", "E", "E", "E", "E", "M"], // 7 sims
    ["M", "M", "M", "M", "E", "E", "E", "E", "E", "E", "E", "M"], // 8 sims
    ["M", "M", "E", "E", "E", "E", "E", "E", "E", "E", "E", "M"], // 9 sims
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"], // 10-19 sims
  ];

  const resultado = matrix[getRow(simCount)][getCol(nsNaCount)];
  if (resultado === "B")
    return { nivel: "Baixo", cor: "bg-emerald-500", text: "text-emerald-700" };
  if (resultado === "M")
    return { nivel: "Médio", cor: "bg-yellow-500", text: "text-yellow-700" };
  return { nivel: "Elevado", cor: "bg-red-600", text: "text-red-700" };
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
  "O(A) agressor(a) está com dificuldades financeiras, desempregado ou não para em emprego?",
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
      document.execCommand("copy");
      textArea.remove();
      showToast("Copiado com sucesso para a área de transferência!");
    }
  } catch (err) {
    showToast(
      "Erro ao copiar o texto. Por favor, selecione e copie manualmente.",
      "error",
    );
  }
};

const fonteRedeApoioContagem =
  "https://portal.contagem.mg.gov.br/rede-de-protecao";

const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;
const DRAFT_STORAGE_KEYS = {
  fonar: "draft-fonar-avulso-v2",
  primeira: "draft-primeira-resposta-v2",
  segunda: "draft-segunda-resposta-v2",
};

const createEmptyPerson = () => ({
  nome: "",
  rg: "",
  cpf: "",
  nasc: "",
  telefone: "",
  mae: "",
  endereco: "",
});

const createInitialPrimeiraDados = () => ({
  vitima: createEmptyPerson(),
  autor: createEmptyPerson(),
  testemunhas: [],
  relacao: "",
  temFilhos: "",
  tempoRelacao: "",
  tempoSeparacao: "",
  residencia: "",
  enderecoGeolocalizado: "",
  localizacaoGps: "",
  ciumento: false,
  naoAceitaTermino: false,
  usoDrogas: "",
  arma: "",
  motivo: "",
  versaoVitima: "",
  versaoAutor: "",
  desordem: "",
  socorro: "",
  materiais: "",
  mpu: "",
  origemAcionamento: "",
  dataHoraFato: "",
  filhosDetalhe: "",
  lesoes: "",
  dizeresAutor: "",
  historicoNarrado: "",
  danos: "",
  provas: "",
  destinoVitima: "",
  destinoAutor: "",
  acompanhamento: "",
});

const createInitialSegundaDados = () => ({
  redsOrigem: "",
  fonarPreenchidoPrimeiraResposta: "",
  contatoAutor: false,
  mpuVigente: false,
  riscoElevado: false,
  relacaoIntima: false,
  resumo: "",
  dataHoraVisita: "",
  localVisita: "",
  vitimaLocalizada: "",
  formaContato: "",
  contextoOcorrenciaAnterior: "",
  estadoVitima: "",
  novoFato: "",
  descumprimentoMpu: false,
  localSeguro: "",
  apoioRede: "",
  encaminhamentoFinal: "",
  vitima: createEmptyPerson(),
});

const redeApoioContagem = [
  {
    categoria: "Emergência",
    destaque: "Acionamento imediato",
    itens: [
      { nome: "Polícia Militar", telefones: ["190"] },
      { nome: "Central de Atendimento à Mulher", telefones: ["180"] },
      { nome: "Polícia Civil", telefones: ["181"] },
      { nome: "Disque Direitos Humanos", telefones: ["100"] },
      {
        nome: "Guarda Civil de Contagem",
        endereco: "Rua Vereador David de Oliveira da Costa, 14, Fonte Grande, Contagem, MG",
        telefones: ["153"],
      },
    ],
  },
  {
    categoria: "Acolhimento e Proteção",
    destaque: "Encaminhamento social e abrigo",
    itens: [
      {
        nome: "CEAM Bem-Me-Quero",
        descricao:
          "Acolhe, orienta e encaminha mulheres em situação de violência doméstica e familiar.",
        endereco: "Rua José Carlos Camargos, 218, Centro, Contagem, MG",
        telefones: ["(31) 3392-2794", "(31) 3392-2726", "(31) 97306-4310"],
        horario: "Segunda a sexta, de 08h às 17h",
        observacao: "O número 97306-4310 é WhatsApp.",
      },
      {
        nome: "Abrigo Bela Vista",
        endereco: "Rua São Gotardo, 57, Bela Vista, Contagem, MG",
        telefones: [
          "(31) 3391-1774",
          "(31) 2564-2186",
          "(31) 3352-5337",
          "(31) 3353-3859",
        ],
      },
      {
        nome: "Secretaria Municipal da Mulher e da Juventude",
        endereco: "Avenida José Faria da Rocha, 1.016, 3º andar, Eldorado, Contagem, MG",
        telefones: ["(31) 3353-4188"],
      },
    ],
  },
  {
    categoria: "Rede Jurídica",
    destaque: "Providências policiais, judiciais e de proteção",
    itens: [
      {
        nome: "DEAM Contagem",
        descricao:
          "Delegacia especializada para crimes baseados no gênero e violência sexual, conforme a competência legal.",
        endereco: "Rua Capitão Antônio Joaquim da Paixão, 260, Centro, Contagem, MG",
        telefones: ["(31) 3204-1650"],
      },
      {
        nome: "NUDEM",
        descricao:
          "Núcleo da Defensoria Pública especializado na defesa dos direitos das mulheres.",
        endereco: "Rua Reginaldo de Souza Lima, 625, Centro, Contagem, MG",
        telefones: ["(31) 3390-2436", "(31) 3390-2466"],
      },
      {
        nome: "Ministério Público de Contagem",
        endereco: "Rua Capitão Antônio Joaquim da Paixão, 285, Centro, Contagem, MG",
        telefones: ["(31) 3398-9862", "(31) 3398-5775"],
      },
      {
        nome: "Fórum Doutor Pedro Aleixo",
        endereco: "Avenida Maria da Glória Rocha, 425, Centro, Contagem, MG",
        telefones: ["(31) 3399-8300"],
      },
      {
        nome: "Procuradoria da Mulher",
        endereco: "Praça São Gonçalo, 18, Centro, Contagem, MG",
        telefones: ["(31) 3359-8700"],
      },
    ],
  },
  {
    categoria: "Saúde",
    destaque: "Atendimento médico e materno-infantil",
    itens: [
      {
        nome: "Hospital Municipal / Centro Materno Infantil / Maternidade Municipal de Contagem",
        endereco: "Avenida João César de Oliveira, 4.495, Eldorado, Contagem, MG",
        telefones: ["(31) 3363-5300"],
      },
    ],
  },
  {
    categoria: "Crianças e Adolescentes",
    destaque: "Casos envolvendo filhos, guarda ou risco infantojuvenil",
    itens: [
      {
        nome: "Conselho Tutelar - Plantão pela Guarda Civil",
        descricao:
          "Os Conselhos Tutelares funcionam de segunda a sexta, das 08h às 17h. Fora do horário, o plantão é acessado pelo 153.",
        telefones: ["153"],
      },
      {
        nome: "Conselho Tutelar Eldorado",
        endereco: "Rua Sevilha, 55, Santa Cruz Industrial, Contagem, MG",
        telefones: ["(31) 3396-3572", "(31) 97513-0030"],
      },
      {
        nome: "Conselho Tutelar Industrial",
        endereco: "Rua Rodolfo Jacob, 180, Industrial, Contagem, MG",
        telefones: ["(31) 3361-3413", "(31) 97306-3565"],
      },
      {
        nome: "Conselho Tutelar Nacional",
        endereco: "Rua Quintino Bocaiuva, 1036, Pedra Azul, Contagem, MG",
        telefones: ["(31) 3352-5614", "(31) 97506-4262"],
      },
      {
        nome: "Conselho Tutelar Petrolândia",
        endereco: "Rua Ipiranga, 08, Petrolândia, Contagem, MG",
        telefones: ["(31) 3352-5755", "(31) 97306-5624"],
      },
      {
        nome: "Conselho Tutelar Ressaca",
        endereco: "Rua Monsenhor João Martins, 2121, Novo Progresso, Contagem, MG",
        telefones: ["(31) 3352-5602", "(31) 97306-1353"],
      },
      {
        nome: "Conselho Tutelar Sede",
        endereco: "Rua Lincoln Costa Ferreira, 241, Fonte Grande, Contagem, MG",
        telefones: ["(31) 3398-7342", "(31) 3398-7520", "(31) 97306-2184"],
      },
      {
        nome: "Conselho Tutelar Vargem das Flores",
        endereco: "Avenida Retiro dos Imigrantes, 1137, Retiro, Contagem, MG",
        telefones: ["(31) 3352-5476", "(31) 3911-7032", "(31) 97306-5415"],
      },
    ],
  },
  {
    categoria: "Apoio Complementar",
    destaque: "Serviços úteis conforme o caso",
    itens: [
      {
        nome: "Conselho Municipal da Mulher de Contagem",
        endereco: "Rua José Carlos Camargos, 218, Centro, Contagem, MG",
        telefones: ["(31) 3352-2726"],
      },
      {
        nome: "Mulheres das Gerais",
        endereco: "Rua Pernambuco, 1002, sala 1102, Savassi, Belo Horizonte, MG",
        telefones: ["(31) 3484-2387"],
      },
      {
        nome: "CEAPA",
        descricao:
          "Programa estadual ligado a alternativas penais, inclusive responsabilização de autores de violência contra a mulher.",
        endereco: "Rua José da Costa Ferreira, 68, Alvorada, Contagem, MG",
        telefones: ["(31) 3390-1465"],
      },
      {
        nome: "Mediação de Conflitos - Nova Contagem",
        endereco: "Rua VP-1, 1516, 2º andar, Nova Contagem, Contagem, MG",
        telefones: ["(31) 3392-8039"],
      },
      {
        nome: "Mediação de Conflitos - Ressaca",
        endereco: "Rua Iguaçaba, 115, Vila Pérola, Contagem, MG",
        telefones: ["(31) 3357-7579"],
      },
    ],
  },
];

const resumoRedeApoio = redeApoioContagem
  .flatMap((secao) =>
    secao.itens.map((item) => {
      const partes = [item.nome];
      if (item.endereco) partes.push(item.endereco);
      if (item.telefones?.length) {
        partes.push(`Telefones: ${item.telefones.join(" / ")}`);
      }
      return partes.join(" - ");
    }),
  )
  .join("\n");

function RedeApoioCards() {
  return (
    <div className="space-y-5">
      {redeApoioContagem.map((secao) => (
        <section key={secao.categoria} className="space-y-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-950 px-4 py-3 text-white shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-yellow-400">
              {secao.destaque}
            </p>
            <h3 className="mt-1 text-base font-black tracking-wide">
              {secao.categoria}
            </h3>
          </div>

          {secao.itens.map((item) => (
            <div
              key={item.nome}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <h4 className="text-sm font-black text-zinc-900">{item.nome}</h4>

              {item.descricao && (
                <p className="mt-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium leading-relaxed text-zinc-700">
                  {item.descricao}
                </p>
              )}

              <div className="mt-3 space-y-2 text-sm text-zinc-700">
                {item.endereco && (
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span>{item.endereco}</span>
                  </p>
                )}

                {item.telefones?.length > 0 && (
                  <p className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span>{item.telefones.join(" / ")}</span>
                  </p>
                )}

                {item.horario && (
                  <p className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span>{item.horario}</span>
                  </p>
                )}

                {item.observacao && (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                    {item.observacao}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function RedeApoioScreen() {
  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">
          Rede de Apoio
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Contatos úteis para encaminhamento em Contagem.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-700">
              Conferência realizada
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-amber-900">
              Os dados abaixo foram consolidados com base na página oficial
              atual da Prefeitura de Contagem.
            </p>
            <a
              href={fonteRedeApoioContagem}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100"
            >
              Fonte oficial
              <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      <RedeApoioCards />

      <button
        onClick={() => copyToClipboard(resumoRedeApoio)}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-bold text-zinc-800 shadow-sm transition-colors hover:bg-zinc-100"
      >
        <Copy className="mr-2 h-4 w-4" strokeWidth={2} />
        Copiar rede de apoio
      </button>
    </div>
  );
}

const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Arquivo TXT gerado com sucesso.");
};

const formatFileSize = (size) => {
  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao ler imagem."));
    reader.readAsDataURL(file);
  });

const createSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  return Recognition ? new Recognition() : null;
};

const formatCoordinatesLabel = (latitude, longitude, accuracy) => {
  const latitudeText = Number(latitude).toFixed(6);
  const longitudeText = Number(longitude).toFixed(6);
  const accuracyText = Number.isFinite(accuracy)
    ? `Precisão aprox.: ${Math.round(accuracy)} m`
    : "Precisão não informada";
  return `GPS: ${latitudeText}, ${longitudeText} | ${accuracyText}`;
};

const formatReverseGeocodeAddress = (payload) => {
  const address = payload?.address || {};
  const line1 = [
    address.road,
    address.house_number,
    address.neighbourhood || address.suburb,
  ]
    .filter(Boolean)
    .join(", ");
  const line2 = [
    address.city || address.town || address.village || address.municipality,
    address.state,
  ]
    .filter(Boolean)
    .join(" - ");
  const formatted = [line1, line2].filter(Boolean).join(" | ");
  return formatted || payload?.display_name || "";
};

const reverseGeocodeCoordinates = async (latitude, longitude) => {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "pt-BR");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao consultar o endereço.");
  }

  const payload = await response.json();
  return {
    displayName: payload?.display_name || "",
    formattedAddress: formatReverseGeocodeAddress(payload),
  };
};

const waitForImagesAndPrint = async (elementId) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const container = document.getElementById(elementId);
  if (!container) {
    window.print();
    return;
  }

  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        }),
    ),
  );

  window.print();
};

const optimizeImageForDraft = (dataUrl, maxWidth = 1280, quality = 0.82) =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(dataUrl);
      return;
    }

    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");

      if (!context) {
        resolve(dataUrl);
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });

const getFonarRespostaLabel = (value) => {
  if (value === "sim") return "SIM";
  if (value === "nao") return "NÃO";
  if (value === "nsna") return "NÃO SABE / N/A";
  return "NÃO INFORMADO";
};

const fieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-white p-3.5 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-400";

const compactFieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-sm font-medium text-zinc-900 outline-none transition focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-400";

const buttonFocusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50";

function ValidationMessage({ message, tone = "warning" }) {
  const toneClasses =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed ${toneClasses}`}
      role="status"
    >
      {message}
    </div>
  );
}

class ScreenErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Erro inesperado ao renderizar a tela.",
    };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-700">
              Erro na tela
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-red-900">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={this.props.onReset}
              className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-900"
            >
              Voltar ao menu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function FonarQuestionCard({ pergunta, idx, value, onChange }) {
  const questionId = `fonar-pergunta-${idx}`;
  const options = [
    {
      value: "sim",
      label: "Sim",
      active: "bg-red-500 text-white shadow-md ring-2 ring-red-500/20",
    },
    {
      value: "nao",
      label: "Não",
      active: "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500/20",
    },
    {
      value: "nsna",
      label: "NS / NA",
      active: "bg-zinc-700 text-white shadow-md ring-2 ring-zinc-700/20",
    },
  ];

  return (
    <fieldset
      className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 ${
        value === "sim"
          ? "border-red-200 bg-red-50/50"
          : value === "nao"
            ? "border-emerald-200 bg-emerald-50/50"
            : value === "nsna"
              ? "border-zinc-200 bg-zinc-100"
              : "border-zinc-200 bg-white"
      }`}
      aria-labelledby={questionId}
    >
      <legend
        id={questionId}
        className="mb-3.5 text-[13px] font-bold leading-snug text-zinc-800"
      >
        <span className="mr-1.5 font-black text-yellow-600">{idx + 1}.</span>
        {pergunta}
      </legend>

      <div
        className="grid grid-cols-3 gap-2.5"
        role="radiogroup"
        aria-labelledby={questionId}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all active:scale-[0.97] ${buttonFocusClassName} ${
                isSelected
                  ? option.active
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const digitsOnly = (value = "") => value.replace(/\D/g, "");

const normalizeInlineText = (value = "") =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s*([,.;:!?/()-])\s*/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeMultilineText = (value = "") =>
  value
    .split("\n")
    .map((line) => normalizeInlineText(line))
    .filter(Boolean)
    .join("\n");

const normalizeCpf = (value = "") => {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "";
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

const normalizePhone = (value = "") => {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const normalizeDate = (value = "") => {
  const digits = digitsOnly(value).slice(0, 8);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const normalizeDateTime = (value = "") => {
  const digits = digitsOnly(value).slice(0, 12);
  if (!digits) return "";
  if (digits.length <= 8) return normalizeDate(digits);
  const date = normalizeDate(digits.slice(0, 8));
  const timeDigits = digits.slice(8);
  if (timeDigits.length <= 2) return `${date} ${timeDigits}`;
  return `${date} ${timeDigits.slice(0, 2)}:${timeDigits.slice(2, 4)}`;
};

const normalizeReds = (value = "") => {
  const digits = digitsOnly(value).slice(0, 16);
  if (!digits) return "";
  if (digits.length <= 4) return digits;
  if (digits.length <= 13) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 13)}-${digits.slice(13)}`;
};

const normalizeRg = (value = "") =>
  value
    .toUpperCase()
    .replace(/[^0-9A-Z.\-\/\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const validateCpf = (value = "") => {
  const digits = digitsOnly(value);
  if (!digits) return true;
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(digits[10]);
};

const validateDate = (value = "") => {
  if (!value) return true;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const validateDateTime = (value = "") => {
  if (!value) return true;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if (!match) return false;
  const [, dd, mm, yyyy, hh, mi] = match;
  if (!validateDate(`${dd}/${mm}/${yyyy}`)) return false;
  const hour = Number(hh);
  const minute = Number(mi);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

const parseDateTime = (value = "") => {
  if (typeof value !== "string" || !validateDateTime(value)) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, dd, mm, yyyy, hh, mi] = match;
  return new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    Number(hh),
    Number(mi),
  );
};

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(date);

const validatePhone = (value = "") => {
  const digits = digitsOnly(value);
  return !digits || digits.length === 10 || digits.length === 11;
};

const validateRg = (value = "") => {
  if (!value) return true;
  return /^[0-9A-Z.\-\/\s]{5,20}$/.test(value);
};

const validateReds = (value = "") =>
  !value || /^\d{4}-\d{9}-\d{3}$/.test(value);

const readDraft = (storageKey) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
};

const saveDraft = (storageKey, payload) => {
  if (typeof window === "undefined") return;
  try {
    const savedAt = Date.now();
    const draft = {
      ...payload,
      savedAt,
      expiresAt: savedAt + DRAFT_TTL_MS,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // Silently ignore quota or storage issues.
  }
};

const clearDraft = (storageKey) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
};

const sanitizeStep = (value, min, max) => {
  const numericValue = Number(value);
  if (!Number.isInteger(numericValue)) return min;
  if (numericValue < min || numericValue > max) return min;
  return numericValue;
};

const sanitizeTelaAtual = (value) => {
  const telasValidas = new Set([
    "capa",
    "home",
    "primeira",
    "segunda",
    "fonar",
    "guia_legal",
    "naturezas",
    "rede_apoio",
    "modelos",
    "faq",
    "fluxograma",
  ]);
  return telasValidas.has(value) ? value : "capa";
};

const getLatestDraft = () =>
  Object.entries(DRAFT_STORAGE_KEYS)
    .map(([flow, storageKey]) => {
      const draft = readDraft(storageKey);
      return draft ? { flow, storageKey, draft } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.draft.savedAt - a.draft.savedAt)[0] || null;

const normalizePerson = (person = createEmptyPerson()) => ({
  nome: normalizeInlineText(person?.nome),
  rg: normalizeRg(person?.rg),
  cpf: normalizeCpf(person?.cpf),
  nasc: normalizeDate(person?.nasc),
  telefone: normalizePhone(person?.telefone),
  mae: normalizeInlineText(person?.mae),
  endereco: normalizeMultilineText(person?.endereco),
});

const validatePerson = (person, label) => {
  const safePerson = person || createEmptyPerson();
  const errors = [];
  if (!validateRg(safePerson.rg)) errors.push(`${label}: RG inválido.`);
  if (!validateCpf(safePerson.cpf)) errors.push(`${label}: CPF inválido.`);
  if (!validateDate(safePerson.nasc))
    errors.push(`${label}: data de nascimento inválida (use DD/MM/AAAA).`);
  if (!validatePhone(safePerson.telefone))
    errors.push(`${label}: telefone inválido.`);
  return errors;
};

const normalizePrimeiraDados = (dados) => ({
  ...dados,
  vitima: normalizePerson(dados?.vitima),
  autor: normalizePerson(dados?.autor),
  testemunhas: Array.isArray(dados?.testemunhas)
    ? dados.testemunhas.map(normalizePerson)
    : [],
  relacao: normalizeInlineText(dados?.relacao),
  temFilhos: normalizeInlineText(dados?.temFilhos),
  tempoRelacao: normalizeInlineText(dados?.tempoRelacao),
  tempoSeparacao: normalizeInlineText(dados?.tempoSeparacao),
  residencia: normalizeInlineText(dados?.residencia),
  enderecoGeolocalizado: normalizeInlineText(dados?.enderecoGeolocalizado),
  localizacaoGps: normalizeInlineText(dados?.localizacaoGps),
  usoDrogas: normalizeInlineText(dados?.usoDrogas),
  arma: normalizeInlineText(dados?.arma),
  motivo: normalizeInlineText(dados?.motivo),
  versaoVitima: normalizeMultilineText(dados?.versaoVitima),
  versaoAutor: normalizeMultilineText(dados?.versaoAutor),
  desordem: normalizeInlineText(dados?.desordem),
  socorro: normalizeInlineText(dados?.socorro),
  materiais: normalizeInlineText(dados?.materiais),
  mpu: normalizeInlineText(dados?.mpu),
  origemAcionamento: normalizeInlineText(dados?.origemAcionamento),
  dataHoraFato: normalizeDateTime(dados?.dataHoraFato),
  filhosDetalhe: normalizeInlineText(dados?.filhosDetalhe),
  lesoes: normalizeInlineText(dados?.lesoes),
  dizeresAutor: normalizeMultilineText(dados?.dizeresAutor),
  historicoNarrado: normalizeMultilineText(dados?.historicoNarrado),
  danos: normalizeInlineText(dados?.danos),
  provas: normalizeInlineText(dados?.provas),
  destinoVitima: normalizeInlineText(dados?.destinoVitima),
  destinoAutor: normalizeInlineText(dados?.destinoAutor),
  acompanhamento: normalizeInlineText(dados?.acompanhamento),
});

const normalizeSegundaDados = (dados) => ({
  ...dados,
  redsOrigem: normalizeReds(dados?.redsOrigem),
  dataHoraVisita: normalizeDateTime(dados?.dataHoraVisita),
  localVisita: normalizeInlineText(dados?.localVisita),
  vitimaLocalizada: normalizeInlineText(dados?.vitimaLocalizada),
  formaContato: normalizeInlineText(dados?.formaContato),
  contextoOcorrenciaAnterior: normalizeMultilineText(
    dados?.contextoOcorrenciaAnterior,
  ),
  estadoVitima: normalizeInlineText(dados?.estadoVitima),
  novoFato: normalizeInlineText(dados?.novoFato),
  localSeguro: normalizeInlineText(dados?.localSeguro),
  apoioRede: normalizeInlineText(dados?.apoioRede),
  encaminhamentoFinal: normalizeMultilineText(dados?.encaminhamentoFinal),
  resumo: normalizeMultilineText(dados?.resumo),
  vitima: normalizePerson(dados?.vitima),
});

const buildFonarText = (fonar, observacoes = "") => {
  const simCount = fonar.filter((a) => a === "sim").length;
  const nsNaCount = fonar.filter((a) => a === "nsna").length;
  const risco = calcularRisco(simCount, nsNaCount);

  let respostasTexto = "";
  perguntasFonar.forEach((pergunta, index) => {
    respostasTexto += `${index + 1}. ${pergunta}\n-> R: ${getFonarRespostaLabel(fonar[index])}\n\n`;
  });

  return `=========================================
FONAR AVULSO - AVALIAÇÃO DE RISCO
=========================================
Risco Calculado: ${risco.nivel.toUpperCase()}
(Respostas SIM: ${simCount} | Respostas NS/NA: ${nsNaCount})

Respostas Detalhadas:
${respostasTexto.trim()}

Observações Complementares:
${normalizeMultilineText(observacoes) || "[NÃO INFORMADO]"}`;
};

export default function App() {
  const [telaAtual, setTelaAtual] = useState("capa");

  useEffect(() => {
    const latestDraft = getLatestDraft();
    if (!latestDraft) return;
    if (latestDraft.draft?.telaAtual) {
      setTelaAtual(sanitizeTelaAtual(latestDraft.draft.telaAtual));
      showToast("Rascunho local restaurado.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center font-sans text-zinc-900 selection:bg-yellow-200">
      <ToastContainer />
      <div className="w-full max-w-md bg-zinc-50 shadow-2xl flex flex-col relative overflow-hidden print:shadow-none print:max-w-none print:bg-white">
        {/* Header Institucional PMMG (Padrão Intranet) */}
        {telaAtual !== "capa" && (
          <div className="bg-zinc-950 text-white p-4 py-0 flex items-center justify-between z-10 border-b-[3px] border-yellow-500 shadow-sm print:hidden">
            <div className="flex items-center space-x-4">
              <img
                src={logoHeaderImg}
                alt="Logo PMMG"
                className="h-[130px] w-[230px] object-contain"
              />

              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="font-black text-[2rem] leading-none tracking-[0.04em]">
                  PMMG
                </h1>
                <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.24em] mt-1.5">
                  Apoio Multimissão
                </span>
              </div>
            </div>
            {telaAtual !== "home" && (
              <button
                onClick={() => setTelaAtual("home")}
                className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors bg-zinc-900 border border-zinc-800 group"
              >
                <Home
                  className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors"
                  strokeWidth={2}
                />
              </button>
            )}
          </div>
        )}

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 print:overflow-visible print:bg-white">
          {telaAtual === "capa" && <CoverScreen setTelaAtual={setTelaAtual} />}
          {telaAtual === "home" && <HomeScreen setTelaAtual={setTelaAtual} />}
          {telaAtual === "primeira" && (
            <ScreenErrorBoundary
              onReset={() => {
                clearDraft(DRAFT_STORAGE_KEYS.primeira);
                setTelaAtual("home");
              }}
            >
              <PrimeiraResposta setTelaAtual={setTelaAtual} />
            </ScreenErrorBoundary>
          )}
          {telaAtual === "segunda" && (
            <SegundaResposta setTelaAtual={setTelaAtual} />
          )}
          {telaAtual === "fonar" && <FonarAvulso setTelaAtual={setTelaAtual} />}
          {telaAtual === "guia_legal" && <GuiaCrimes />}
          {telaAtual === "naturezas" && <NaturezasScreen />}
          {telaAtual === "rede_apoio" && <RedeApoioScreen />}
          {telaAtual === "modelos" && <ModelosReds />}
          {telaAtual === "faq" && <FaqScreen />}
          {telaAtual === "fluxograma" && <FluxogramaScreen />}
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
            alt="Cabeçalho do guia de violência doméstica"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="bg-white px-8 pb-10 pt-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-[1.95rem] font-black uppercase leading-[0.98] tracking-[-0.03em] text-zinc-950">
                Guia Operacional De Violência Doméstica
              </h1>
              <p className="mx-auto max-w-[16rem] text-sm font-medium uppercase tracking-[0.18em] text-[#b99749]">
                Consulta operacional rápida
              </p>
            </div>

            <div className="pt-2 flex w-full flex-col gap-4">
              <button
                onClick={() => setTelaAtual("home")}
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
              <button
                onClick={() => setTelaAtual("fluxograma")}
                className="inline-flex w-full items-center justify-center rounded-[1.15rem] border border-zinc-300 bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-zinc-700 shadow-sm transition-colors hover:border-[#b79d4f] hover:bg-[#fff8e7]"
              >
                <ClipboardList className="mr-2 h-4 w-4" strokeWidth={2} />
                Ver Fluxograma
              </button>
            </div>

            <p className="mx-auto max-w-sm text-xs leading-6 text-zinc-400">
              Ferramenta de apoio operacional. Não substitui sistemas oficiais,
              procedimentos legais, normas institucionais ou validação humana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FluxogramaScreen() {
  return (
    <div className="p-4 pb-24 animate-in fade-in duration-300 print:hidden">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Fluxograma de Atendimento
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Visualização rápida para consulta no celular.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm">
        <a
          href={fluxogramaImg}
          target="_blank"
          rel="noreferrer"
          className="block"
        >
          <img
            src={fluxogramaImg}
            alt="Fluxograma de atendimento"
            className="w-full rounded-xl border border-zinc-100"
          />
        </a>
      </div>

      <p className="text-xs text-zinc-500 mt-3 text-center">
        Toque na imagem para abrir em tamanho maior.
      </p>
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
          <h2 className="font-bold text-zinc-800 text-sm tracking-wide">
            IN 3.05.015/2026
          </h2>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Guia operacional para atendimento em violência doméstica. Selecione
            a fase do atendimento ou consulte as tipificações e manuais.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={instrucaoPdf}
              download="Instrução.pdf"
              className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors hover:bg-yellow-50 hover:text-zinc-900"
            >
              <FileText className="mr-2 h-4 w-4" strokeWidth={2} />
              Baixar instrução em PDF
            </a>
            <button
              onClick={() => setTelaAtual("fluxograma")}
              className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors hover:bg-yellow-50 hover:text-zinc-900"
            >
              <ClipboardList className="mr-2 h-4 w-4" strokeWidth={2} />
              Ver fluxograma
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Botão 1ª Resposta */}
        <button
          onClick={() => {
            clearDraft(DRAFT_STORAGE_KEYS.primeira);
            setTelaAtual("primeira");
          }}
          className="w-full bg-zinc-950 hover:bg-zinc-800 text-white p-5 rounded-2xl flex items-center shadow-md transition-all active:scale-[0.98] border border-zinc-800 group"
        >
          <div className="bg-zinc-800/50 p-3.5 rounded-xl mr-4 group-hover:bg-yellow-500/10 transition-colors">
            <AlertTriangle
              className="w-7 h-7 text-yellow-500"
              strokeWidth={1.5}
            />
          </div>
          <div className="text-left flex-1">
            <span className="font-black text-lg block tracking-wide">
              1ª Resposta
            </span>
            <span className="text-xs text-zinc-400 mt-0.5 block font-medium">
              Ocorrência de emergência no local
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-yellow-500" />
        </button>

        {/* Botão 2ª Resposta */}
        <button
          onClick={() => setTelaAtual("segunda")}
          className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-5 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
        >
          <div className="bg-zinc-100 p-3.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
            <ClipboardList
              className="w-7 h-7 text-zinc-700"
              strokeWidth={1.5}
            />
          </div>
          <div className="text-left flex-1">
            <span className="font-black text-lg block tracking-wide">
              2ª Resposta
            </span>
            <span className="text-xs text-zinc-500 mt-0.5 block font-medium">
              Visita Tranquilizadora (Até 72h)
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500" />
        </button>

        <button
          onClick={() => setTelaAtual("fonar")}
          className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-5 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
        >
          <div className="bg-zinc-100 p-3.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
            <ShieldAlert
              className="w-7 h-7 text-zinc-700"
              strokeWidth={1.5}
            />
          </div>
          <div className="text-left flex-1">
            <span className="font-black text-lg block tracking-wide">
              FONAR Avulso
            </span>
            <span className="text-xs text-zinc-500 mt-0.5 block font-medium">
              Avaliação de risco fora da 1ª e 2ª resposta
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500" />
        </button>

        <div className="pt-2">
          <div className="border-t border-zinc-200 w-16 mx-auto mb-4"></div>
        </div>

        {/* Grupo de Botões de Consulta */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setTelaAtual("guia_legal")}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <BookOpen className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">
                Tipificações (Crimes)
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">
                Guia rápido de enquadramento
              </span>
            </div>
          </button>

          <button
            onClick={() => setTelaAtual("naturezas")}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <ClipboardList className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">
                Naturezas REDS
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">
                Consulta rápida das naturezas da instrução
              </span>
            </div>
          </button>

          <button
            onClick={() => setTelaAtual("rede_apoio")}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <HeartHandshake
                className="w-6 h-6 text-zinc-700"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">
                Rede de Apoio
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">
                Contatos úteis oficiais de Contagem
              </span>
            </div>
          </button>

          <button
            onClick={() => setTelaAtual("modelos")}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <FileText className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">
                Modelos de REDS
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">
                Anexos oficiais da Instrução
              </span>
            </div>
          </button>

          <button
            onClick={() => setTelaAtual("faq")}
            className="w-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 p-4 rounded-2xl flex items-center shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className="bg-zinc-100 p-2.5 rounded-xl mr-4 group-hover:bg-zinc-200 transition-colors">
              <HelpCircle className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
            </div>
            <div className="text-left flex-1">
              <span className="font-black text-[15px] block tracking-wide">
                Perguntas Frequentes
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block font-medium">
                FAQ da atuação policial em VDF
              </span>
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
  {
    p: "1. O que é a Primeira Resposta?",
    r: "Atendimento imediato no local: cessar agressão, proteger vítima, conter autor, formalizar REDS, preencher FONAR e adotar medidas legais cabíveis.",
  },
  {
    p: "2. Quais providências compõem a 1ª Resposta?",
    r: "Preservar a vítima, interromper a violência, qualificar partes, registar REDS, preencher FONAR e conduzir em flagrante, se aplicável.",
  },
  {
    p: "3. O que é a Segunda Resposta?",
    r: "Visita tranquilizadora pós-ocorrência para reavaliar risco, orientar a vítima e reforçar a presença da Polícia Militar.",
  },
  {
    p: "4. Quem faz a Segunda Resposta?",
    r: "Equipa de Radiopatrulha Multimissão, preferencialmente a mesma que atendeu a ocorrência inicial (evitando revitimização).",
  },
  {
    p: "5. Qual o prazo para a 2ª Resposta?",
    r: "A visita deve ser feita em até 72 horas após a ocorrência inicial.",
  },
  {
    p: "6. O que verificar na 2ª Resposta?",
    r: "Novas ameaças, contactos do autor, quebras de MPU, risco atual e a necessidade de acionar a RpPM (3ª Resposta).",
  },
  {
    p: "7. O que é a Terceira Resposta?",
    r: "Acompanhamento especializado e contínuo para casos de maior risco, voltado a parceiros íntimos.",
  },
  {
    p: "8. Quem executa a Terceira Resposta?",
    r: "Regra geral: Radiopatrulha de Proteção à Mulher (RpPM). Na sua ausência, equipa Multimissão devidamente instruída.",
  },
  {
    p: "9. Qual a duração da Terceira Resposta?",
    r: "Acompanhamento estruturado com duração de até 90 dias.",
  },
  {
    p: "10. Em quanto tempo inicia a 3ª Resposta?",
    r: "A primeira visita deve ocorrer no prazo de até 7 dias após a seleção/triagem do caso.",
  },
  {
    p: "11. Quantas visitas tem a 3ª Resposta?",
    r: "6 visitas sequenciais: inclusão da vítima, notificação do autor, testemunhas, e monitorização até ao encerramento.",
  },
  {
    p: "12. Que casos vão para a 3ª Resposta?",
    r: "Alto risco no FONAR, violência grave/reiterada, risco associado à MPU, e casos onde vítima ou autor seja Policial Militar.",
  },
  {
    p: "13. Cabe TCO em violência doméstica?",
    r: "NÃO. É vedado o TCO. Regista-se sempre o REDS e conduz-se em caso de flagrante.",
  },
  {
    p: "14. Qual a postura ideal da guarnição?",
    r: "Técnica, segura e humanizada. Ouvir vítima e autor em separado, sem emitir julgamentos e focando na clareza dos factos.",
  },
  {
    p: "15. O FONAR é obrigatório?",
    r: "SIM. É um instrumento essencial da 1ª Resposta para definir o grau de risco e a necessidade de acompanhamento futuro.",
  },
  {
    p: "16. Devo verificar a existência de MPU?",
    r: "SIM, desde o primeiro atendimento. A existência de MPU ativa altera o risco e as providências a tomar.",
  },
  {
    p: "17. Como agir perante quebra de MPU?",
    r: "É uma infração muito grave (Art. 24-A). É passível de prisão em flagrante imediata no local.",
  },
  {
    p: "18. O que é obrigatório no REDS?",
    r: "Relação das partes, histórico, existência de MPU, armas, drogas/álcool, contexto exato e a presença de crianças no local.",
  },
  {
    p: "19. Crianças podem ser testemunhas?",
    r: "NÃO, como formais. A presença delas é apenas considerada na análise de risco. Anote revelações espontâneas.",
  },
  {
    p: "20. A fala momentânea da vítima basta?",
    r: "NÃO. Devido ao ciclo da violência (fase 'lua de mel'), a vítima pode minimizar o ato. Analise o conjunto dos factos objetivos.",
  },
  {
    p: "21. A lei ampara mulheres trans e travestis?",
    r: "SIM. A proteção aplica-se integralmente a mulheres trans, travestis e a relacionamentos homoafetivos femininos.",
  },
  {
    p: "22. Qual o resumo essencial para o PM?",
    r: "Separar as partes, avaliar risco (FONAR), registar REDS completo, lembrar que não cabe TCO, e definir a 2ª ou 3ª Resposta.",
  },
];

const naturezasData = [
  {
    grupo: "1ª Resposta",
    codigo: "U 33.004",
    titulo: "Atendimento de denúncia de infrações contra a mulher",
    categoria: "Natureza Secundária",
    explicacao:
      "Usada para marcar o contexto de violência doméstica no REDS. Na 1ª resposta, não deve substituir a natureza principal do fato.",
    quandoUsar:
      "Na 1ª resposta, entra como natureza secundária. A natureza principal deve seguir o fato principal conforme a DIAO.",
  },
  {
    grupo: "2ª Resposta",
    codigo: "A 20.002",
    titulo: "Visita tranquilizadora para vítima de violência doméstica",
    categoria: "2ª Resposta",
    explicacao:
      "Natureza principal da visita tranquilizadora realizada em até 72 horas após a ocorrência inicial.",
    quandoUsar:
      "Na 2ª resposta, inclusive quando a vítima não for localizada e o histórico consignar a tentativa sem êxito.",
  },
  {
    grupo: "2ª Resposta",
    codigo: "U 33.004",
    titulo: "Atendimento de denúncia de infrações contra a mulher",
    categoria: "Natureza Secundária",
    explicacao:
      "Na visita tranquilizadora, permanece como natureza secundária para marcar o contexto de violência doméstica.",
    quandoUsar:
      "Na 2ª resposta, junto da A 20.002 no REDS.",
  },
  {
    grupo: "1ª Resposta",
    codigo: "G 02.024",
    titulo: "Descumprimento de medida protetiva de urgência",
    categoria: "Providência Penal",
    explicacao:
      "Natureza principal para os casos em que há violação da MPU, com necessidade de providências imediatas.",
    quandoUsar:
      "Na 1ª resposta, sempre que houver descumprimento de medida protetiva devidamente constatado.",
  },
];

function FaqScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          FAQ / Dúvidas Frequentes
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Atendimento policial em ocorrência de VDF.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mb-6">
        <MessageCircleQuestion
          className="w-5 h-5 flex-shrink-0 text-zinc-700 mt-0.5"
          strokeWidth={2}
        />
        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
          Dúvidas rápidas baseadas no material de instrução sobre os três níveis
          de atuação e posturas legais.
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white border ${isOpen ? "border-yellow-400 shadow-md ring-1 ring-yellow-400/20" : "border-zinc-200 shadow-sm"} rounded-2xl overflow-hidden transition-all duration-200`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`crime-detalhe-${idx}`}
                className={`w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors ${buttonFocusClassName}`}
              >
                <div className="pr-4">
                  <h3
                    className={`font-bold text-[14px] leading-tight ${isOpen ? "text-zinc-900" : "text-zinc-800"}`}
                  >
                    {faq.p}
                  </h3>
                </div>
                <div
                  className={`p-2 rounded-xl flex-shrink-0 transition-colors ${isOpen ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-500"}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.5}
                  />
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

function NaturezasScreen() {
  const [filtro, setFiltro] = useState("1ª Resposta");
  const [openIndex, setOpenIndex] = useState(0);
  const naturezasFiltradas = naturezasData.filter(
    (item) => item.grupo === filtro,
  );

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Consulta Rápida de Naturezas
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Resumo operacional das naturezas mais úteis para a 1ª e a 2ª resposta.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mb-6">
        <ClipboardList
          className="w-5 h-5 flex-shrink-0 text-zinc-700 mt-0.5"
          strokeWidth={2}
        />
        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
          Use esta tela para confirmar rapidamente qual natureza aplicar e em que momento do protocolo ela costuma aparecer.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {["1ª Resposta", "2ª Resposta"].map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              setFiltro(item);
              setOpenIndex(0);
            }}
            className={`rounded-2xl border px-4 py-3 text-sm font-black transition-colors ${buttonFocusClassName} ${
              filtro === item
                ? "border-yellow-400 bg-yellow-50 text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {naturezasFiltradas.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.codigo}
              className={`bg-white border ${isOpen ? "border-yellow-400 shadow-md ring-1 ring-yellow-400/20" : "border-zinc-200 shadow-sm"} rounded-2xl overflow-hidden transition-all duration-200`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`natureza-detalhe-${idx}`}
                className={`w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors ${buttonFocusClassName}`}
              >
                <div className="pr-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                    {item.categoria}
                  </p>
                  <h3
                    className={`font-bold text-[14px] leading-tight ${isOpen ? "text-zinc-900" : "text-zinc-800"}`}
                  >
                    {item.codigo} - {item.titulo}
                  </h3>
                </div>
                <div
                  className={`p-2 rounded-xl flex-shrink-0 transition-colors ${isOpen ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-500"}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`natureza-detalhe-${idx}`}
                  className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="border-t border-zinc-100 pt-3 space-y-3">
                    <p className="text-zinc-700 text-[13px] leading-relaxed font-medium">
                      {item.explicacao}
                    </p>
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
                        Quando usar
                      </p>
                      <p className="text-zinc-600 text-[13px] leading-relaxed font-medium">
                        {item.quandoUsar}
                      </p>
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
// TELA: GUIA DE CRIMES (ACORDEÃO)
// ==========================================
const baseCrimes = [
  {
    titulo: "1. Lesão Corporal",
    categoria: "Violência Física",
    pena: "Reclusão, de 1 a 4 anos (Art. 129, §13, CP)",
    descricao: "Ofender a integridade corporal ou a saúde de outra pessoa.",
    verbos: [
      "agredir",
      "bater",
      "socar",
      "chutar",
      "empurrar",
      "estrangular",
      "ferir",
    ],
    exemplos:
      "Dar tapa e deixar vermelhidão; dar soco e causar hematoma; apertar o pescoço e deixar marcas.",
    confusao:
      "Ameaça (quando não houve lesão, só promessa); Vias de fato (contato físico sem lesão relevante); Tentativa de feminicídio (quando a intenção era matar).",
    pergunta: "Houve agressão física com dor, marca ou prejuízo à saúde?",
  },
  {
    titulo: "2. Ameaça",
    categoria: "Violência Psicológica",
    pena: "Detenção, 1 a 6 meses, ou multa (Art. 147, CP)",
    descricao:
      "Ameaçar alguém, por palavra, escrito, gesto ou outro meio, de causar mal injusto e grave.",
    verbos: ["ameaçar", "intimidar", "prometer matar", "prometer bater"],
    exemplos:
      "«Vou te matar»; «se chamar a polícia, eu te arrebento»; áudio dizendo que vai incendiar a casa.",
    confusao:
      "Injúria (xingamento sem promessa de mal grave); Violência psicológica (humilhação contínua); Perseguição (repetição de atos).",
    pergunta: "O autor prometeu um mal grave e injusto?",
  },
  {
    titulo: "3. Violência Psicológica",
    categoria: "Violência Psicológica",
    pena: "Reclusão, 6 meses a 2 anos, e multa (Art. 147-B, CP)",
    descricao:
      "Causar dano emocional, prejudicar desenvolvimento ou visar degradar/controlar ações por ameaça, humilhação, isolamento ou chantagem.",
    verbos: ["humilhar", "constranger", "controlar", "isolar", "ridicularizar"],
    exemplos:
      "Proibir contato com família; vigiar celular; humilhar diariamente; ameaçar expor vídeos íntimos.",
    confusao:
      "Ameaça (promessa de mal é o centro); Perseguição (foco no seguimento e vigilância); Injúria (ofensa pontual).",
    pergunta:
      "O foco da conduta foi dominar, humilhar, isolar ou destruir o emocional?",
  },
  {
    titulo: "4. Descumprimento de MPU",
    categoria: "Contra a Adm. da Justiça",
    pena: "Detenção, de 3 meses a 2 anos (Art. 24-A, LMP)",
    descricao:
      "Descumprir decisão judicial que deferiu medida protetiva de urgência.",
    verbos: [
      "descumprir",
      "aproximar-se",
      "contatar",
      "perseguir apesar da ordem",
    ],
    exemplos:
      "Juiz proibiu contato e ele ligou/mandou WhatsApp; proibiu aproximação e foi à casa ou trabalho.",
    confusao:
      "Perseguição (pode existir sem MPU); O foco aqui é se havia ordem judicial ativa violada.",
    pergunta: "Já existia ordem judicial e o autor desobedeceu?",
  },
  {
    titulo: "5. Perseguição (Stalking)",
    categoria: "Violência Psicológica",
    pena: "Reclusão, 6 meses a 2 anos (+1/2 se mulher) (Art. 147-A)",
    descricao:
      "Perseguir alguém, reiteradamente e por qualquer meio, ameaçando integridade, restringindo locomoção ou invadindo privacidade.",
    verbos: [
      "seguir",
      "rondar",
      "monitorar",
      "vigiar",
      "importunar repetidamente",
    ],
    exemplos:
      "Esperar na porta do trabalho todo dia; criar perfis falsos nas redes sociais; ligar dezenas de vezes ao dia.",
    confusao:
      "Ameaça (exige repetição para ser stalking); Descumprimento de medida (se houver ordem, responde por ambos).",
    pergunta:
      "Houve repetição de atos de seguimento, vigilância ou invasão da privacidade?",
  },
  {
    titulo: "6. Injúria, Difamação e Calúnia",
    categoria: "Violência Moral",
    pena: "Injúria: 1-6m / Difamação: 3m-1a / Calúnia: 6m-2a",
    descricao:
      "Injúria: ofender a dignidade. Difamação: imputar fato ofensivo à reputação. Calúnia: imputar falsamente um crime.",
    verbos: ["xingar", "difamar", "inventar crime"],
    exemplos:
      "Injúria: chamar de «vagabunda». Difamação: dizer no trabalho que ela trai. Calúnia: dizer que ela furtou algo (sabendo ser falso).",
    confusao:
      "Xingou = Injúria. Falou mal = Difamação. Acusou de crime = Calúnia.",
    pergunta: "Foi xingamento? Fato ofensivo? Ou crime falso?",
  },
  {
    titulo: "7. Dano, Furto ou Apropriação",
    categoria: "Violência Patrimonial",
    pena: "Dano: 1-6m / Furto: 1-4a / Apropriação: 1-4a (CP)",
    descricao:
      "Reter, subtrair, destruir objetos, documentos, instrumentos de trabalho ou recursos da mulher.",
    verbos: ["quebrar", "rasgar", "pegar", "esconder", "reter"],
    exemplos:
      "Dano: quebrar celular ou rasgar roupas. Furto: levar o dinheiro dela. Apropriação: reter cartão bancário ou CNH para controlá-la.",
    confusao:
      "Dano destrói. Furto tira dela. Apropriação é reter o que já estava com ele pacificamente.",
    pergunta: "Ele quebrou, levou ou reteve bens para controlar ou prejudicar?",
  },
  {
    titulo: "8. Estupro",
    categoria: "Violência Sexual",
    pena: "Reclusão, de 6 a 10 anos (Art. 213, CP)",
    descricao:
      "Constranger alguém, com violência ou grave ameaça, a ter conjunção carnal ou praticar/permitir ato libidinoso.",
    verbos: ["constranger", "forçar", "obrigar", "violentar"],
    exemplos:
      "Obrigar relação sexual ou ato libidinoso mediante força ou ameaça.",
    confusao:
      "Importunação sexual (ato sem consentimento, mas sem violência ou grave ameaça).",
    pergunta: "Houve ato sexual forçado por violência ou grave ameaça?",
  },
  {
    titulo: "9. Cárcere e Constrangimento",
    categoria: "Privação de Liberdade",
    pena: "Cárcere: 1 a 3 anos (Art. 148). Const.: 3m a 1 ano (Art. 146).",
    descricao:
      "Cárcere Privado: privar a liberdade de locomoção. Constrangimento Ilegal: obrigar a fazer algo que a lei não manda.",
    verbos: ["trancar", "prender", "obrigar", "forçar a fazer"],
    exemplos:
      "Cárcere: trancar a vítima no quarto, tirar a chave. Constrangimento: obrigar a apagar mensagens, forçar a entrar no carro.",
    confusao:
      "Cárcere: foca em prender no local. Constrangimento: foca em impor comportamento à força.",
    pergunta:
      "Foi impedida de sair fisicamente ou obrigada a fazer algo à força?",
  },
  {
    titulo: "10. Feminicídio (e Tentativa)",
    categoria: "Crime Contra a Vida",
    pena: "Reclusão, de 20 a 40 anos (Art. 121-A, CP)",
    descricao:
      "Matar mulher por razões da condition do sexo feminino (violência doméstica/familiar ou menosprezo à mulher).",
    verbos: ["matar", "executar", "tentar matar", "desferir golpes"],
    exemplos:
      "Esfaquear ou atirar contra a companheira ou ex-companheira para tirar sua vida.",
    confusao: "Lesão corporal (quando não há intenção de matar, apenas ferir).",
    pergunta:
      "Os atos mostram intenção clara de matar ou execução voltada à morte?",
  },
];

function GuiaCrimes() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Tipificações
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Guia rápido para enquadramento legal correto.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mb-6">
        <Gavel
          className="w-5 h-5 flex-shrink-0 text-zinc-700 mt-0.5"
          strokeWidth={2}
        />
        <p className="text-xs leading-relaxed text-zinc-600">
          Nem toda agressão é{" "}
          <strong className="text-zinc-800">lesão corporal</strong>, e nem toda
          ofensa é <strong className="text-zinc-800">difamação</strong>. Use
          este guia antes de fechar o REDS.
        </p>
      </div>

      <div className="space-y-3">
        {baseCrimes.map((crime, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white border ${isOpen ? "border-yellow-400 shadow-md ring-1 ring-yellow-400/20" : "border-zinc-200 shadow-sm"} rounded-2xl overflow-hidden transition-all duration-200`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`modelo-detalhe-${idx}`}
                className={`w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors ${buttonFocusClassName}`}
              >
                <div>
                  <h3
                    className={`font-bold text-[15px] ${isOpen ? "text-zinc-900" : "text-zinc-800"}`}
                  >
                    {crime.titulo}
                  </h3>
                  <p className="text-[11px] uppercase font-bold text-zinc-400 mt-1 tracking-widest">
                    {crime.categoria}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl transition-colors ${isOpen ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-500"}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`crime-detalhe-${idx}`}
                  className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="border-t border-zinc-100 pt-4 space-y-4 text-sm">
                    <div className="inline-flex bg-zinc-100 border border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide">
                      ⚖️ Pena: {crime.pena}
                    </div>

                    <p className="text-zinc-600 leading-relaxed">
                      <strong className="text-zinc-900">Na lei:</strong>{" "}
                      {crime.descricao}
                    </p>

                    <div>
                      <span className="font-bold text-zinc-400 block mb-2 text-[11px] uppercase tracking-widest">
                        Verbos-chave
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {crime.verbos.map((verbo, vIdx) => (
                          <span
                            key={vIdx}
                            className="bg-white border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide shadow-sm"
                          >
                            {verbo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                      <p className="text-zinc-600 text-xs leading-relaxed">
                        <strong className="text-zinc-900">Exemplos:</strong>{" "}
                        {crime.exemplos}
                      </p>
                    </div>

                    <p className="text-zinc-600 text-xs leading-relaxed">
                      <strong className="text-red-500 font-bold block mb-1">
                        ⚠️ Não confundir com:
                      </strong>
                      {crime.confusao}
                    </p>

                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/60 mt-2">
                      <p className="text-yellow-700 font-black text-[11px] uppercase tracking-widest mb-1.5">
                        Pergunta-chave
                      </p>
                      <p className="text-yellow-900 text-sm font-medium leading-snug">
                        {crime.pergunta}
                      </p>
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
    descricao:
      "Modelo oficial para redação do histórico da Primeira Resposta em ocorrências gerais de Violência Doméstica.",
    texto: `Acionados pelo COPOM/SOU/SOF, comparecemos ao local dos fatos, onde realizamos contato com a Sra. [NOME DA VÍTIMA], a qual nos relatou que teve um relacionamento [CASAMENTO/NAMORO/UNIÃO ESTÁVEL] com o Sr. [NOME DO AUTOR] durante [TEMPO]; que estão separados há [TEMPO], porém residem num imóvel [TIPO/DE QUEM]; que possuem [QTD] filhos; que o autor não aceita o término do relacionamento, é ciumento e possessivo; que o autor faz uso constante de [ÁLCOOL/DROGAS]; que não possui arma de fogo (ou que tem acesso a arma).

Que no dia, durante um atrito causado devido a [MOTIVO], o autor [DESCREVER AGRESSÃO/AMEAÇA], gerando um hematoma e afirmou: "[DIZERES DO AUTOR]"; ainda pegou o celular da vítima e o jogou contra a parede, danificando-o; que esta não foi a primeira vez que foi vítima de violência por parte dele, contudo, sempre teve medo de denunciá-lo (ou que já registrou boletins). 

Segundo a versão do AUTOR/ENVOLVIDO, este relatou que [VERSÃO DO AUTOR].
Segundo a versão da TESTEMUNHA, esta informou que [VERSÃO DA TESTEMUNHA].

Apesar do relato, a equipe não percebeu sinal de desordem ou objetos quebrados (ou a equipe percebeu sinais que condizem com a versão).
A vítima possui medida protetiva de número [NÚMERO], a qual prevê [CONDIÇÕES].

Em decorrência dos relatos (ou lesão), a vítima foi encaminhada ao hospital [NOME], onde foi atendida com a ficha [NÚMERO].
No local dos fatos, foi recolhido [OBJETOS/ARMAS], relacionado em campo próprio.
Consultado o banco de dados, foram encontrados registros anteriores: REDS [NÚMEROS].

A vítima foi orientada a comparecer à DEAM (ou DP) para representar criminalmente o fato narrado.`,
  },
  {
    titulo: "1ª Resposta - Com MPU (Anexo C)",
    categoria: "Afastamento pelo PM (Art. 12-C)",
    descricao:
      "Modelo oficial para quando a própria guarnição PM aplica o afastamento do lar (em cidades que não são Sede de Comarca e sem Delegado disponível).",
    texto: `Durante atendimento à ocorrência, foram identificadas situações de violência(s) do tipo [FÍSICA/PSICOLÓGICA/SEXUAL/PATRIMONIAL/MORAL], bem como outros elementos de risco, conforme avaliação realizada no local. As condutas foram atribuídas ao(à) Senhor(a) [NOME DO AUTOR] em desfavor da Sra. [NOME DA VÍTIMA] e de seus dependentes (se houver), todos vinculados por relação interpessoal ou de convivência, em contexto de violência doméstica e familiar nos moldes da Lei Federal nº 11.340/06.

O cenário verificado evidenciou que a situação se deu em ambiente sob domínio do agressor, em circunstâncias que dificultam ou impedem reações defensivas por parte da vítima, em razão de vínculos afetivos e relações de confiança que colocam a mulher em condição de vulnerabilidade e demandam do Estado uma resposta imediata e eficaz para cessar os riscos à sua integridade física e psicológica.

Diante do exposto, e com fundamento no inciso II do artigo 22, combinado com o inciso III do artigo 12-C da Lei nº 11.340/06, impõe-se a aplicação da Medida Protetiva de Urgência consistente no afastamento do lar, domicílio ou local de convivência do(a) Sr(a). [NOME DO AUTOR] em relação à Sra. [NOME DA VÍTIMA] qualificados, respectivamente, como [AUTOR/VÍTIMA], situado à [ENDEREÇO COMPLETO].

Certifico, para os devidos fins, que a medida foi executada às [HORAS] horas do dia [DATA], com a devida ciência prévia ao agressor acerca do teor e dos efeitos da Medida Protetiva de Afastamento imposta, em conformidade com a legislação vigente, para posterior apreciação da autoridade judicial competente, conforme prevê o §1º do art. 12-C da Lei nº 11.340/06.`,
  },
  {
    titulo: "2ª Resposta - Visita Tranquilizadora",
    categoria: "Pós Emergência (POP 1.03.059)",
    descricao:
      "Modelo prático para redação da visita de retorno realizada pela Rp Multimissão em até 72h após o crime.",
    texto: `ATENDIMENTO DE 2ª Resposta - VISITA TRANQUILIZADORA
REDS de Origem: [NÚMERO DO REDS DA 1ª RESPOSTA]

Em cumprimento à IN 3.05.015/2026 (POP 1.03.059), a guarnição (Multimissão) realizou contato com a vítima, Sra. [NOME DA VÍTIMA], no intuito de verificar suas condições físicas e emocionais após o registro do crime de violência doméstica.

[OPÇÃO 0 - VÍTIMA NÃO LOCALIZADA]: A guarnição realizou diligências no endereço disponível e por outros meios acessíveis, porém a vítima não foi localizada até o momento. Registra-se a tentativa sem êxito para fins de acompanhamento e controle operacional.

SITUAÇÃO ATUAL DECLARADA PELA VÍTIMA:
A vítima relatou novos contatos ou ameaças do autor? [SIM / NÃO]
A vítima já possui MPU deferida e vigente pelo Juiz? [SIM / NÃO]

SÍNTESE DA VISITA TRANQUILIZADORA:
[Descrever brevemente o estado da vítima. Ex: A vítima encontra-se mais calma, está abrigada na casa da mãe e informa que o autor não a procurou novamente.]

AVALIAÇÃO DA GUARNIÇÃO (TRIAGEM):
[OPÇÃO 1 - SEM RISCO IMINENTE]: Não foi constatado risco iminente de revitimização na presente data. A vítima foi exaustivamente orientada sobre seus direitos, Lei Maria da Penha e a acionar o 190 caso necessário.
[OPÇÃO 2 - COM RISCO / ENCAMINHAMENTO]: Foi constatado RISCO ELEVADO in loco de nova revitimização em relação íntima de afeto. A P3 DA UNIDADE FOI CIENTIFICADA PARA ENCAMINHAMENTO DESTE CASO À RpPM (TERCEIRA RESPOSTA).`,
  },
];

function ModelosReds() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="p-5 pb-24 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Modelos REDS
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Anexos oficiais da IN 3.05.015/2026 para cópia.
        </p>
      </div>

      <div className="bg-zinc-900 text-white p-4 rounded-2xl flex items-start space-x-3 shadow-md border border-zinc-800 mb-6">
        <FileText
          className="w-6 h-6 flex-shrink-0 text-yellow-500 mt-0.5"
          strokeWidth={1.5}
        />
        <p className="text-xs leading-relaxed font-medium">
          Utilize estes esqueletos oficiais para garantir que o seu Histórico do
          REDS contém todos os elementos jurídicos exigidos pelo Estado-Maior da
          PMMG.
        </p>
      </div>

      <div className="space-y-3">
        {modelosOficiais.map((modelo, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`bg-white border ${isOpen ? "border-yellow-400 shadow-md ring-1 ring-yellow-400/20" : "border-zinc-200 shadow-sm"} rounded-2xl overflow-hidden transition-all duration-200`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className={`w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors ${buttonFocusClassName}`}
              >
                <div>
                  <h3
                    className={`font-bold text-[15px] ${isOpen ? "text-zinc-900" : "text-zinc-800"}`}
                  >
                    {modelo.titulo}
                  </h3>
                  <p className="text-[11px] uppercase font-bold text-zinc-400 mt-1 tracking-widest">
                    {modelo.categoria}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl transition-colors ${isOpen ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-500"}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`modelo-detalhe-${idx}`}
                  className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="border-t border-zinc-100 pt-4 space-y-4">
                    <p className="text-zinc-500 text-xs leading-relaxed font-medium mb-3">
                      {modelo.descricao}
                    </p>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 shadow-inner relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-black text-zinc-400 tracking-widest uppercase ml-1">
                          Histórico Padrão
                        </span>
                        <button
                          onClick={() => copyToClipboard(modelo.texto)}
                          className="bg-white border border-zinc-200 hover:bg-yellow-500 hover:text-zinc-950 text-zinc-700 py-1.5 px-3 rounded-lg text-xs flex items-center font-bold transition-all shadow-sm active:scale-95"
                        >
                          <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} />{" "}
                          Copiar Texto
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
function FormPessoaAccordion({
  title,
  isOpen,
  onToggle,
  data,
  onChange,
  onRemove,
}) {
  const baseId = useId();
  const sectionId = `${baseId}-content`;
  const titleId = `${baseId}-title`;
  const handleFieldChange = (field, rawValue) => {
    if (field === "cpf") return onChange(field, normalizeCpf(rawValue));
    if (field === "telefone") return onChange(field, normalizePhone(rawValue));
    if (field === "nasc") return onChange(field, normalizeDate(rawValue));
    if (field === "rg") return onChange(field, normalizeRg(rawValue));
    if (field === "endereco") return onChange(field, rawValue);
    return onChange(field, rawValue);
  };

  return (
    <div
      className={`bg-white border ${isOpen ? "border-yellow-400 shadow-md ring-1 ring-yellow-400/20" : "border-zinc-200 shadow-sm"} rounded-2xl overflow-hidden transition-all duration-200`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={sectionId}
        className={`w-full text-left p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors ${buttonFocusClassName}`}
      >
        <div className="flex items-center">
          <Users
            className={`w-5 h-5 mr-3 ${isOpen ? "text-yellow-600" : "text-zinc-400"}`}
          />
          <h3
            id={titleId}
            className={`font-black text-[14px] uppercase tracking-wide ${isOpen ? "text-zinc-900" : "text-zinc-700"}`}
          >
            {title}{" "}
            {data.nome && (
              <span className="font-medium text-xs normal-case text-zinc-500 ml-2">
                - {data.nome}
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {onRemove && (
            <button
              type="button"
              aria-label={`Remover ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 ${buttonFocusClassName}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div
            className={`p-1.5 rounded-xl transition-colors ${isOpen ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-500"}`}
          >
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              strokeWidth={2.5}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div
          id={sectionId}
          aria-labelledby={titleId}
          className="px-4 pb-5 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="border-t border-zinc-100 pt-4 grid grid-cols-1 gap-3">
            <div>
              <label
                htmlFor={`${baseId}-nome`}
                className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
              >
                Nome Completo
              </label>
              <input
                id={`${baseId}-nome`}
                type="text"
                className={compactFieldClassName}
                value={data.nome}
                onChange={(e) => handleFieldChange("nome", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`${baseId}-rg`}
                  className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
                >
                  RG
                </label>
                <input
                  id={`${baseId}-rg`}
                  type="text"
                  className={compactFieldClassName}
                  value={data.rg}
                  onChange={(e) => handleFieldChange("rg", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-cpf`}
                  className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
                >
                  CPF
                </label>
                <input
                  id={`${baseId}-cpf`}
                  type="text"
                  className={compactFieldClassName}
                  value={data.cpf}
                  onChange={(e) => handleFieldChange("cpf", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`${baseId}-nasc`}
                  className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
                >
                  Data Nascimento
                </label>
                <input
                  id={`${baseId}-nasc`}
                  type="text"
                  placeholder="DD/MM/AAAA"
                  className={compactFieldClassName}
                  value={data.nasc}
                  onChange={(e) => handleFieldChange("nasc", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-telefone`}
                  className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
                >
                  Telefone
                </label>
                <input
                  id={`${baseId}-telefone`}
                  type="tel"
                  className={`${compactFieldClassName} font-mono`}
                  value={data.telefone}
                  onChange={(e) => handleFieldChange("telefone", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`${baseId}-mae`}
                className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
              >
                Nome da Mãe
              </label>
              <input
                id={`${baseId}-mae`}
                type="text"
                className={compactFieldClassName}
                value={data.mae}
                onChange={(e) => handleFieldChange("mae", e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-endereco`}
                className="mb-1 ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500"
              >
                Endereço Completo
              </label>
              <textarea
                id={`${baseId}-endereco`}
                rows="2"
                className={compactFieldClassName}
                value={data.endereco}
                onChange={(e) => handleFieldChange("endereco", e.target.value)}
              ></textarea>
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
          <span key={i} className={step >= i + 1 ? "text-zinc-900" : ""}>
            {label}
          </span>
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
  const inputId = useId();
  const alertId = alert ? `${inputId}-alert` : undefined;

  return (
    <label
      htmlFor={inputId}
      className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm ${checked ? "bg-yellow-50/30 border-yellow-400 ring-1 ring-yellow-400/20" : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"}`}
    >
      <div className="flex items-center h-5 mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={alertId}
          className={`h-5 w-5 cursor-pointer rounded border-zinc-300 bg-white text-yellow-500 transition-colors focus-visible:ring-yellow-500 focus-visible:ring-offset-0 ${buttonFocusClassName}`}
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className="ml-3 flex flex-col">
        <span
          className={`text-sm font-bold ${checked ? "text-zinc-900" : "text-zinc-700"}`}
        >
          {label}
        </span>
        {subtitle && (
          <span className="text-xs text-zinc-500 mt-1 leading-snug">
            {subtitle}
          </span>
        )}
        {alert && (
          <span
            id={alertId}
            className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1.5"
          >
            {alert}
          </span>
        )}
      </div>
    </label>
  );
}

function FonarAvulso({ setTelaAtual }) {
  const fonarDraft = readDraft(DRAFT_STORAGE_KEYS.fonar);
  const [step, setStep] = useState(fonarDraft?.step || 1);
  const [fonar, setFonar] = useState(fonarDraft?.fonar || Array(19).fill(""));
  const [observacoes, setObservacoes] = useState(fonarDraft?.observacoes || "");
  const observacoesId = useId();

  const fonarIncompleto = fonar.includes("");
  const textoFonar = !fonarIncompleto ? buildFonarText(fonar, observacoes) : "";
  const simCount = fonar.filter((a) => a === "sim").length;
  const nsNaCount = fonar.filter((a) => a === "nsna").length;
  const risco = !fonarIncompleto ? calcularRisco(simCount, nsNaCount) : null;

  const handleDiscardDraft = () => {
    clearDraft(DRAFT_STORAGE_KEYS.fonar);
    setStep(1);
    setFonar(Array(19).fill(""));
    setObservacoes("");
    showToast("Rascunho local descartado.");
  };

  useEffect(() => {
    saveDraft(DRAFT_STORAGE_KEYS.fonar, {
      telaAtual: "fonar",
      step,
      fonar,
      observacoes,
    });
  }, [step, fonar, observacoes]);

  return (
    <div className="p-5 pb-24 print:p-0 print:pb-0">
      <ProgressBar
        step={step}
        total={2}
        labels={["Entrevista", "Relatório"]}
      />

      <div className="mt-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handleDiscardDraft}
          className={`rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-700 transition hover:bg-zinc-100 ${buttonFocusClassName}`}
        >
          Limpar dados
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
          <div className="sticky top-0 bg-zinc-50 pt-2 pb-2 z-10">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              FONAR Avulso
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Use quando a guarnição precisar apenas da avaliação de risco.
            </p>

            <div className="bg-white p-3.5 mt-4 rounded-xl flex items-start space-x-3 shadow-sm border border-zinc-200">
              <MessageCircleQuestion
                className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                Responda às 19 questões para calcular o risco. Ao final, o
                sistema libera um resumo para copiar ou salvar em arquivo.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {perguntasFonar.map((pergunta, idx) => (
              <FonarQuestionCard
                key={idx}
                pergunta={pergunta}
                idx={idx}
                value={fonar[idx]}
                onChange={(nextValue) => {
                  const nf = [...fonar];
                  nf[idx] = nextValue;
                  setFonar(nf);
                }}
              />
            ))}
          </div>

          {risco && (
            <div
              className={`${risco.cor} text-white p-4 rounded-2xl text-center shadow-lg border border-black/10`}
            >
              <p className="text-[10px] font-black opacity-90 uppercase tracking-widest mb-1 text-white/80">
                Nível de Risco Calculado no FONAR
              </p>
              <p className="text-2xl font-black uppercase tracking-widest drop-shadow-sm">
                {risco.nivel}
              </p>
            </div>
          )}

          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
            <label
              htmlFor={observacoesId}
              className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1"
            >
              Observações Complementares
            </label>
            <textarea
              id={observacoesId}
              rows="4"
              className={fieldClassName}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: entrevista feita no local; vítima orientada; avaliação usada para subsidiar decisão operacional."
            ></textarea>
          </div>

          {fonarIncompleto && (
            <ValidationMessage message="Responda às 19 perguntas do FONAR antes de gerar o relatório." />
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                clearDraft(DRAFT_STORAGE_KEYS.fonar);
                setTelaAtual("home");
              }}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <Home className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={fonarIncompleto}
              aria-disabled={fonarIncompleto}
              className={`flex-1 font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all tracking-wide ${buttonFocusClassName} ${
                fonarIncompleto
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-950 hover:bg-zinc-800 text-white active:scale-[0.98]"
              }`}
            >
              Gerar Relatório
              <ChevronRight
                className={`ml-2 w-5 h-5 ${fonarIncompleto ? "text-zinc-300" : "text-yellow-500"}`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="print:hidden">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Relatório do FONAR
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Resultado pronto para copiar ou salvar em outro local.
            </p>
          </div>

          <div
            className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:border-none print:shadow-none print:p-0"
            id="print-area-fonar"
          >
            <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2 print:hidden">
              <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                Resumo Estruturado
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(textoFonar)}
                  className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                >
                  <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} />
                  Copiar
                </button>
                <button
                  onClick={() => downloadTextFile("fonar-avulso.txt", textoFonar)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                >
                  <Save className="w-4 h-4 mr-1.5" strokeWidth={2} />
                  Salvar TXT
                </button>
              </div>
            </div>

            <pre className="text-[11px] text-zinc-600 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-96 overflow-y-auto border border-zinc-100 leading-relaxed print:max-h-full print:bg-white print:border-none print:text-black print:text-[12px] print:overflow-visible">
              {textoFonar}
            </pre>
          </div>

          <div className="flex space-x-3 pt-4 print:hidden">
            <button
              onClick={() => setStep(1)}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={() => {
                clearDraft(DRAFT_STORAGE_KEYS.fonar);
                setTelaAtual("home");
              }}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide"
            >
              <CheckCircle2
                className="mr-2 w-5 h-5 text-yellow-500"
                strokeWidth={2.5}
              />
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// FLUXO DE PRIMEIRA RESPOSTA (5 Passos)
// ==========================================
function PrimeiraResposta({ setTelaAtual }) {
  const primeiraDraft = readDraft(DRAFT_STORAGE_KEYS.primeira);
  const primeiraDraftDados = primeiraDraft?.dados || {};
  const primeiraDraftAnexos = Array.isArray(primeiraDraft?.anexosFoto)
    ? primeiraDraft.anexosFoto.filter(
        (foto) =>
          foto &&
          typeof foto.id === "string" &&
          typeof foto.name === "string" &&
          typeof foto.previewUrl === "string",
      )
    : [];
  const primeiraDadosIniciais = {
    ...createInitialPrimeiraDados(),
    ...primeiraDraftDados,
    vitima: {
      ...createEmptyPerson(),
      ...(primeiraDraftDados.vitima || {}),
    },
    autor: {
      ...createEmptyPerson(),
      ...(primeiraDraftDados.autor || {}),
    },
    testemunhas: Array.isArray(primeiraDraftDados.testemunhas)
      ? primeiraDraftDados.testemunhas.map((testemunha) => ({
          ...createEmptyPerson(),
          ...(testemunha || {}),
        }))
      : [],
  };
  const [step, setStep] = useState(sanitizeStep(primeiraDraft?.step, 1, 5));
  const hoje = new Date();
  const prazoRetorno = new Date(hoje);
  prazoRetorno.setDate(prazoRetorno.getDate() + 3);
  const formatarData = (data) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(data);
  const hojeFormatado = formatarData(hoje);
  const prazoRetornoFormatado = formatarData(prazoRetorno);

  // Estado estruturado para pessoas
  const [dados, setDados] = useState(primeiraDadosIniciais);
  // Controlo de Abas Abertas
  const [openPessoaIndex, setOpenPessoaIndex] = useState(
    typeof primeiraDraft?.openPessoaIndex === "string" ||
      primeiraDraft?.openPessoaIndex === null
      ? primeiraDraft.openPessoaIndex
      : "vitima",
  );

  const [fonar, setFonar] = useState(
    Array.isArray(primeiraDraft?.fonar) && primeiraDraft.fonar.length === 19
      ? primeiraDraft.fonar
      : Array(19).fill(""),
  );
  const [anexosFoto, setAnexosFoto] = useState(primeiraDraftAnexos);
  const [isDictating, setIsDictating] = useState(false);
  const [dictationPreview, setDictationPreview] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const recognitionRef = useRef(null);
  const dictationBaseRef = useRef("");
  const dictationSessionRef = useRef("");
  const dictationFinalPartsRef = useRef([]);
  const dictationInterimPartRef = useRef("");
  const lastCommittedBaseRef = useRef("");
  const lastCommittedSessionRef = useRef("");
  const skipNextDictationCommitRef = useRef(false);
  const dadosNormalizados = normalizePrimeiraDados(dados);
  const speechRecognitionSupported = !!createSpeechRecognition();
  const dataFatoCalculada = parseDateTime(dadosNormalizados.dataHoraFato);
  const prazoSegundaResposta = dataFatoCalculada
    ? new Date(dataFatoCalculada.getTime() + 72 * 60 * 60 * 1000)
    : null;
  const prazoSegundaRespostaFormatado = prazoSegundaResposta
    ? formatDateTime(prazoSegundaResposta)
    : "";

  const step2ValidationErrors = [
    ...validatePerson(dados.vitima, "Vítima"),
    ...validatePerson(dados.autor, "Autor"),
    ...dados.testemunhas.flatMap((testemunha, idx) =>
      validatePerson(testemunha, `Testemunha ${idx + 1}`),
    ),
  ];

  const step3ValidationErrors = [];
  if (!validateDateTime(dados.dataHoraFato)) {
    step3ValidationErrors.push(
      "Data/hora do fato inválida. Use o formato DD/MM/AAAA HH:MM.",
    );
  }

  const validateCurrentStep = () => {
    if (step === 2) return step2ValidationErrors;
    if (step === 3) return step3ValidationErrors;
    return [];
  };

  const handleNext = () => {
    const errors = validateCurrentStep();
    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo(0, 0);
      return;
    }
    setValidationErrors([]);
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  const handlePrev = () => {
    setValidationErrors([]);
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleDiscardDraft = () => {
    clearDraft(DRAFT_STORAGE_KEYS.primeira);
    setStep(1);
    setDados(createInitialPrimeiraDados());
    setOpenPessoaIndex("vitima");
    setFonar(Array(19).fill(""));
    setAnexosFoto([]);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsDictating(false);
    setDictationPreview("");
    dictationBaseRef.current = "";
    dictationSessionRef.current = "";
    dictationFinalPartsRef.current = [];
    dictationInterimPartRef.current = "";
    lastCommittedBaseRef.current = "";
    lastCommittedSessionRef.current = "";
    skipNextDictationCommitRef.current = false;
    setIsGettingLocation(false);
    setValidationErrors([]);
    showToast("Rascunho local descartado.");
  };

  const handleFotoQualificacaoChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    try {
      const nextFiles = selectedFiles.slice(0, 4 - anexosFoto.length);
      const nextAnexos = await Promise.all(
        nextFiles.map(async (file) => {
          const originalDataUrl = await readFileAsDataUrl(file);
          const optimizedDataUrl = await optimizeImageForDraft(originalDataUrl);
          return {
            id: `${file.name}-${file.size}-${file.lastModified}`,
            name: file.name,
            size: file.size,
            previewUrl: optimizedDataUrl,
          };
        }),
      );

      setAnexosFoto((current) => [...current, ...nextAnexos].slice(0, 4));

      if (selectedFiles.length > nextFiles.length) {
        showToast("Limite de 4 fotos temporárias atingido.", "error");
      } else {
        showToast("Foto anexada para pré-visualização no relatório.");
      }
    } catch (error) {
      showToast("Não foi possível ler a imagem selecionada.", "error");
    } finally {
      event.target.value = "";
    }
  };

  const removeFotoQualificacao = (id) => {
    setAnexosFoto((current) => current.filter((foto) => foto.id !== id));
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast("Geolocalização indisponível neste dispositivo.", "error");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinatesLabel = formatCoordinatesLabel(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy,
        );
        try {
          const geocoded = await reverseGeocodeCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );

          setDados((current) => ({
            ...current,
            residencia:
              current.residencia ||
              geocoded.formattedAddress ||
              `Local obtido pelo celular. ${coordinatesLabel}`,
            enderecoGeolocalizado:
              geocoded.formattedAddress || geocoded.displayName || "",
            localizacaoGps: coordinatesLabel,
          }));
          showToast("Localização e endereço capturados com sucesso.");
        } catch {
          setDados((current) => ({
            ...current,
            residencia:
              current.residencia ||
              `Local obtido pelo celular. ${coordinatesLabel}`,
            enderecoGeolocalizado: "",
            localizacaoGps: coordinatesLabel,
          }));
          showToast(
            "GPS capturado, mas não foi possível converter em endereço.",
            "error",
          );
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        if (error?.code === error.PERMISSION_DENIED) {
          showToast("Permissão de localização negada.", "error");
          return;
        }
        if (error?.code === error.POSITION_UNAVAILABLE) {
          showToast("Não foi possível determinar a localização.", "error");
          return;
        }
        if (error?.code === error.TIMEOUT) {
          showToast("Tempo esgotado ao obter a localização.", "error");
          return;
        }
        showToast("Falha ao capturar a localização atual.", "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsDictating(false);
  };

  const mergeDictationText = (baseText, sessionText) =>
    normalizeMultilineText(
      [baseText, sessionText].filter(Boolean).join(baseText && sessionText ? " " : ""),
    );

  const commitDictationSession = () => {
    if (skipNextDictationCommitRef.current) {
      skipNextDictationCommitRef.current = false;
      dictationSessionRef.current = "";
      dictationFinalPartsRef.current = [];
      dictationInterimPartRef.current = "";
      setDictationPreview("");
      return;
    }

    const mergedText = mergeDictationText(
      dictationBaseRef.current,
      dictationSessionRef.current,
    );

    setDados((current) => ({
      ...current,
      historicoNarrado: mergedText,
    }));

    lastCommittedBaseRef.current = dictationBaseRef.current;
    lastCommittedSessionRef.current = dictationSessionRef.current;
    dictationBaseRef.current = mergedText;
    dictationSessionRef.current = "";
    dictationFinalPartsRef.current = [];
    dictationInterimPartRef.current = "";
    setDictationPreview("");
  };

  const clearCurrentDictationSession = () => {
    if (isDictating) {
      skipNextDictationCommitRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setDados((current) => ({
        ...current,
        historicoNarrado: dictationBaseRef.current,
      }));
      dictationSessionRef.current = "";
      dictationFinalPartsRef.current = [];
      dictationInterimPartRef.current = "";
      setDictationPreview("");
      setIsDictating(false);
      showToast("Ditado atual descartado.");
      return;
    }

    if (lastCommittedSessionRef.current) {
      setDados((current) => ({
        ...current,
        historicoNarrado: lastCommittedBaseRef.current,
      }));
      dictationBaseRef.current = lastCommittedBaseRef.current;
      dictationSessionRef.current = "";
      dictationFinalPartsRef.current = [];
      dictationInterimPartRef.current = "";
      lastCommittedSessionRef.current = "";
      setDictationPreview("");
      showToast("Última sessão de ditado removida.");
      return;
    }

    showToast("Não há sessão de ditado para limpar.", "error");
  };

  const appendNewDictationBlock = () => {
    if (isDictating) {
      showToast("Pare o ditado atual antes de abrir uma nova fala.", "error");
      return;
    }

    setDados((current) => {
      const currentText = current.historicoNarrado || "";
      const nextText = currentText.trimEnd()
        ? `${currentText.trimEnd()}\n\n`
        : currentText;
      return {
        ...current,
        historicoNarrado: nextText,
      };
    });
    showToast("Novo bloco preparado para a próxima fala.");
  };

  const startDictation = () => {
    const recognition = createSpeechRecognition();
    if (!recognition) {
      showToast(
        "Ditado por voz indisponível neste navegador. Use Chrome ou Edge.",
        "error",
      );
      return;
    }

    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    dictationBaseRef.current = dados.historicoNarrado || "";
    dictationSessionRef.current = "";
    dictationFinalPartsRef.current = [];
    dictationInterimPartRef.current = "";
    setDictationPreview("");

    recognition.onresult = (event) => {
      const finalParts = [...dictationFinalPartsRef.current];
      let interimPart = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const transcript = event.results[index][0]?.transcript?.trim() || "";
        if (event.results[index].isFinal) {
          finalParts[index] = transcript;
        } else {
          interimPart = transcript;
        }
      }

      dictationFinalPartsRef.current = finalParts;
      dictationInterimPartRef.current = interimPart;

      const sessionTranscript = [...finalParts.filter(Boolean), interimPart]
        .filter(Boolean)
        .join(" ")
        .trim();

      dictationSessionRef.current = sessionTranscript;
      setDictationPreview(sessionTranscript);
    };

    recognition.onerror = () => {
      commitDictationSession();
      setIsDictating(false);
      showToast("Falha ao capturar o áudio do ditado.", "error");
    };

    recognition.onend = () => {
      commitDictationSession();
      setIsDictating(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsDictating(true);
    showToast("Ditado iniciado. Revise o texto antes de gerar o relatório.");
  };

  // Funções de Update de Pessoas
  const updateVitima = (field, val) =>
    setDados({ ...dados, vitima: { ...dados.vitima, [field]: val } });
  const updateAutor = (field, val) =>
    setDados({ ...dados, autor: { ...dados.autor, [field]: val } });
  const addTestemunha = () => {
    const newTestemunhas = [
      ...dados.testemunhas,
      {
        nome: "",
        rg: "",
        cpf: "",
        nasc: "",
        telefone: "",
        mae: "",
        endereco: "",
      },
    ];
    setDados({ ...dados, testemunhas: newTestemunhas });
    setOpenPessoaIndex(`testemunha_${newTestemunhas.length - 1}`);
  };
  const updateTestemunha = (idx, field, val) => {
    const newT = [...dados.testemunhas];
    newT[idx][field] = val;
    setDados({ ...dados, testemunhas: newT });
  };
  const removeTestemunha = (idx) => {
    const newT = dados.testemunhas.filter((_, i) => i !== idx);
    setDados({ ...dados, testemunhas: newT });
  };

  useEffect(() => {
    saveDraft(DRAFT_STORAGE_KEYS.primeira, {
      telaAtual: "primeira",
      step,
      dados,
      fonar,
      anexosFoto,
      openPessoaIndex,
    });
  }, [step, dados, fonar, anexosFoto, openPessoaIndex]);

  useEffect(() => () => stopDictation(), []);

  return (
    <div className="p-5 pb-24 print:p-0 print:pb-0">
      <ProgressBar
        step={step}
        total={5}
        labels={["Cena", "Qualificação", "Histórico", "FONAR", "Relatório"]}
      />

      <div className="mt-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handleDiscardDraft}
          className={`rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-700 transition hover:bg-zinc-100 ${buttonFocusClassName}`}
        >
          Limpar dados
        </button>
      </div>

      {/* PASSO 1: CONTROLE DA CENA */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Controle da Cena
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Garanta a segurança antes de registar os dados.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <Info
              className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5"
              strokeWidth={2}
            />
            <p className="text-sm leading-relaxed text-amber-900">
              <strong className="text-amber-700">Abordagem Técnica:</strong>{" "}
              Separe a vítima do autor imediatamente. Fale com a mulher num
              ambiente onde o autor não possa ouvir ou intimidá-la com o olhar.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <AlertTriangle
              className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5"
              strokeWidth={2.5}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">
                Envolvimento de Policial Militar
              </span>
              <p className="text-sm leading-relaxed text-red-900 font-medium">
                Se a vítima ou o autor forem policiais militares,{" "}
                <strong>não se cumpre a 2ª resposta</strong>. Nessa hipótese,
                anuncie o <strong>CPU imediatamente</strong> e providencie o
                encaminhamento conforme o protocolo de 3ª resposta.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 ml-1">
              Pontos Críticos do Registro
            </h3>

            <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-yellow-800 mb-1.5">
                  FONAR
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                  O <strong>FONAR</strong> é essencial para subsidiar a{" "}
                  <strong>classificação do risco</strong>, orientar o
                  encaminhamento da ocorrência e definir a necessidade de 2ª ou
                  3ª resposta.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-700 mb-1.5">
                  Natureza da 1ª Resposta
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                  Na <strong>1ª resposta</strong>, a natureza principal deve
                  seguir o <strong>fato principal</strong> conforme a DIAO,
                  evitando usar a <strong>U 33.004</strong> como principal. A{" "}
                  <strong>U 33.004</strong> entra como natureza secundária para
                  marcar o contexto de violência doméstica.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-700 mb-1.5">
                  Endereço do Fato
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                  No REDS, tenha atenção ao <strong>endereço do fato</strong>.
                  Não registre automaticamente o endereço da vítima nem o do
                  autor se o evento ocorreu em local diverso. Cadastre o local
                  exato da ocorrência.
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-red-700 mb-1.5">
                  U33 e Prazo de Retorno
                </p>
                <p className="text-sm leading-relaxed text-red-900 font-medium">
                  Cadastre corretamente o <strong>U33</strong>. Sem esse
                  lançamento, o filtro da <strong>P3</strong> pode não localizar
                  a ocorrência como violência doméstica e o <strong>FONAR</strong>{" "}
                  pode não ser aberto no REDS. Considerando a data de hoje,{" "}
                  <strong>{hojeFormatado}</strong>, a visita de retorno deve
                  ocorrer até <strong>{prazoRetornoFormatado}</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-1.5">
                  Atenção aos Dados do App
                </p>
                <p className="text-sm leading-relaxed text-amber-900 font-medium">
                  Se sair desta tela sem copiar os dados,{" "}
                  <strong>as informações serão perdidas</strong>. Copie o
                  conteúdo para um rascunho antes de fechar, pois ao encerrar a
                  tela o preenchimento é apagado.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide mt-8"
          >
            Avançar{" "}
            <ChevronRight
              className="ml-2 w-5 h-5 text-yellow-500"
              strokeWidth={2.5}
            />
          </button>
        </div>
      )}

      {/* PASSO 2: QUALIFICAÇÃO REDS (ACORDEÕES) */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Qualificação
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Preencha os dados dos envolvidos para o REDS.
            </p>
          </div>

          {/* ALERTA QAPP */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <AlertTriangle
              className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5"
              strokeWidth={2.5}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">
                Aviso de Segurança
              </span>
              <p className="text-sm leading-relaxed text-red-900 font-medium">
                Consulte obrigatoriamente o <strong>QAPP / ISP</strong> para
                verificar a situação de todos os envolvidos e confirmar a
                existência de Mandados de Prisão em aberto.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <FormPessoaAccordion
              title="1. Vítima"
              isOpen={openPessoaIndex === "vitima"}
              onToggle={() =>
                setOpenPessoaIndex(
                  openPessoaIndex === "vitima" ? null : "vitima",
                )
              }
              data={dados.vitima}
              onChange={updateVitima}
            />

            <FormPessoaAccordion
              title="2. Autor"
              isOpen={openPessoaIndex === "autor"}
              onToggle={() =>
                setOpenPessoaIndex(openPessoaIndex === "autor" ? null : "autor")
              }
              data={dados.autor}
              onChange={updateAutor}
            />

            {dados.testemunhas.map((test, idx) => (
              <FormPessoaAccordion
                key={idx}
                title={`3. Testemunha ${idx + 1}`}
                isOpen={openPessoaIndex === `testemunha_${idx}`}
                onToggle={() =>
                  setOpenPessoaIndex(
                    openPessoaIndex === `testemunha_${idx}`
                      ? null
                      : `testemunha_${idx}`,
                  )
                }
                data={test}
                onChange={(field, val) => updateTestemunha(idx, field, val)}
                onRemove={() => removeTestemunha(idx)}
              />
            ))}

            <button
              onClick={addTestemunha}
              className="w-full bg-zinc-100 hover:bg-zinc-200 border border-dashed border-zinc-300 text-zinc-600 font-bold py-3.5 rounded-2xl flex justify-center items-center transition-colors text-sm"
            >
              <PlusCircle className="mr-2 w-4 h-4" strokeWidth={2} /> Adicionar
              Testemunha
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px]">
                Foto na Qualificação
              </h3>
              <p className="mt-2 text-sm text-zinc-600 font-medium leading-relaxed">
                Melhor forma de implementar: foto temporária no atendimento,
                pré-visualização imediata e inclusão no PDF final, sem gravar a
                imagem no rascunho local.
              </p>
            </div>

            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition-colors hover:bg-zinc-100">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFotoQualificacaoChange}
              />
              <span className="inline-flex items-center text-sm font-bold text-zinc-700">
                <ImagePlus className="mr-2 h-4 w-4" strokeWidth={2} />
                Anexar foto da qualificação
              </span>
            </label>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              As fotos abaixo ficam apenas nesta sessão para não sobrecarregar o
              armazenamento local do navegador.
            </div>

            {anexosFoto.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {anexosFoto.map((foto, index) => (
                  <div
                    key={foto.id}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  >
                    <img
                      src={foto.previewUrl}
                      alt={`Anexo ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                    <div className="space-y-2 p-3">
                      <div>
                        <p className="text-xs font-black text-zinc-800">
                          Anexo {index + 1}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {foto.name}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {formatFileSize(foto.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFotoQualificacao(foto.id)}
                        className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {step === 2 && validationErrors.length > 0 && (
            <ValidationMessage
              tone="error"
              message={validationErrors.join(" ")}
            />
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handlePrev}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide"
            >
              Avançar p/ Histórico{" "}
              <ChevronRight
                className="ml-2 w-5 h-5 text-yellow-500"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 3: HISTÓRICO (Dinâmica) */}
      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Histórico
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Contexto e dinâmica para o registo policial.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">
                Relação e Contexto
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Relação
                  </label>
                  <select
                    className={compactFieldClassName}
                    value={dados.relacao}
                    onChange={(e) =>
                      setDados({ ...dados, relacao: e.target.value })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="Casamento">Casamento</option>
                    <option value="União Estável">União Estável</option>
                    <option value="Namoro">Namoro</option>
                    <option value="Ficantes">Ficantes</option>
                    <option value="Familiar (Mãe/Filho)">Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Filhos Comuns?
                  </label>
                  <select
                    className={compactFieldClassName}
                    value={dados.temFilhos}
                    onChange={(e) =>
                      setDados({ ...dados, temFilhos: e.target.value })
                    }
                  >
                    <option value="">...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Tempo Juntos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5 anos"
                    className={compactFieldClassName}
                    value={dados.tempoRelacao}
                    onChange={(e) =>
                      setDados({ ...dados, tempoRelacao: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Tempo Separados
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2 meses"
                    className={compactFieldClassName}
                    value={dados.tempoSeparacao}
                    onChange={(e) =>
                      setDados({ ...dados, tempoSeparacao: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label className="ml-1 block text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    Local do Fato / Moradia
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isGettingLocation}
                    className={`rounded-xl border px-3 py-2 text-[11px] font-black uppercase tracking-wide transition-colors ${
                      isGettingLocation
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {isGettingLocation ? "Obtendo GPS..." : "Usar Localização Atual"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Casa alugada no nome da vítima"
                  className={compactFieldClassName}
                  value={dados.residencia}
                  onChange={(e) =>
                    setDados({ ...dados, residencia: e.target.value })
                  }
                />
                <p className="mt-2 text-[11px] font-medium leading-relaxed text-zinc-500">
                  O botão é opcional. Se preferir, digite manualmente o endereço do fato.
                </p>
                {dados.enderecoGeolocalizado && (
                  <p className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-900">
                    Endereço sugerido pelo GPS: {dados.enderecoGeolocalizado}
                  </p>
                )}
                {dados.localizacaoGps && (
                  <p className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-medium text-zinc-600">
                    {dados.localizacaoGps}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Origem do Acionamento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: COPOM / 190 / terceiro"
                    className={compactFieldClassName}
                    value={dados.origemAcionamento}
                    onChange={(e) =>
                      setDados({ ...dados, origemAcionamento: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Data / Hora do Fato
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 05/04/2026 18:40"
                    className={compactFieldClassName}
                    value={dados.dataHoraFato}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        dataHoraFato: normalizeDateTime(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                  Filhos / Crianças Relacionadas
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2 filhos, 6 e 9 anos; presentes no local"
                  className={compactFieldClassName}
                  value={dados.filhosDetalhe}
                  onChange={(e) =>
                    setDados({ ...dados, filhosDetalhe: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">
                Perfil do Autor
              </h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className={`w-5 h-5 rounded border-zinc-300 text-yellow-500 ${buttonFocusClassName}`}
                    checked={dados.ciumento}
                    onChange={(e) =>
                      setDados({ ...dados, ciumento: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-zinc-800">
                    Ciumento/Possessivo
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className={`w-5 h-5 rounded border-zinc-300 text-yellow-500 ${buttonFocusClassName}`}
                    checked={dados.naoAceitaTermino}
                    onChange={(e) =>
                      setDados({ ...dados, naoAceitaTermino: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium text-zinc-800">
                    Não aceita término
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Álcool / Drogas
                  </label>
                  <select
                    className={compactFieldClassName}
                    value={dados.usoDrogas}
                    onChange={(e) =>
                      setDados({ ...dados, usoDrogas: e.target.value })
                    }
                  >
                    <option value="">Não Faz Uso</option>
                    <option value="álcool">Apenas Álcool</option>
                    <option value="drogas">Drogas Ilícitas</option>
                    <option value="álcool e drogas">Álcool e Drogas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Arma de Fogo
                  </label>
                  <select
                    className={compactFieldClassName}
                    value={dados.arma}
                    onChange={(e) =>
                      setDados({ ...dados, arma: e.target.value })
                    }
                  >
                    <option value="">Não Possui</option>
                    <option value="possui">Possui Arma</option>
                    <option value="tem acesso a">Tem Acesso</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">
                Dinâmica e Desfecho
              </h3>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                  Motivo do Atrito
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ciúmes, dinheiro..."
                  className={compactFieldClassName}
                  value={dados.motivo}
                  onChange={(e) =>
                    setDados({ ...dados, motivo: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                  Versão da Vítima
                </label>
                <textarea
                  rows="2"
                  placeholder="O que o autor fez ou disse..."
                  className={compactFieldClassName}
                  value={dados.versaoVitima}
                  onChange={(e) =>
                    setDados({ ...dados, versaoVitima: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-700">
                      Histórico Falado
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-600">
                      Melhor implementação para uso rápido: um botão de ditado
                      que vai escrevendo neste campo e depois segue para revisão
                      manual antes do relatório.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={isDictating ? stopDictation : startDictation}
                    disabled={!speechRecognitionSupported && !isDictating}
                    className={`inline-flex items-center rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                      isDictating
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                    } ${
                      !speechRecognitionSupported && !isDictating
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    {isDictating ? (
                      <MicOff className="mr-1.5 h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Mic className="mr-1.5 h-4 w-4" strokeWidth={2} />
                    )}
                    {isDictating ? "Parar ditado" : "Iniciar ditado"}
                  </button>
                </div>

                <textarea
                  rows="4"
                  placeholder="Ex: a vítima relatou que o autor chegou exaltado, proferiu ameaças e arremessou objetos no interior da residência..."
                  className={`${compactFieldClassName} mt-3`}
                  value={
                    isDictating
                      ? mergeDictationText(
                          dictationBaseRef.current,
                          dictationPreview,
                        )
                      : dados.historicoNarrado
                  }
                  disabled={isDictating}
                  onChange={(e) =>
                    setDados({ ...dados, historicoNarrado: e.target.value })
                  }
                ></textarea>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={clearCurrentDictationSession}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wide text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    Limpar ditado da sessão
                  </button>
                  <button
                    type="button"
                    onClick={appendNewDictationBlock}
                    disabled={isDictating}
                    className={`rounded-xl border px-3 py-2 text-[11px] font-black uppercase tracking-wide transition-colors ${
                      isDictating
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    Anexar nova fala
                  </button>
                </div>

                <p className="mt-2 text-[11px] font-medium text-zinc-500">
                  {speechRecognitionSupported
                    ? "Compatível com navegadores que expõem reconhecimento de voz. O texto deve ser conferido antes do uso."
                    : "Este navegador não expõe reconhecimento de voz; o campo continua disponível para colagem ou digitação."}
                </p>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                  Versão do Autor
                </label>
                <textarea
                  rows="2"
                  placeholder="A versão do autor ou se ele não foi localizado..."
                  className={compactFieldClassName}
                  value={dados.versaoAutor}
                  onChange={(e) =>
                    setDados({ ...dados, versaoAutor: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="grid grid-cols-1 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Lesões Aparente(s)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: hematoma no braço esquerdo, vermelhidão no pescoço"
                    className={compactFieldClassName}
                    value={dados.lesoes}
                    onChange={(e) =>
                      setDados({ ...dados, lesoes: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Dizeres / Ameaças do Autor
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Ex: 'vou te matar', 'vou quebrar tudo'..."
                    className={compactFieldClassName}
                    value={dados.dizeresAutor}
                    onChange={(e) =>
                      setDados({ ...dados, dizeresAutor: e.target.value })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Danos / Objetos Atingidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: celular da vítima danificado, porta quebrada"
                    className={compactFieldClassName}
                    value={dados.danos}
                    onChange={(e) =>
                      setDados({ ...dados, danos: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Provas / Elementos Disponíveis
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: fotos, prints, vídeos, testemunha presencial"
                    className={compactFieldClassName}
                    value={dados.provas}
                    onChange={(e) =>
                      setDados({ ...dados, provas: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Sinais / Desordem
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Porta arrombada"
                    className={compactFieldClassName}
                    value={dados.desordem}
                    onChange={(e) =>
                      setDados({ ...dados, desordem: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Socorro Médico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: UPA, Ficha 123"
                    className={compactFieldClassName}
                    value={dados.socorro}
                    onChange={(e) =>
                      setDados({ ...dados, socorro: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Materiais Apreendidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Uma faca"
                    className={compactFieldClassName}
                    value={dados.materiais}
                    onChange={(e) =>
                      setDados({ ...dados, materiais: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    MPU Ativa?
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Processo nº 123"
                    className={compactFieldClassName}
                    value={dados.mpu}
                    onChange={(e) =>
                      setDados({ ...dados, mpu: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 border-t border-zinc-100 pt-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Destino da Vítima / Proteção
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: permaneceu com familiar; orientada sobre DEAM e MPU"
                    className={compactFieldClassName}
                    value={dados.destinoVitima}
                    onChange={(e) =>
                      setDados({ ...dados, destinoVitima: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Situação do Autor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: preso em flagrante / não localizado / liberado"
                    className={compactFieldClassName}
                    value={dados.destinoAutor}
                    onChange={(e) =>
                      setDados({ ...dados, destinoAutor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Encaminhamentos / Acompanhamento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: DEAM, visita tranquilizadora, RpPM, retorno P3"
                    className={compactFieldClassName}
                    value={dados.acompanhamento}
                    onChange={(e) =>
                      setDados({ ...dados, acompanhamento: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {step === 3 && validationErrors.length > 0 && (
            <ValidationMessage
              tone="error"
              message={validationErrors.join(" ")}
            />
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handlePrev}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide"
            >
              Entrevista FONAR{" "}
              <ChevronRight
                className="ml-2 w-5 h-5 text-yellow-500"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 4: FONAR (ENTREVISTA) */}
      {step === 4 && (
        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
          <div className="sticky top-0 bg-zinc-50 pt-2 pb-2 z-10">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Entrevista - FONAR
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Avaliação de Risco Obrigatória.
            </p>

            <div className="bg-white p-3.5 mt-4 rounded-xl flex items-start space-x-3 shadow-sm border border-zinc-200">
              <MessageCircleQuestion
                className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                Faça as perguntas de forma empática. É{" "}
                <strong className="text-zinc-900">
                  obrigatório responder a todas
                </strong>{" "}
                as 19 questões para calcular o risco.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {perguntasFonar.map((pergunta, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 shadow-sm ${fonar[idx] === "sim" ? "bg-red-50/50 border-red-200" : fonar[idx] === "nao" ? "bg-emerald-50/50 border-emerald-200" : fonar[idx] === "nsna" ? "bg-zinc-100 border-zinc-200" : "bg-white border-zinc-200"}`}
              >
                <p className="text-[13px] font-bold text-zinc-800 mb-3.5 leading-snug">
                  <span className="text-yellow-600 mr-1.5 font-black">
                    {idx + 1}.
                  </span>{" "}
                  {pergunta}
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      const nf = [...fonar];
                      nf[idx] = "sim";
                      setFonar(nf);
                    }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === "sim" ? "bg-red-500 text-white shadow-md ring-2 ring-red-500/20" : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"}`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => {
                      const nf = [...fonar];
                      nf[idx] = "nao";
                      setFonar(nf);
                    }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === "nao" ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500/20" : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"}`}
                  >
                    Não
                  </button>
                  <button
                    onClick={() => {
                      const nf = [...fonar];
                      nf[idx] = "nsna";
                      setFonar(nf);
                    }}
                    className={`py-2.5 text-xs rounded-xl font-bold transition-all active:scale-[0.97] ${fonar[idx] === "nsna" ? "bg-zinc-700 text-white shadow-md ring-2 ring-zinc-700/20" : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"}`}
                  >
                    NS / NA
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-zinc-50 pt-4 pb-6 flex space-x-3">
            <button
              onClick={handlePrev}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={handleNext}
              disabled={fonar.includes("")}
              className={`flex-1 font-bold py-4 rounded-2xl flex justify-center items-center transition-all tracking-wide shadow-md ${fonar.includes("") ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-zinc-950 hover:bg-zinc-800 text-white active:scale-[0.98]"}`}
            >
              Gerar Relatório{" "}
              <ChevronRight
                className={`ml-2 w-5 h-5 ${fonar.includes("") ? "text-zinc-300" : "text-yellow-500"}`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      )}

      {/* PASSO 5: RESULTADO EM LISTA COM DOWNLOAD PDF */}
      {step === 5 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="print:hidden">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Relatório Estruturado
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Dados listados prontos para envio ou impressão.
            </p>
          </div>

          {(() => {
            const simCount = fonar.filter((a) => a === "sim").length;
            const nsNaCount = fonar.filter((a) => a === "nsna").length;
            const risco = calcularRisco(simCount, nsNaCount);

            let respostasTexto = "";
            perguntasFonar.forEach((pergunta, index) => {
              let resp = "NÃO INFORMADO";
              if (fonar[index] === "sim") resp = "SIM";
              else if (fonar[index] === "nao") resp = "NÃO";
              else if (fonar[index] === "nsna") resp = "NÃO SABE / N/A";
              respostasTexto += `${index + 1}. ${pergunta}\n-> R: ${resp}\n\n`;
            });

            // Formatando Testemunhas para Texto
            let testemunhasTxt = "Nenhuma testemunha registada.";
            if (dadosNormalizados.testemunhas.length > 0) {
              testemunhasTxt = dadosNormalizados.testemunhas
                .map(
                  (t, i) =>
                    `Testemunha ${i + 1}:\nNome: ${t.nome || "[N/I]"}\nRG: ${t.rg || "[N/I]"} | CPF: ${t.cpf || "[N/I]"}\nNasc: ${t.nasc || "[N/I]"} | Telefone: ${t.telefone || "[N/I]"}\nMãe: ${t.mae || "[N/I]"}\nEndereço: ${t.endereco || "[N/I]"}`,
                )
                .join("\n\n");
            }

            const textoReds = `=========================================
DADOS DE QUALIFICAÇÃO (COPIAR/COMPARTILHAR)
=========================================

[ VÍTIMA ]
Nome: ${dadosNormalizados.vitima.nome || "[N/I]"}
RG: ${dadosNormalizados.vitima.rg || "[N/I]"} | CPF: ${dadosNormalizados.vitima.cpf || "[N/I]"}
Nascimento: ${dadosNormalizados.vitima.nasc || "[N/I]"} | Mãe: ${dadosNormalizados.vitima.mae || "[N/I]"}
Telefone: ${dadosNormalizados.vitima.telefone || "[N/I]"}
Endereço: ${dadosNormalizados.vitima.endereco || "[N/I]"}

[ AUTOR ]
Nome: ${dadosNormalizados.autor.nome || "[N/I]"}
RG: ${dadosNormalizados.autor.rg || "[N/I]"} | CPF: ${dadosNormalizados.autor.cpf || "[N/I]"}
Nascimento: ${dadosNormalizados.autor.nasc || "[N/I]"} | Mãe: ${dadosNormalizados.autor.mae || "[N/I]"}
Telefone: ${dadosNormalizados.autor.telefone || "[N/I]"}
Endereço: ${dadosNormalizados.autor.endereco || "[N/I]"}

[ TESTEMUNHAS ]
${testemunhasTxt}

=========================================
HISTÓRICO DO REDS (CONFORME ANEXO B)
=========================================
[ SUBSÍDIOS PARA CONFECÇÃO ]
Origem do acionamento: ${dadosNormalizados.origemAcionamento || "[N/I]"}
Data / hora do fato: ${dadosNormalizados.dataHoraFato || "[N/I]"}
Relação: ${dadosNormalizados.relacao || "[N/I]"} | Filhos comuns: ${dadosNormalizados.temFilhos || "[N/I]"}
Detalhe de filhos / crianças: ${dadosNormalizados.filhosDetalhe || "[N/I]"}
Tempo de relacionamento: ${dadosNormalizados.tempoRelacao || "[N/I]"} | Tempo de separação: ${dadosNormalizados.tempoSeparacao || "[N/I]"}
Moradia / local do fato: ${dadosNormalizados.residencia || "[N/I]"}
Endereço geolocalizado: ${dadosNormalizados.enderecoGeolocalizado || "[N/I]"}
Localização GPS capturada: ${dadosNormalizados.localizacaoGps || "[N/I]"}
Autor ciumento / possessivo: ${dadosNormalizados.ciumento ? "SIM" : "NÃO"} | Não aceita término: ${dadosNormalizados.naoAceitaTermino ? "SIM" : "NÃO"}
Uso de álcool / drogas: ${dadosNormalizados.usoDrogas || "[N/I]"} | Arma de fogo: ${dadosNormalizados.arma || "[N/I]"}
Motivo do atrito: ${dadosNormalizados.motivo || "[N/I]"}
Versão da vítima: ${dadosNormalizados.versaoVitima || "[N/I]"}
Versão do autor: ${dadosNormalizados.versaoAutor || "[N/I]"}
Lesões aparentes: ${dadosNormalizados.lesoes || "[N/I]"}
Dizeres / ameaças do autor: ${dadosNormalizados.dizeresAutor || "[N/I]"}
Histórico falado (rascunho): ${dadosNormalizados.historicoNarrado || "[N/I]"}
Danos / objetos atingidos: ${dadosNormalizados.danos || "[N/I]"}
Sinais / desordem no local: ${dadosNormalizados.desordem || "[N/I]"}
Atendimento médico: ${dadosNormalizados.socorro || "[N/I]"}
Materiais apreendidos: ${dadosNormalizados.materiais || "[N/I]"}
MPU ativa: ${dadosNormalizados.mpu || "[N/I]"}
Provas / elementos disponíveis: ${dadosNormalizados.provas || "[N/I]"}
Fotos anexadas para conferência: ${
              anexosFoto.length > 0
                ? anexosFoto
                    .map(
                      (foto, index) =>
                        `Anexo ${index + 1}: ${foto.name} (${formatFileSize(foto.size)})`,
                    )
                    .join(" | ")
                : "[N/I]"
            }
Destino da vítima / proteção: ${dadosNormalizados.destinoVitima || "[N/I]"}
Situação do autor: ${dadosNormalizados.destinoAutor || "[N/I]"}
Encaminhamentos / acompanhamento: ${dadosNormalizados.acompanhamento || "[N/I]"}

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

            const qualificacaoSecoes = [
              {
                titulo: "Vítima",
                linhas: [
                  ["Nome", dadosNormalizados.vitima.nome || "[N/I]"],
                  [
                    "Documentos",
                    `RG: ${dadosNormalizados.vitima.rg || "[N/I]"} | CPF: ${
                      dadosNormalizados.vitima.cpf || "[N/I]"
                    }`,
                  ],
                  [
                    "Nascimento / Mãe",
                    `${dadosNormalizados.vitima.nasc || "[N/I]"} | ${
                      dadosNormalizados.vitima.mae || "[N/I]"
                    }`,
                  ],
                  ["Telefone", dadosNormalizados.vitima.telefone || "[N/I]"],
                  ["Endereço", dadosNormalizados.vitima.endereco || "[N/I]"],
                ],
              },
              {
                titulo: "Autor",
                linhas: [
                  ["Nome", dadosNormalizados.autor.nome || "[N/I]"],
                  [
                    "Documentos",
                    `RG: ${dadosNormalizados.autor.rg || "[N/I]"} | CPF: ${
                      dadosNormalizados.autor.cpf || "[N/I]"
                    }`,
                  ],
                  [
                    "Nascimento / Mãe",
                    `${dadosNormalizados.autor.nasc || "[N/I]"} | ${
                      dadosNormalizados.autor.mae || "[N/I]"
                    }`,
                  ],
                  ["Telefone", dadosNormalizados.autor.telefone || "[N/I]"],
                  ["Endereço", dadosNormalizados.autor.endereco || "[N/I]"],
                ],
              },
            ];

            const dinamicaSecoes = [
              ["Origem do acionamento", dadosNormalizados.origemAcionamento || "[N/I]"],
              ["Data / hora do fato", dadosNormalizados.dataHoraFato || "[N/I]"],
              [
                "Relação / filhos comuns",
                `${dadosNormalizados.relacao || "[N/I]"} | ${
                  dadosNormalizados.temFilhos || "[N/I]"
                }`,
              ],
              [
                "Tempo de relacionamento / separação",
                `${dadosNormalizados.tempoRelacao || "[N/I]"} | ${
                  dadosNormalizados.tempoSeparacao || "[N/I]"
                }`,
              ],
              ["Filhos / crianças relacionadas", dadosNormalizados.filhosDetalhe || "[N/I]"],
              ["Moradia / local do fato", dadosNormalizados.residencia || "[N/I]"],
              ["Endereço geolocalizado", dadosNormalizados.enderecoGeolocalizado || "[N/I]"],
              ["Localização GPS capturada", dadosNormalizados.localizacaoGps || "[N/I]"],
              [
                "Perfil do autor",
                `Ciumento/Possessivo: ${
                  dadosNormalizados.ciumento ? "SIM" : "NÃO"
                } | Não aceita término: ${
                  dadosNormalizados.naoAceitaTermino ? "SIM" : "NÃO"
                }`,
              ],
              [
                "Uso de álcool / drogas e arma",
                `${dadosNormalizados.usoDrogas || "[N/I]"} | ${
                  dadosNormalizados.arma || "[N/I]"
                }`,
              ],
              ["Motivo do atrito", dadosNormalizados.motivo || "[N/I]"],
              ["Versão da vítima", dadosNormalizados.versaoVitima || "[N/I]"],
              ["Versão do autor", dadosNormalizados.versaoAutor || "[N/I]"],
              ["Lesões aparentes", dadosNormalizados.lesoes || "[N/I]"],
              ["Dizeres / ameaças", dadosNormalizados.dizeresAutor || "[N/I]"],
              ["Danos / objetos atingidos", dadosNormalizados.danos || "[N/I]"],
              ["Sinais / desordem", dadosNormalizados.desordem || "[N/I]"],
              ["Atendimento médico", dadosNormalizados.socorro || "[N/I]"],
              ["Materiais apreendidos", dadosNormalizados.materiais || "[N/I]"],
              ["MPU ativa", dadosNormalizados.mpu || "[N/I]"],
              ["Provas / elementos", dadosNormalizados.provas || "[N/I]"],
              ["Destino da vítima / proteção", dadosNormalizados.destinoVitima || "[N/I]"],
              ["Situação do autor", dadosNormalizados.destinoAutor || "[N/I]"],
              ["Encaminhamentos", dadosNormalizados.acompanhamento || "[N/I]"],
            ];

            const dinamicaResumida = dinamicaSecoes.filter(([label, value]) => {
              if (!value || value === "[N/I]") return false;
              return [
                "Origem do acionamento",
                "Data / hora do fato",
                "Relação / filhos comuns",
                "Filhos / crianças relacionadas",
                "Moradia / local do fato",
                "Endereço geolocalizado",
                "Localização GPS capturada",
                "Motivo do atrito",
                "Versão da vítima",
                "Versão do autor",
                "Lesões aparentes",
                "Dizeres / ameaças",
                "Provas / elementos",
                "Destino da vítima / proteção",
                "Situação do autor",
                "Encaminhamentos",
              ].includes(label);
            });

            return (
              <>
                <div
                  className={`${risco.cor} text-white p-6 rounded-2xl text-center shadow-lg border border-black/10 print:hidden`}
                >
                  <p className="text-[10px] font-black opacity-90 uppercase tracking-widest mb-1 text-white/80">
                    Nível de Risco Calculado
                  </p>
                  <p className="text-4xl font-black uppercase tracking-widest drop-shadow-sm">
                    {risco.nivel}
                  </p>
                </div>

                <div
                  className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm relative mt-4 print:border-none print:shadow-none print:p-0"
                  id="print-area"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2 print:hidden">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Dados Estruturados
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => waitForImagesAndPrint("print-area")}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Printer className="w-4 h-4 mr-1.5" strokeWidth={2} />{" "}
                        Imprimir / PDF
                      </button>
                      <button
                        onClick={() => copyToClipboard(textoReds)}
                        className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} />{" "}
                        Copiar Texto
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-zinc-200 bg-white print:rounded-none print:border-none">
                    <div className="rounded-t-[28px] bg-zinc-950 px-5 py-5 text-white print:rounded-none">
                      <div className="flex items-center gap-4">
                        <img
                          src={logoHeaderImg}
                          alt="Logo institucional"
                          className="h-14 w-14 rounded-2xl bg-white/10 object-contain p-1"
                        />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                            Guia Operacional
                          </p>
                          <h3 className="mt-1 text-xl font-black tracking-tight">
                            Relatório Estruturado da 1ª Resposta
                          </h3>
                          <p className="mt-1 text-sm text-zinc-300">
                            Documento para conferência, impressão e geração de PDF.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 p-5 print:p-0 print:pt-5">
                      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                              Classificação do Caso
                            </p>
                            <h4 className="mt-1 text-base font-black text-zinc-900">
                              Avaliação Consolidada da Ocorrência
                            </h4>
                          </div>
                          <div className={`${risco.cor} rounded-2xl px-4 py-3 text-center text-white`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/80">
                              Risco
                            </p>
                            <p className="text-lg font-black uppercase">{risco.nivel}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-700 print:grid-cols-2">
                          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-3 print:border-zinc-300">
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                              Respostas SIM
                            </p>
                            <p className="mt-1 text-lg font-black text-zinc-900">{simCount}</p>
                          </div>
                          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-3 print:border-zinc-300">
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                              Respostas NS/NA
                            </p>
                            <p className="mt-1 text-lg font-black text-zinc-900">{nsNaCount}</p>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                            Qualificação
                          </p>
                          <h4 className="mt-1 text-base font-black text-zinc-900">
                            Partes Envolvidas
                          </h4>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
                          {qualificacaoSecoes.map((secao) => (
                            <div
                              key={secao.titulo}
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white"
                            >
                              <p className="border-b border-zinc-200 pb-2 text-[11px] font-black uppercase tracking-widest text-zinc-700">
                                {secao.titulo}
                              </p>
                              <div className="mt-3 space-y-2">
                                {secao.linhas.map(([label, valor]) => (
                                  <div key={label}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                      {label}
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-800">
                                      {valor}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {dadosNormalizados.testemunhas.length > 0 && (
                        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                              Testemunhas
                            </p>
                            <h4 className="mt-1 text-base font-black text-zinc-900">
                              Pessoas Qualificadas no Atendimento
                            </h4>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-2 print:grid-cols-2">
                            {dadosNormalizados.testemunhas.map((testemunha, index) => (
                              <div
                                key={`testemunha-doc-${index}`}
                                className="rounded-2xl border border-zinc-200 bg-white p-4 print:border-zinc-300"
                              >
                                <p className="border-b border-zinc-200 pb-2 text-[11px] font-black uppercase tracking-widest text-zinc-700">
                                  Testemunha {index + 1}
                                </p>
                                <div className="mt-3 space-y-2">
                                  <p className="text-sm font-medium text-zinc-800">
                                    <span className="font-black text-zinc-500">Nome:</span> {testemunha.nome || "[N/I]"}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-800">
                                    <span className="font-black text-zinc-500">RG/CPF:</span> {testemunha.rg || "[N/I]"} | {testemunha.cpf || "[N/I]"}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-800">
                                    <span className="font-black text-zinc-500">Nascimento/Telefone:</span> {testemunha.nasc || "[N/I]"} | {testemunha.telefone || "[N/I]"}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-800">
                                    <span className="font-black text-zinc-500">Mãe:</span> {testemunha.mae || "[N/I]"}
                                  </p>
                                  <p className="whitespace-pre-wrap text-sm font-medium text-zinc-800">
                                    <span className="font-black text-zinc-500">Endereço:</span> {testemunha.endereco || "[N/I]"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                            Síntese Operacional
                          </p>
                          <h4 className="mt-1 text-base font-black text-zinc-900">
                            Rascunho para Confecção do REDS
                          </h4>
                        </div>
                        <div className="mt-4 space-y-4">
                          {dinamicaResumida.map(([label, valor]) => (
                            <div key={label}>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                {label}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-800">
                                {valor}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {dadosNormalizados.historicoNarrado && (
                        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                            Histórico Falado
                          </p>
                          <h4 className="mt-1 text-base font-black text-zinc-900">
                            Texto Capturado por Ditado para Revisão
                          </h4>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
                            {dadosNormalizados.historicoNarrado}
                          </p>
                        </section>
                      )}

                      {anexosFoto.length > 0 && (
                        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                            Anexos Fotográficos
                          </p>
                          <h4 className="mt-1 text-base font-black text-zinc-900">
                            Registros Visuais Vinculados à Qualificação
                          </h4>
                          <div className="mt-4 space-y-4">
                            {anexosFoto.map((foto, index) => (
                              <figure
                                key={foto.id}
                                className="overflow-hidden rounded-xl border border-zinc-200 bg-white print:break-inside-avoid print:border-zinc-300"
                              >
                                <img
                                  src={foto.previewUrl}
                                  alt={`Foto anexada ${index + 1}`}
                                  loading="eager"
                                  decoding="sync"
                                  className="h-auto max-h-[420px] w-full object-contain bg-zinc-100 print:max-h-[520px]"
                                />
                                <figcaption className="px-3 py-2 text-[11px] font-medium text-zinc-600">
                                  Anexo {index + 1}: {foto.name} • {formatFileSize(foto.size)}
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </section>
                      )}

                      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 print:border-zinc-300 print:bg-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                          Prompt Para IA
                        </p>
                        <h4 className="mt-1 text-base font-black text-zinc-900">
                          Texto a Ser Usado na Geração do Histórico Final
                        </h4>
                        <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-4 text-[11px] leading-relaxed text-zinc-800 print:border-zinc-300">
                          {promptIa}
                        </pre>
                      </section>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Texto Corrido para Cópia
                    </span>
                    <button
                      onClick={() => copyToClipboard(textoReds)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                      Texto
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-96 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {textoReds}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      REDS Padrão de Referência
                    </span>
                    <button
                      onClick={() => copyToClipboard(redsPadraoReferencia)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                      Modelo
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {redsPadraoReferencia}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Prompt Sugerido Para IA
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptIa)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                      Prompt
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {promptIa}
                  </pre>
                </div>
              </>
            );
          })()}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm print:hidden">
            <div className="flex items-start space-x-3">
              <Clock3
                className="w-5 h-5 flex-shrink-0 text-amber-700 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">
                  Prazo para 2ª Resposta
                </p>
                <p className="text-sm leading-relaxed text-amber-900 font-medium">
                  {prazoSegundaRespostaFormatado ? (
                    <>
                      Caso a ocorrência exija visita de 2ª resposta, ela deve
                      ser realizada até{" "}
                      <strong>{prazoSegundaRespostaFormatado}</strong>,
                      considerando o prazo de 72 horas a partir do fato
                      informado.
                    </>
                  ) : (
                    <>
                      Caso a ocorrência exija visita de 2ª resposta, ela deve
                      ser realizada em até <strong>72 horas</strong> após o
                      fato. Preencha corretamente a data e hora do fato para o
                      sistema calcular o prazo exato.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 print:hidden">
            <button
              onClick={handlePrev}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={() => {
                clearDraft(DRAFT_STORAGE_KEYS.primeira);
                setTelaAtual("home");
              }}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide"
            >
              <CheckCircle2
                className="mr-2 w-5 h-5 text-yellow-500"
                strokeWidth={2.5}
              />{" "}
              Finalizar
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
  const segundaDraft = readDraft(DRAFT_STORAGE_KEYS.segunda);
  const segundaDraftDados = segundaDraft?.dados || {};
  const segundaDadosIniciais = {
    ...createInitialSegundaDados(),
    ...segundaDraftDados,
    vitima: {
      ...createEmptyPerson(),
      ...(segundaDraftDados.vitima || {}),
    },
  };
  const [step, setStep] = useState(sanitizeStep(segundaDraft?.step, 1, 3));
  const [dados, setDados] = useState(segundaDadosIniciais);

  const [openPessoaIndex, setOpenPessoaIndex] = useState(
    typeof segundaDraft?.openPessoaIndex === "string" ||
      segundaDraft?.openPessoaIndex === null
      ? segundaDraft.openPessoaIndex
      : "vitima",
  );
  const [fonar2, setFonar2] = useState(
    Array.isArray(segundaDraft?.fonar2) && segundaDraft.fonar2.length === 19
      ? segundaDraft.fonar2
      : Array(19).fill(""),
  );
  const [validationErrors, setValidationErrors] = useState([]);
  const updateVitima = (field, val) =>
    setDados({ ...dados, vitima: { ...dados.vitima, [field]: val } });
  const vitimaNaoLocalizada = dados.vitimaLocalizada === "Não";
  const precisaConfirmarFonar =
    dados.vitimaLocalizada === "Sim" && !vitimaNaoLocalizada;
  const fonarStatusPendente =
    precisaConfirmarFonar && !dados.fonarPreenchidoPrimeiraResposta;
  const exigeFonarAgora = dados.fonarPreenchidoPrimeiraResposta === "nao";
  const fonar2Incompleto =
    exigeFonarAgora && !vitimaNaoLocalizada && fonar2.includes("");
  const bloqueiaGeracaoRelatorio =
    !dados.vitimaLocalizada || fonarStatusPendente || fonar2Incompleto;
  const simCount2 = fonar2.filter((a) => a === "sim").length;
  const nsNaCount2 = fonar2.filter((a) => a === "nsna").length;
  const riscoFonar2 =
    exigeFonarAgora && !fonar2Incompleto
      ? calcularRisco(simCount2, nsNaCount2)
      : null;
  const dadosNormalizados = normalizeSegundaDados(dados);
  const step1ValidationErrors = [
    ...validatePerson(dados.vitima, "Vítima"),
    ...(validateReds(dados.redsOrigem)
      ? []
      : ["Número do REDS de origem inválido. Use o formato AAAA-#########-###."]),
  ];
  const step2ValidationErrors = [
    ...(!validateDateTime(dados.dataHoraVisita)
      ? ["Data/hora da visita inválida. Use o formato DD/MM/AAAA HH:MM."]
      : []),
  ];

  let respostasFonar2 = "";
  const vitimaLocalizadaId = useId();
  const fonarPreenchidoId = useId();
  const estadoVitimaId = useId();
  const novoFatoId = useId();
  const descumprimentoMpuId = useId();
  const localSeguroId = useId();
  const apoioRedeId = useId();
  const resumoId = useId();
  const encaminhamentoId = useId();

  const validateCurrentStep = () => {
    if (step === 1) return step1ValidationErrors;
    if (step === 2) return step2ValidationErrors;
    return [];
  };

  const handleDiscardDraft = () => {
    clearDraft(DRAFT_STORAGE_KEYS.segunda);
    setStep(1);
    setDados(createInitialSegundaDados());
    setOpenPessoaIndex("vitima");
    setFonar2(Array(19).fill(""));
    setValidationErrors([]);
    showToast("Rascunho local descartado.");
  };

  useEffect(() => {
    saveDraft(DRAFT_STORAGE_KEYS.segunda, {
      telaAtual: "segunda",
      step,
      dados,
      fonar2,
      openPessoaIndex,
    });
  }, [step, dados, fonar2, openPessoaIndex]);
  if (exigeFonarAgora && !fonar2Incompleto) {
    perguntasFonar.forEach((pergunta, index) => {
      let resp = "NÃO INFORMADO";
      if (fonar2[index] === "sim") resp = "SIM";
      else if (fonar2[index] === "nao") resp = "NÃO";
      else if (fonar2[index] === "nsna") resp = "NÃO SABE / N/A";
      respostasFonar2 += `${index + 1}. ${pergunta}\n-> R: ${resp}\n\n`;
    });
  }

  const textoReds2 = `=========================================
ATENDIMENTO DE 2ª RESPOSTA - VISITA TRANQUILIZADORA
=========================================
Natureza principal no REDS: A 20.002 - Visita tranquilizadora para vítima de violência doméstica
Natureza secundária no REDS: U 33.004 - Atendimento de denúncia de infrações contra a mulher (violência doméstica)
REDS de Origem: ${dadosNormalizados.redsOrigem || "[PENDENTE - COMPLEMENTAR NO HISTÓRICO]"}

[ DADOS DA VÍTIMA ]
Nome: ${dadosNormalizados.vitima.nome || "[N/I]"}
RG: ${dadosNormalizados.vitima.rg || "[N/I]"} | CPF: ${dadosNormalizados.vitima.cpf || "[N/I]"}
Data Nasc: ${dadosNormalizados.vitima.nasc || "[N/I]"}
Nome da Mãe: ${dadosNormalizados.vitima.mae || "[N/I]"}
Telefone: ${dadosNormalizados.vitima.telefone || "[N/I]"}
Endereço: ${dadosNormalizados.vitima.endereco || "[N/I]"}

[ DADOS DA VISITA ]
Data / hora da visita: ${dadosNormalizados.dataHoraVisita || "[N/I]"}
Local da visita: ${dadosNormalizados.localVisita || "[N/I]"}
Vítima localizada: ${dadosNormalizados.vitimaLocalizada || "[N/I]"}
Forma do contacto: ${dadosNormalizados.formaContato || "[N/I]"}
Contexto da ocorrência anterior: ${dadosNormalizados.contextoOcorrenciaAnterior || "[N/I]"}
Estado atual da vítima: ${dadosNormalizados.estadoVitima || "[N/I]"}
Novo fato após o REDS anterior: ${dadosNormalizados.novoFato || "[N/I]"}
Descumprimento de MPU: ${dados.descumprimentoMpu ? "SIM" : "NÃO"}
Local seguro / situação atual: ${dadosNormalizados.localSeguro || "[N/I]"}
Necessidade de apoio / rede: ${dadosNormalizados.apoioRede || "[N/I]"}

[ SITUAÇÃO ATUAL ]
Novos contactos ou ameaças do autor? ${dados.contatoAutor ? "SIM" : "NÃO"}
MPU deferida e vigente? ${dados.mpuVigente ? "SIM" : "NÃO"}

[ SÍNTESE DA VISITA ]
${dadosNormalizados.resumo || "[NÃO INFORMADO]"}

[ ENCAMINHAMENTO FINAL ]
${dadosNormalizados.encaminhamentoFinal || "[NÃO INFORMADO]"}

[ FONAR ]
FONAR preenchido na 1ª resposta? ${
  dados.fonarPreenchidoPrimeiraResposta === "sim"
    ? "SIM"
    : dados.fonarPreenchidoPrimeiraResposta === "nao"
      ? "NÃO"
      : "[N/I]"
}
${
  vitimaNaoLocalizada
    ? "Não foi possível complementar o FONAR nesta 2ª resposta, pois a vítima não foi localizada."
    :
  exigeFonarAgora && riscoFonar2
    ? `FONAR preenchido nesta 2ª resposta: SIM\nRisco Calculado: ${riscoFonar2.nivel.toUpperCase()}\n(Respostas SIM: ${simCount2} | Respostas NS/NA: ${nsNaCount2})\n\nRespostas Detalhadas:\n${respostasFonar2.trim()}`
    : exigeFonarAgora
      ? "FONAR preenchido nesta 2ª resposta: PENDENTE"
      : "Mantém-se o FONAR realizado na 1ª resposta."
}

[ TRIAGEM DA GUARNIÇÃO ]
${
  dados.riscoElevado
    ? `-> Constatado RISCO ELEVADO in loco.\n-> Relação íntima: ${dados.relacaoIntima ? "SIM" : "NÃO"}.\n-> A P3 DEVE SER CIENTIFICADA PARA ENCAMINHAMENTO À RpPM (TERCEIRA RESPOSTA).`
    : "-> Não foi constatado risco iminente. Vítima orientada a ligar 190 caso necessário."
}`;

  return (
    <div className="p-5 pb-24 print:p-0 print:pb-0">
      <ProgressBar
        step={step}
        total={3}
        labels={["Qualificação", "Visita", "Relatório"]}
      />

      <div className="mt-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handleDiscardDraft}
          className={`rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-700 transition hover:bg-zinc-100 ${buttonFocusClassName}`}
        >
          Limpar dados
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Qualificação
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Dados da vítima para lançamento do REDS da 2ª resposta.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">
                Nº do REDS (Origem)
              </label>
                <input
                  type="text"
                  placeholder="Ex: 2026-000123456-001"
                  className={fieldClassName}
                  value={dados.redsOrigem}
                  onChange={(e) =>
                  setDados({
                    ...dados,
                    redsOrigem: normalizeReds(e.target.value),
                  })
                  }
                />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
              <Info
                className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5"
                strokeWidth={2}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">
                  REDS Obrigatório
                </span>
                <p className="text-sm leading-relaxed text-amber-900 font-medium">
                  É <strong>importantíssimo</strong> registrar o{" "}
                  <strong>REDS da 2ª resposta</strong>. Se o número do REDS de
                  origem não estiver disponível no momento, não deixe de
                  produzir o registro: complemente essa informação no histórico
                  assim que a tiver em mãos.
                </p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
              <Info
                className="w-5 h-5 flex-shrink-0 text-zinc-500 mt-0.5"
                strokeWidth={2}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1">
                  Natureza da 2ª Resposta
                </span>
                <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                  Na visita tranquilizadora, a natureza principal é a que
                  começa com <strong>A</strong>:{" "}
                  <strong>A 20.002 - Visita tranquilizadora para vítima de violência doméstica</strong>.
                  A <strong>U 33.004</strong> permanece como natureza
                  secundária no REDS, conforme a instrução.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
              <AlertTriangle
                className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5"
                strokeWidth={2.5}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">
                  Envolvimento de Policial Militar
                </span>
                <p className="text-sm leading-relaxed text-red-900 font-medium">
                  Se a vítima ou o autor forem policiais militares,{" "}
                  <strong>não se cumpre a 2ª resposta</strong>. Nessa hipótese,
                  anuncie o <strong>CPU imediatamente</strong> e providencie o
                  encaminhamento conforme o protocolo de 3ª resposta.
                </p>
              </div>
            </div>

            {/* ALERTA QAPP */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm mt-4">
              <AlertTriangle
                className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5"
                strokeWidth={2.5}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1">
                  Aviso de Segurança
                </span>
                <p className="text-sm leading-relaxed text-red-900 font-medium">
                  Consulte obrigatoriamente o <strong>QAPP / ISP</strong> para
                  verificar a situação de todos os envolvidos e confirmar a
                  existência de Mandados de Prisão em aberto.
                </p>
              </div>
            </div>

            <FormPessoaAccordion
              title="Vítima"
              isOpen={openPessoaIndex === "vitima"}
              onToggle={() =>
                setOpenPessoaIndex(
                  openPessoaIndex === "vitima" ? null : "vitima",
                )
              }
              data={dados.vitima}
              onChange={updateVitima}
            />
          </div>

          <button
            onClick={() => {
              const errors = validateCurrentStep();
              if (errors.length > 0) {
                setValidationErrors(errors);
                window.scrollTo(0, 0);
                return;
              }
              setValidationErrors([]);
              setStep(2);
            }}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide mt-8"
          >
            Avançar{" "}
            <ChevronRight
              className="ml-2 w-5 h-5 text-yellow-500"
              strokeWidth={2.5}
            />
          </button>

          {validationErrors.length > 0 && (
            <ValidationMessage
              tone="error"
              message={validationErrors.join(" ")}
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Visita Tranquilizadora
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              2ª Resposta (Pós Emergência)
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
            <UserCheck
              className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5"
              strokeWidth={2}
            />
            <p className="text-sm leading-relaxed text-zinc-600 font-medium">
              A visita deve ser feita em até{" "}
              <strong className="text-zinc-900">72 horas</strong> após o facto.
              Chegue de forma discreta para proteger a vítima e não deixe de
              formalizar o atendimento no <strong>REDS</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">
                Dados da Visita
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Data / Hora
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 06/04/2026 14:30"
                    className={fieldClassName}
                    value={dados.dataHoraVisita}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        dataHoraVisita: normalizeDateTime(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Local da Visita
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: residência da vítima"
                    className={fieldClassName}
                    value={dados.localVisita}
                    onChange={(e) =>
                      setDados({ ...dados, localVisita: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={vitimaLocalizadaId}
                    className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1"
                  >
                    Vítima Localizada?
                  </label>
                  <select
                    id={vitimaLocalizadaId}
                    className={fieldClassName}
                    value={dados.vitimaLocalizada}
                    onChange={(e) =>
                      setDados({ ...dados, vitimaLocalizada: e.target.value })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                    Forma do Contacto
                  </label>
                  <select
                    className={fieldClassName}
                    value={dados.formaContato}
                    onChange={(e) =>
                      setDados({ ...dados, formaContato: e.target.value })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Telefone">Telefone</option>
                    <option value="Terceiro">Terceiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1">
                  Contexto da Ocorrência Anterior
                </label>
                <textarea
                  rows="4"
                  className={fieldClassName}
                  value={dados.contextoOcorrenciaAnterior}
                  onChange={(e) =>
                    setDados({
                      ...dados,
                      contextoOcorrenciaAnterior: e.target.value,
                    })
                  }
                  placeholder="Ex: data da ocorrência anterior, natureza principal anterior, síntese do fato, se houve flagrante, MPU e situação do autor. Use este campo para lembrar o que confirmar com a vítima."
                ></textarea>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <MessageCircleQuestion
                    className="w-5 h-5 flex-shrink-0 text-yellow-700 mt-0.5"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-[11px] font-black text-yellow-800 uppercase tracking-widest mb-1">
                      Conferência do FONAR
                    </p>
                    <p className="text-sm leading-relaxed text-yellow-900 font-medium">
                      Caso o FONAR não tenha sido preenchido na 1ª resposta, é
                      necessário realizá-lo agora antes de concluir o REDS.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={fonarPreenchidoId}
                    className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1"
                  >
                    O FONAR foi preenchido na 1ª resposta?
                  </label>
                  <select
                    id={fonarPreenchidoId}
                    className={fieldClassName}
                    value={dados.fonarPreenchidoPrimeiraResposta}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        fonarPreenchidoPrimeiraResposta: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>

              {vitimaNaoLocalizada && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-1.5">
                    Vítima Não Localizada
                  </p>
                  <p className="text-sm leading-relaxed text-red-900 font-medium">
                    Se a vítima não for localizada, registre objetivamente no
                    histórico as diligências realizadas e a tentativa sem êxito.
                    Na 2ª resposta, a instrução prevê o registro no REDS com as
                    mesmas naturezas da visita tranquilizadora, consignando a
                    não localização da vítima.
                  </p>
                </div>
              )}
            </div>

            {!vitimaNaoLocalizada && (
              <div className="space-y-2.5">
              <CheckboxCard
                label="O autor voltou a procurá-la/ameaçá-la?"
                checked={dados.contatoAutor}
                onChange={(e) =>
                  setDados({ ...dados, contatoAutor: e.target.checked })
                }
              />
              <CheckboxCard
                label="O juiz já deferiu a Medida Protetiva?"
                checked={dados.mpuVigente}
                onChange={(e) =>
                  setDados({ ...dados, mpuVigente: e.target.checked })
                }
              />
              </div>
            )}

            {!vitimaNaoLocalizada && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl space-y-4 shadow-sm mt-4">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />{" "}
                Triagem RpPM Especializada
              </p>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-red-900 leading-snug w-4/5">
                  Você percebe RISCO ELEVADO de nova agressão?
                </span>
                <input
                  type="checkbox"
                  className={`w-5 h-5 rounded border-red-300 text-red-500 bg-white ${buttonFocusClassName}`}
                  checked={dados.riscoElevado}
                  onChange={(e) =>
                    setDados({ ...dados, riscoElevado: e.target.checked })
                  }
                />
              </label>

              {dados.riscoElevado && (
                <div className="pt-4 border-t border-red-200/60 animate-in fade-in duration-300">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-bold text-red-800 leading-snug w-4/5">
                      É relação íntima? (Marido, Namorado, Ex)
                    </span>
                    <input
                      type="checkbox"
                      className={`w-5 h-5 rounded border-red-300 text-red-500 bg-white ${buttonFocusClassName}`}
                      checked={dados.relacaoIntima}
                      onChange={(e) =>
                        setDados({ ...dados, relacaoIntima: e.target.checked })
                      }
                    />
                  </label>
                </div>
              )}
              </div>
            )}

            {exigeFonarAgora && !vitimaNaoLocalizada && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px]">
                    FONAR Pendente
                  </h3>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed font-medium">
                    Como o FONAR não foi preenchido na 1ª resposta, complete a
                    entrevista agora para prosseguir com o REDS.
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl flex items-start space-x-3">
                  <MessageCircleQuestion
                    className="w-5 h-5 flex-shrink-0 text-zinc-400 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                    Responda às 19 questões. O sistema só libera o relatório
                    após o preenchimento completo.
                  </p>
                </div>

                <div className="space-y-3">
                  {perguntasFonar.map((pergunta, idx) => (
                    <FonarQuestionCard
                      key={idx}
                      pergunta={pergunta}
                      idx={idx}
                      value={fonar2[idx]}
                      onChange={(nextValue) => {
                        const nf = [...fonar2];
                        nf[idx] = nextValue;
                        setFonar2(nf);
                      }}
                    />
                  ))}
                </div>

                {riscoFonar2 && (
                  <div
                    className={`${riscoFonar2.cor} text-white p-4 rounded-2xl text-center shadow-lg border border-black/10`}
                  >
                    <p className="text-[10px] font-black opacity-90 uppercase tracking-widest mb-1 text-white/80">
                      Nível de Risco Calculado no FONAR
                    </p>
                    <p className="text-2xl font-black uppercase tracking-widest drop-shadow-sm">
                      {riscoFonar2.nivel}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!vitimaNaoLocalizada && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-4">
              <h3 className="font-black text-zinc-800 uppercase tracking-widest text-[11px] border-b border-zinc-100 pb-2">
                Situação Atual e Encaminhamento
              </h3>
              <div>
                <label
                  htmlFor={estadoVitimaId}
                  className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1"
                >
                  Estado Atual da Vítima
                </label>
                <input
                  id={estadoVitimaId}
                  type="text"
                  placeholder="Ex: calma, abalada, na casa de familiar, com medo"
                  className={fieldClassName}
                  value={dados.estadoVitima}
                  onChange={(e) =>
                    setDados({ ...dados, estadoVitima: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={novoFatoId}
                  className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1"
                >
                  Novo Fato Após o REDS
                </label>
                <input
                  id={novoFatoId}
                  type="text"
                  placeholder="Ex: não houve / novas mensagens / nova ameaça verbal"
                  className={fieldClassName}
                  value={dados.novoFato}
                  onChange={(e) =>
                    setDados({ ...dados, novoFato: e.target.value })
                  }
                />
              </div>
              <label
                htmlFor={descumprimentoMpuId}
                className="flex items-center justify-between cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
              >
                <span className="text-sm font-bold text-zinc-800">
                  Houve descumprimento de MPU?
                </span>
                <input
                  id={descumprimentoMpuId}
                  type="checkbox"
                  className={`w-5 h-5 rounded border-zinc-300 text-yellow-500 bg-white ${buttonFocusClassName}`}
                  checked={dados.descumprimentoMpu}
                  onChange={(e) =>
                    setDados({ ...dados, descumprimentoMpu: e.target.checked })
                  }
                />
              </label>
              <div>
                <label
                  htmlFor={localSeguroId}
                  className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1"
                >
                  Local Seguro / Situação Atual
                </label>
                <input
                  id={localSeguroId}
                  type="text"
                  placeholder="Ex: permanece no local / foi para casa da mãe / endereço alterado"
                  className={fieldClassName}
                  value={dados.localSeguro}
                  onChange={(e) =>
                    setDados({ ...dados, localSeguro: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={apoioRedeId}
                  className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1"
                >
                  Necessidade de Apoio / Rede
                </label>
                <input
                  id={apoioRedeId}
                  type="text"
                  placeholder="Ex: CEAM Bem-Me-Quero, DEAM, NUDEM, apoio familiar, atendimento médico"
                  className={fieldClassName}
                  value={dados.apoioRede}
                  onChange={(e) =>
                    setDados({ ...dados, apoioRede: e.target.value })
                  }
                />
              </div>
              </div>
            )}

            <div>
              <label
                htmlFor={resumoId}
                className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1 mt-2"
              >
                {vitimaNaoLocalizada
                  ? "Resumo das Diligências"
                  : "Resumo da Visita"}
              </label>
              <textarea
                id={resumoId}
                rows="3"
                className={fieldClassName}
                value={dados.resumo}
                onChange={(e) => setDados({ ...dados, resumo: e.target.value })}
                placeholder={
                  vitimaNaoLocalizada
                    ? "Ex: Guarnição compareceu ao local, realizou contacto telefónico e diligências no endereço, porém a vítima não foi localizada."
                    : "Ex: A vítima encontra-se calma. Foi orientada a ligar 190 se o autor aparecer."
                }
              ></textarea>
            </div>
            <div>
              <label
                htmlFor={encaminhamentoId}
                className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1 mt-2"
              >
                Encaminhamento Final
              </label>
              <textarea
                id={encaminhamentoId}
                rows="3"
                className={fieldClassName}
                value={dados.encaminhamentoFinal}
                onChange={(e) =>
                  setDados({ ...dados, encaminhamentoFinal: e.target.value })
                }
                placeholder={
                  vitimaNaoLocalizada
                    ? "Ex: Registro realizado consignando a tentativa sem êxito; P3 cientificada para acompanhamento."
                    : "Ex: vítima orientada, P3 cientificada, encaminhamento à RpPM, retorno se necessário."
                }
              ></textarea>
            </div>
          </div>

          {!dados.vitimaLocalizada && (
            <ValidationMessage message="Informe se a vítima foi localizada para continuar o fluxo da 2ª resposta." />
          )}

          {dados.vitimaLocalizada &&
            !vitimaNaoLocalizada &&
            !dados.fonarPreenchidoPrimeiraResposta && (
              <ValidationMessage message="Indique se o FONAR já foi preenchido na 1ª resposta antes de gerar o relatório." />
            )}

          {exigeFonarAgora && !vitimaNaoLocalizada && fonar2Incompleto && (
            <ValidationMessage message="Complete as 19 respostas do FONAR pendente para liberar o relatório." />
          )}

          {validationErrors.length > 0 && (
            <ValidationMessage
              tone="error"
              message={validationErrors.join(" ")}
            />
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                setValidationErrors([]);
                setStep(1);
              }}
              className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => {
                const errors = validateCurrentStep();
                if (errors.length > 0) {
                  setValidationErrors(errors);
                  window.scrollTo(0, 0);
                  return;
                }
                setValidationErrors([]);
                setStep(3);
              }}
              disabled={bloqueiaGeracaoRelatorio}
              aria-disabled={bloqueiaGeracaoRelatorio}
              className={`flex-1 font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all tracking-wide ${buttonFocusClassName} ${
                bloqueiaGeracaoRelatorio
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-950 hover:bg-zinc-800 text-white active:scale-[0.98]"
              }`}
            >
              Gerar Relatório{" "}
              <ChevronRight
                className={`ml-2 w-5 h-5 ${
                  bloqueiaGeracaoRelatorio
                    ? "text-zinc-300"
                    : "text-yellow-500"
                }`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="print:hidden">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Relatório Estruturado
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Lista com os dados apurados para o REDS.
            </p>
          </div>

          {(() => {
            const redsPadraoVisita = modelosOficiais[2].texto;
            const promptIaVisita = `Com base nos dados abaixo, redija um histórico policial de 2ª resposta (visita tranquilizadora) para REDS, em português formal, objetivo, técnico e impessoal.

Regras:
- Use apenas os dados fornecidos.
- Não invente fatos.
- Se algum dado estiver ausente, omita ou utilize redação neutra.
- Se a vítima não tiver sido localizada, redija o histórico consignando objetivamente as diligências realizadas, a tentativa sem êxito e a impossibilidade de colher declarações da vítima nesta oportunidade.
- Se o número do REDS de origem estiver pendente, mantenha essa informação expressa para complementação posterior no histórico.
- Organize o texto em narrativa corrida, no padrão policial militar.
- Considere o modelo de referência abaixo apenas como base de estilo.

MODELO DE REFERÊNCIA:
${redsPadraoVisita}

DADOS APURADOS:
${textoReds2}

TAREFA:
Produza somente o histórico final da 2ª resposta, pronto para revisão policial.`;

            return (
              <>
                {dados.riscoElevado && dados.relacaoIntima ? (
                  <div className="bg-red-50 border border-red-100 p-6 rounded-2xl shadow-sm text-center print:hidden">
                    <AlertTriangle
                      className="w-10 h-10 mx-auto mb-3 text-red-500 animate-pulse"
                      strokeWidth={2}
                    />
                    <p className="font-black text-lg text-red-900 tracking-wide">
                      Repassar à RpPM
                    </p>
                    <p className="text-sm mt-2 text-red-700 font-medium leading-relaxed">
                      Alerte a P3 da sua Unidade. Este caso necessita do{" "}
                      <strong className="font-bold">
                        Protocolo de Terceira Resposta
                      </strong>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm text-center print:hidden">
                    <CheckCircle2
                      className="w-10 h-10 mx-auto mb-3 text-emerald-500"
                      strokeWidth={2}
                    />
                    <p className="font-black text-lg text-emerald-900 tracking-wide">
                      Monitoramento Básico
                    </p>
                    <p className="text-sm mt-2 text-emerald-700 font-medium leading-relaxed">
                      Finalize o REDS da 2ª resposta e complemente o número do
                      REDS de origem no histórico, caso ele ainda esteja
                      pendente. A equipa multimissão voltará a fazer visitas se
                      a P3 julgar necessário.
                    </p>
                  </div>
                )}

                <div
                  className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm mt-6 print:border-none print:shadow-none print:p-0"
                  id="print-area-2"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2 print:hidden">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Dados Estruturados
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Printer className="w-4 h-4 mr-1.5" strokeWidth={2} />{" "}
                        Imprimir
                      </button>
                      <button
                        onClick={() => copyToClipboard(textoReds2)}
                        className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} />{" "}
                        Copiar
                      </button>
                    </div>
                  </div>
                  <pre className="text-[11px] text-zinc-600 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-96 overflow-y-auto border border-zinc-100 leading-relaxed print:max-h-full print:bg-white print:border-none print:text-black print:text-[12px] print:overflow-visible">
                    {textoReds2}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Modelo Padrão da 2ª Resposta
                    </span>
                    <button
                      onClick={() => copyToClipboard(redsPadraoVisita)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                      Modelo
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {redsPadraoVisita}
                  </pre>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm print:hidden">
                  <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
                    <span className="text-[11px] font-black text-zinc-500 tracking-widest uppercase ml-1">
                      Prompt Sugerido Para IA
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptIaVisita)}
                      className="bg-zinc-100 hover:bg-yellow-500 text-zinc-700 hover:text-zinc-950 py-2 px-3 rounded-xl text-xs flex items-center font-bold transition-colors active:scale-95 shadow-sm"
                    >
                      <Copy className="w-4 h-4 mr-1.5" strokeWidth={2} /> Copiar
                      Prompt
                    </button>
                  </div>
                  <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap font-mono bg-zinc-50/50 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-100 leading-relaxed shadow-inner">
                    {promptIaVisita}
                  </pre>
                </div>

                <div className="flex space-x-3 pt-4 print:hidden">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold p-4 rounded-2xl transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => {
                      clearDraft(DRAFT_STORAGE_KEYS.segunda);
                      setTelaAtual("home");
                    }}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] tracking-wide"
                  >
                    <Save
                      className="mr-2 w-5 h-5 text-yellow-500"
                      strokeWidth={2.5}
                    />{" "}
                    Finalizar
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
