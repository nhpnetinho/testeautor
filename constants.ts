
import { Book } from './types';

export const WRITER_NAME = "Elias Cavalcanti";
export const WRITER_BIO = "Elias é um romancista e poeta contemporâneo, cujas obras exploram a intersecção entre a memória urbana e a solidão tecnológica. Vencedor de prêmios literários, ele dedica sua vida a traduzir o indizível em narrativas que respiram.";

export const TESTIMONIALS = [
  {
    author: "Clarice Fontes",
    role: "Crítica Literária",
    text: "Elias possui uma voz única que ressoa nas frestas do cotidiano. 'O Eco do Silêncio' é uma obra-prima da introspecção."
  },
  {
    author: "Marcos Viana",
    role: "Editor da Folha",
    text: "Raramente encontramos um autor tão capaz de humanizar a frieza do concreto urbano através de versos tão viscerais."
  }
];

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "O Eco do Silêncio",
    subtitle: "Um Mergulho na Memória",
    genre: "Romance Psicológico",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
    description: "Uma jornada através das lembranças de um homem que perdeu a voz, mas nunca o desejo de ser ouvido.",
    pages: [
      "Era uma manhã cinzenta quando o relógio parou pela última vez. O silêncio que se seguiu não foi uma ausência de som, mas uma presença densa, quase tátil.",
      "As paredes da velha biblioteca pareciam sussurrar segredos de séculos passados. Cada lombada de couro continha um universo inteiro esperando para ser redescoberto.",
      "Ele caminhou até a janela. Lá fora, o mundo continuava seu frenesi habitual, ignorando a pausa monumental que ocorria dentro daquelas quatro paredes.",
      "Como descrever o cheiro do tempo? É uma mistura de poeira, papel envelhecido e a promessa de uma verdade que só se revela no escuro.",
      "As memórias são como fantasmas: elas não nos assombram, elas nos habitam. Somos feitos de retalhos de momentos que já não existem mais.",
      "FIM DA AMOSTRA. Adquira o livro completo para continuar esta jornada emocionante pelos labirintos da mente humana."
    ]
  },
  {
    id: "2",
    title: "Cidades Invisíveis",
    subtitle: "Poesia sob o Concreto",
    genre: "Poesia Contemporânea",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
    description: "Versos que capturam a alma das metrópoles e os encontros que nunca aconteceram.",
    pages: [
      "No asfalto quente da avenida,\nFloresce a solidão dividida.\nMilhares de rostos, nenhum olhar,\nBuscando um porto para ancorar.",
      "O metrô é uma cápsula do tempo,\nTransportando pressa e desalento.\nNas luzes neon que piscam sem fim,\nProcuro você e encontro a mim.",
      "A chuva lava o que o dia sujou,\nMas não apaga o que a noite marcou.\nSomos sombras em busca de luz,\nCarregando o peso que a cidade produz.",
      "Entre o vidro e o aço, a alma se esconde,\nPerguntando ao vento: por onde? onde?\nA resposta é o eco da própria batida,\nNo coração pulsante de uma vida perdida.",
      "FIM DA AMOSTRA. A poesia continua nas ruas, nos becos e nas páginas desta obra completa."
    ]
  },
  {
    id: "3",
    title: "Sombra do Amanhã",
    subtitle: "O Fim é Apenas o Começo",
    genre: "Ficção Científica",
    coverImage: "https://images.unsplash.com/photo-1532012197367-e37802063d00?q=80&w=800",
    description: "Em um futuro onde a consciência pode ser transferida, o que significa realmente morrer?",
    pages: [
      "Ano 2142. A morte tornou-se opcional para quem podia pagar a taxa de transferência. A nuvem não era mais um lugar de dados, mas de almas.",
      "O protocolo de upload demorava exatos doze segundos. Doze segundos para transformar uma vida de oitenta anos em alguns terabytes de código binário.",
      "Mas algo deu errado no servidor principal. Uma falha que ninguém previu: os bits começaram a sonhar. E os sonhos eram perigosos.",
      "Eu era o técnico encarregado da purificação. Meu trabalho era apagar os pesadelos digitais antes que eles contaminassem a rede global de consciência.",
      "Até que encontrei o arquivo dela. Não era apenas código; era música. Uma melodia que eu conhecia antes da grande migração.",
      "FIM DA AMOSTRA. O destino da humanidade digital está em suas mãos. Garanta seu exemplar agora."
    ]
  }
];
