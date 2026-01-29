import {
  Landmark,
  Calculator,
  Laptop,
  Languages,
  BookText,
  Sigma,
  DollarSign,
  Handshake,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

export interface Video {
  id: string;
  title: string;
}

export interface Subject {
  id: string;
  name: string;
  Icon: ComponentType<{ className?: string }>;
  videos: Video[];
}

export const allSubjects: Subject[] = [
  {
    id: 'atualidades-mercado-financeiro',
    name: 'Atualidades do Mercado Financeiro',
    Icon: DollarSign,
    videos: [
      { id: 'IkBEqH7XqMw', title: 'Aula 01: Os Bancos na Era Digital - Concurso Banco do Brasil 2026' },
      { id: '91Q649deToQ', title: 'Aula 02: Internet Banking e Mobile Banking - Concurso Banco do Brasil 2026' },
      { id: 'Dkah92iOGbc', title: 'Aula 03: Open Finance - Concurso Banco do Brasil 2026' },
      { id: 'abQJrWuMAkI', title: 'Aula 04: Real Digital (DREX) - Concurso Banco do Brasil 2026' },
      { id: 'Anb1JkK9Z-8', title: 'Aula 05: Novos Modelos de Negócios e Marketplace - Concurso Banco do Brasil 2026' },
      { id: 'LvEBgyZUABM', title: 'Aula 06: Fintechs - Concurso Banco do Brasil 2026' },
      { id: '1Q4vVop-e1I', title: 'Aula 07: Startups e Big Techs - Concurso Banco do Brasil 2026' },
    ],
  },
  {
    id: 'conhecimentos-bancarios',
    name: 'Conhecimentos Bancários',
    Icon: Landmark,
    videos: [
      { id: 'QYINo30yDvA', title: 'Aula 01: Estrutura do Sistema Financeiro Nacional - Curso Concurso Banco do Brasil 2026' },
      { id: '-QVN-QY-64k', title: 'Aula 02: CMN - Concurso Banco do Brasil 2026' },
      { id: 'lE3813BgqW8', title: 'Aula 03: BACEN - Concurso Banco do Brasil 2026' },
      { id: '-Ph8Nl40Jrc', title: 'Aula 04: Copom - Concurso Banco do Brasil 2026' },
      { id: 'WFh0l76FSbA', title: 'Aula 05: CVM - Concurso Banco do Brasil 2026' },
      { id: 'yP7uR_TPoqg', title: 'Aula 06: Outras Instituições Normativas e Supervisoras - Concurso Banco do Brasil 2026' },
      { id: 'kXkUlTZRrMs', title: 'Aula 07: Conselhos Recursais - Concurso Banco do Brasil 2026' },
      { id: 'uOGAaSZxkmM', title: 'Aula 08: Instituições Auxiliares - Concurso Banco do Brasil 2026' },
      { id: 'GstsVDC4Svk', title: 'Aula 09: Operadores Monetários - Concurso Banco do Brasil 2026' },
      { id: 'kyVFwVsiwkI', title: 'Aula 10: Operadores Não Monetários - Concurso Banco do Brasil 2026' },
      { id: 'gLOXuIDKocY', title: 'Aula 11: Mercado Financeiro e seus Desdobramentos - Concurso Banco do Brasil 2026' },
      { id: 'XHW3Qji-k8Q', title: 'Aula 12: Políticas Monetárias Convencionais e Não-Convencionais - Concurso Banco do Brasil 2026' },
      { id: 'EwrJ0TQ5eRE', title: 'Aula 13: SELIC, Operações Compromissadas e Depósitos Remunerados - Concurso Banco do Brasil 2026' },
      { id: 'v-8EuvmYOJ0', title: 'Aula 14: Orçamento Público - Concurso Banco do Brasil 2026' },
      { id: 'wakQvmAye5g', title: 'Aula 15: Títulos do Tesouro Nacional - Concurso Banco do Brasil 2026' },
      { id: 'xADMU0zdyWU', title: 'Aula 16: Dívida Pública - Concurso Banco do Brasil 2026' },
      { id: 'M1IjDnVplA0', title: 'Aula 17: Cartão de Débito e Cartão de Crédito - Concurso Banco do Brasil 2026' },
      { id: 'Zg-PnxLbAWY', title: 'Aula 18: Crédito Pessoal e Crédito Direto ao Consumidor (CDC) - Concurso Banco do Brasil 2026' },
      { id: '2tO2D0WWqWw', title: 'Aula 19: Crédito Rural - Concurso Banco do Brasil 2026' },
      { id: 'w0CoaWJWb2k', title: 'O Melhor Simulado! v1' },
      { id: 'EkneN1-Meuc', title: 'O Melhor Simulado! v2' },
      { id: 'Gemuc6XVQ2w', title: 'O Melhor Simulado! v3' },
      { id: 'tIeKGuzYWPs', title: 'O Melhor Simulado! v4' },
      { id: 'Sd6Vkw30mkM', title: 'O Melhor Simulado! v5' },
    ],
  },
  {
    id: 'informatica',
    name: 'Informática',
    Icon: Laptop,
    videos: [
      { id: 'AeEsINT_VJQ', title: 'Aula 1: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'QVj23_2IqRY', title: 'Aula 2: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'qFM_iqRn7Yo', title: 'Aula 3: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'en0x7Kjqn4A', title: 'Aula 4: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'F3n9HzqIGfs', title: 'Aula 5: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'G4f86RjsBK4', title: 'Aula 6: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'RTp5MaOo4qo', title: 'Aula 7: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
      { id: '6wWtx7fhLgI', title: 'Aula 8: Noções de Sistemas Operacionais - CONCURSO BANCO DO BRASIL 2025' },
    ],
  },
  {
    id: 'lingua-inglesa',
    name: 'Língua Inglesa',
    Icon: Languages,
    videos: [
        { id: 'am_ee1mXY7k', title: 'Aula 1: Interpretação de Textos em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'T6Jiwgfm_Vg', title: 'Aula 2: Interpretação de Textos em Inglês - CONCURSO BANCO DO BRASIL 2024' },
        { id: '-CSByuSIp94', title: 'Aula 3: Pronomes em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'etxFXj9xaUQ', title: 'Aula 4: Pronomes em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: '3pP_36Yvt9Y', title: 'Aula 5: Pronomes em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'qQTwJfzoLEs', title: 'Aula 6: Artigos em Inglês -CONCURSO BANCO DO BRASIL 2025' },
        { id: 'Ef6tAGgVyKQ', title: 'Aula 7: Artigos em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: '9gW70aNR8oI', title: 'Aula 8: Conectivos do Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'tcOiiQl-W8U', title: 'Aula 9: Conjunções Subordinativas em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'iLSSGGnz_c8', title: 'Aula 10: Advérbios em Inglês -CONCURSO BANCO DO BRASIL 2025' },
        { id: 'HFQ2oGp6uXg', title: 'Aula 11: Advérbios em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'gUxMy3RyyR4', title: 'Aula 12: Advérbios em Inglês - CONCURSO BANCO DO BRASIL 2025' },
        { id: 'gkokJEryZ4g', title: 'Aula 13: Advérbios em Inglês - CONCURSO BANCO DO BRASIL 2025' },
    ],
  },
  {
    id: 'lingua-portuguesa',
    name: 'Língua Portuguesa',
    Icon: BookText,
    videos: [
      { id: 'q8BvgNRGodU', title: 'Aula 1: Interpretação de Textos - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'YCHLzdFSGmE', title: 'Aula 2: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'kBS1A61wS6w', title: 'Aula 3: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'Q3yVic8nNSU', title: 'Aula 4: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'OaIV3PFt3f4', title: 'Aula 5: Ortografia -CONCURSO BANCO DO BRASIL 2025' },
      { id: 'rLV0QdCBFCM', title: 'Aula 6: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'ZtVOufmFOsA', title: 'Aula 7: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'sK-aa_NAxRY', title: 'Aula 8: Ortografia - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'IL7F_mOt2-w', title: 'Aula 9: Classe e Emprego de Palavras - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'oNk4i5BGJS8', title: 'Aula 10: Classe e Emprego de Palavras - CONCURSO BANCO DO BRASIL 2025' },
      { id: 'BBzDTuTWXYU', title: 'CONCURSO BANCO DO BRASIL 2025: PORTUGUÊS (José Maria)' },
    ],
  },
  {
    id: 'matematica-financeira',
    name: 'Matemática Financeira',
    Icon: Calculator,
    videos: [
        { id: '81knpGRRzOc', title: 'Aula 01 - Conceitos Gerais (Valor do Dinheiro no Tempo, Valor Presente, Valor Futuro, Juro, Prazo)' },
        { id: '2f9MtMwPo3k', title: 'Aula 02 - Juros Simples' },
        { id: 'Nax1IlfRj_o', title: 'Aula 03 - Taxas Proporcionais e Equivalentes em Juros Simples' },
        { id: '4Ms5jYecNVc', title: 'Aula 04 - Juros Compostos' },
        { id: 'BK59p41rxCQ', title: 'Aula 05 - Convenção Linear e Exponencial' },
        { id: 'L8p5-Q437Ek', title: 'Questões Recentes da Cesgranrio de Matemática Financeira - Concurso Banco do Brasil 2026' },
    ],
  },
  {
    id: 'probabilidade-e-estatistica',
    name: 'Probabilidade e Estatística',
    Icon: Sigma,
    videos: [],
  },
  {
    id: 'vendas-e-negociacao',
    name: 'Vendas e Negociação',
    Icon: Handshake,
    videos: [
      { id: 'vlxfzyUCwco', title: 'Aula 01: Noções de Estratégia Empresarial (Vendas e Negociação) - Concurso Banco do Brasil 2026' },
      { id: 'yGHOnB9b6zQ', title: 'Aula 02: Análise de Mercado - Concurso Banco do Brasil 2026' },
      { id: 'FIktnn6HLdU', title: 'Aula 03: Forças Competitivas - Concurso Banco do Brasil 2026' },
      { id: '1MCfoEigNbQ', title: 'Aula 04: Imagem Institucional, Identidade e Posicionamento - Concurso Banco do Brasil 2026' },
      { id: 'tGUfR-VphWo', title: 'Aula 05: Segmentação de Mercado - Concurso Banco do Brasil 2026' },
      { id: 'IR9l8FdL-bo', title: 'Aula 06: Ações para Aumentar o Valor Percebido pelo Cliente - Concurso Banco do Brasil 2026' },
      { id: 'ixX9LWuHJpQ', title: 'Aula 07: Gestão da Experiência do Cliente - Concurso Banco do Brasil 2026' },
      { id: '_mMltg7VcZw', title: 'Aula 08: Aprendizagem e Sustentabilidade Organizacional - Concurso Banco do Brasil 2026' },
      { id: 'xKEz5jeUyNE', title: 'Aula 09: Características dos Serviços - Concurso Banco do Brasil 2026' },
      { id: 'LMVYbymb-eA', title: 'Aula 10: Gestão da Qualidade em Serviços - Concurso Banco do Brasil 2026' },
    ],
  },
  {
    id: 'semana-especial-banco-do-brasil',
    name: 'Semana Especial Banco do Brasil',
    Icon: Sparkles,
    videos: [
      { id: 'OsbYJMG0xKI', title: 'SEMANA ESPECIAL BANCO DO BRASIL: COMO COMEÇAR HOJE OS ESTUDOS? (Renan Duarte)' },
      { id: 'V5zLjUJBHQY', title: 'SEMANA ESPECIAL BANCO DO BRASIL: QUESTÕES RESOLVIDAS DE INFORMÁTICA DO ÚLTIMO CONCURSO' },
      { id: 'XwJUMrqb1PU', title: 'SEMANA ESPECIAL BANCO DO BRASIL: QUESTÕES RESOLVIDAS DE PORTUGUÊS DO ÚLTIMO CONCURSO (José Maria)' },
      { id: 'XYwAxSP5OW0', title: 'SEMANA ESPECIAL BANCO DO BRASIL: QUESTÕES RESOLVIDAS DE RLM DO ÚLTIMO CONCURSO (Pedro Felippe)' },
      { id: 'LAqFAOO9Jo0', title: 'SEMANA ESPECIAL BANCO DO BRASIL: QUESTÕES DE CONHECIMENTOS BANCÁRIOS DO ÚLTIMO CONCURSO (Renan D.)' },
    ],
  },
];

export const getSubjectById = (id: string) => {
  return allSubjects.find((subject) => subject.id === id);
}
