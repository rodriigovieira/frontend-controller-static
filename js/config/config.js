// ATENÇÃO! Não edite esse arquivo se você não souber o que está fazendo!

// Configurações para conectar-se ao servidor.
hostnameDoServidor = 'localhost' // NÃO COLOCAR A "/" NO FINAL!
portaDoServidor = 810 // NÃO COLOCAR OS ":" NO COMEÇO!
enderecoDoCliente = 'http://enderecodocliente.com/?usuarioId=XXX'

// Adicione aqui todos os motivos de liberação
// que devem ser exibidos na hora de liberar manualmente.
motivosDeLiberacao = ['Pagamento em atraso', 'Aula Experimental']

// Configuração dos botões na barra inferior.
// Para adicionar um novo botão, basta adicionar um novo objeto.
configuracoesStatusBar = [
  {
    titulo: "Liberar Catrata 1",
    endpoint: "http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO",
    filtro: 'catraca1'
  },
  {
    titulo: "Autorizar Catrata 47",
    endpoint: "http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO",
    filtro: 'catraca1'
  },
  {
    titulo: "Liberar Catrata 131",
    endpoint: "http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO",
    filtro: 'catraca1'
  },
  {
    titulo: "Liberar Catraca 2",
    endpoint: "http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO",
    filtro: 'catraca1'
  }
]

// Configurações individuais de cada tela.
// Para criar uma nova tela, basta adicionar um novo objeto.
// Quanto maior o número de telas, recomenda-se que menor seja a fonte.
config = [
  {
    titulo: "Catraca Principal",
    corDaBorda: 'yellow',
    fonte: 'Arial',
    tamanhoDaFonte: 20,
    corDoFundo: 'black',
    corSucesso: 'green',
    corFracasso: 'red',
    filtro: ['catraca1'],
    endpoint_lib_identificada: 'http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO'
  },
  {
    titulo: "Catraca Emergencial",
    corDaBorda: 'yellow',
    fonte: 'Arial',
    tamanhoDaFonte: 20,
    corDoFundo: 'black',
    corSucesso: 'green',
    corFracasso: 'red',
    filtro: ['catraca1', 'catraca2'],
    endpoint_lib_identificada: 'http://localhost:4000/metodos/liberaCatraca?sentidoHorarioLiberado=true&sentidoAntiHorarioLiberado=true&liberacaoTempo=10000&texto=LIBERADO'
  },
]
