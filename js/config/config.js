// ATENÇÃO! Não edite esse arquivo se você não souber o que está fazendo!

// Configurações para conectar-se ao servidor.
hostnameDoServidor = 'localhost' // NÃO COLOCAR A "/" NO FINAL!
portaDoServidor = 810 // NÃO COLOCAR OS ":" NO COMEÇO!
enderecoDoCliente = 'http://enderecodocliente.com/?usuarioId=XXX'
// Configuração liberação identificada
endpoit_lib_identificada = 'http://localhost/metodosCatraca/liberaCatraca?sentidoHorarioLiberado=S&sentidoAntiHorarioLiberado=S&liberacaoTempo=10000&texto=LIBERADO'

// Para criar uma nova tela, basta adicionar uma nova configuração,
// e nela adicionar o valor "título" com o nome que deseja.
motivosDeLiberacao = ['Pagamento em atraso', 'Aula Experimental']

// Configurações individuais de cada tela.
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
  },
]
