class Livro {
  public titulo: string;
  public autor: string;
  public ano: string;
  public genero: string;
  public quantidade: number;
  public transacoes: Transacao[];

  // Construtor da classe Livro
  constructor(titulo: string, autor: string, ano: string, genero: string, quantidade: number) {
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
    this.genero = genero;
    this.quantidade = quantidade;
    this.transacoes = []; // Inicializa a lista de transações como vazia
  }

  // Método para realizar o empréstimo de um livro para um usuário
  emprestar(usuario: Usuario): void {
    if (this.quantidade > 0) {
      this.quantidade--;
      const transacao = new Transacao(this, usuario);
      this.transacoes.push(transacao);
      console.log(`Livro "${this.titulo}" emprestado para ${usuario.nome}.`);
    } else {
      console.log(`Desculpe, o livro "${this.titulo}" não está disponível no momento.`);
    }
  }

  // Método para realizar a devolução de um livro por um usuário
  devolver(usuario: Usuario): void {
    const transacao = this.transacoes.find(t => t.usuario === usuario && !t.devolvido);
    if (transacao) {
      transacao.devolvido = true;
      this.quantidade++;

      // Verifica atraso na devolução
      const dataDevolucao = new Date();
      const diasAtraso = this.calcularDiasAtraso(transacao.dataEmprestimo, dataDevolucao);
      const multa = diasAtraso > 0 ? diasAtraso * 2 : 0;

      if (multa > 0) {
        console.log(`Livro "${this.titulo}" devolvido por ${usuario.nome} com atraso de ${diasAtraso} dias. Multa de R$${multa.toFixed(2)}.`);
      } else {
        console.log(`Livro "${this.titulo}" devolvido por ${usuario.nome}.`);
      }
    } else {
      console.log(`Este livro não está atualmente emprestado para ${usuario.nome}.`);
    }
  }

  // Função para calcular a diferença de dias entre duas datas
  calcularDiasAtraso(dataInicial: Date, dataFinal: Date): number {
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diffEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();
    return Math.floor(diffEmMilissegundos / umDiaEmMilissegundos);
  }
}

class Usuario {
  public nome: string;

  // Construtor da classe Usuario
  constructor(nome: string) {
    this.nome = nome;
  }
}

class Transacao {
  public livro: Livro;
  public usuario: Usuario;
  public devolvido: boolean;
  public dataEmprestimo: Date;

  // Construtor da classe Transacao
  constructor(livro: Livro, usuario: Usuario) {
    this.livro = livro;
    this.usuario = usuario;
    this.devolvido = false;
    this.dataEmprestimo = new Date(); // Registra a data do empréstimo
  }
}

// Função para pesquisar um livro na biblioteca
function pesquisa(): Livro | null {
  const tit = prompt("Digite o título do livro:");
  for (const livro of biblioteca) {
    if (livro.titulo === tit) {
      return livro;
    }
  }
  console.log(`Livro "${tit}" não encontrado.`);
  return null;
}

// Função para reservar um livro para um usuário
function reservarLivro(usuario: Usuario): void {
  const livro = pesquisa();
  if (livro) {
    livro.emprestar(usuario);
  }
}

// Função para verificar o status de reserva de um livro para um usuário
function verificarStatusReserva(usuario: Usuario): void {
  const tit = prompt("Digite o título do livro:");
  const livro = biblioteca.find(l => l.titulo === tit);
  if (livro) {
    const transacao = livro.transacoes.find(t => t.usuario === usuario && !t.devolvido);
    if (transacao) {
      console.log(`O livro "${tit}" está atualmente emprestado para ${usuario.nome}.`);
    } else {
      console.log(`O livro "${tit}" não está atualmente emprestado para ${usuario.nome}.`);
    }
  } else {
    console.log(`Livro "${tit}" não encontrado.`);
  }
}

// Função para adicionar um novo livro à biblioteca
function adicionaLivro(): void {
  const novoLivro = new Livro(
    prompt("Digite o título do livro: "),
    prompt("Digite o autor do livro: "),
    prompt("Digite o ano do livro: "),
    prompt("Digite o gênero do livro: "),
    Number(prompt("Digite a quantidade de livros: "))
  );
  biblioteca.push(novoLivro);
  console.log("Livros na Biblioteca:");
  mostraLivros();
}

// Função para exibir todos os livros na biblioteca
function mostraLivros(): void {
  for (let livro of biblioteca) {
    console.log(`${livro.titulo} - ${livro.autor} (${livro.ano}) - Gênero: ${livro.genero} - Quantidade: ${livro.quantidade}`);
  }
}

// Função para adicionar livros aleatórios à biblioteca (para teste)
function addrandom(x: number): void {
  for (let i = 0; i < x; i++) {
    biblioteca.push(new Livro(`titulo${i}`, `autor${i}`, i.toString(), `genero${i}`, i));
  }
}

// Inicialização
let continuar = true;
let biblioteca: Livro[] = [];
let usuario: Usuario = new Usuario("João");  // Um usuário fictício para testar as transações
addrandom(10);
mostraLivros();

// Loop principal do programa
do {
  console.log("Menu da Biblioteca:");
  console.log("1. Pesquisar Livro");
  console.log("2. Reservar Livro");
  console.log("3. Verificar Status da Reserva");
  console.log("4. Adicionar livro");
  console.log("5. Remover livro");
  console.log("0. Sair");

  let opcao=prompt("Escolha uma opção (0-5): ");

  switch (opcao) {
    case "1":
      console.log("Opção 1: Pesquisar Livro \n");
      const livroPesquisado = pesquisa();
      if (livroPesquisado) {
        console.log(livroPesquisado);
      }
      break;

    case "2":
      console.log("Opção 2: Reservar Livro \n");
      reservarLivro(usuario);
      break;

    case "3":
      console.log("Opção 3: Verificar Status da Reserva \n");
      verificarStatusReserva(usuario);
      break;

    case "4":
      console.log("Opção 4: Adicionar livro \n");
      adicionaLivro();
      break;

    case "5":
      console.log("Opção 5: Remover livro \n");
      // Adicione a lógica para remover um livro (caso desejado)
      break;

    case "0":
      console.log("Opção 0: Sair \n");
      continuar = false;
      break;

    default:
      console.log("Opção inválida. Por favor, escolha uma opção válida (0-5). \n");
  }
} while (continuar);