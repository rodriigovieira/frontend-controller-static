config.forEach(function (configuracoes) {
  configuracoes.listaMensagens = []
  configuracoes.nomeDaPessoa = ""
})

class App extends React.Component {
  state = {
    numberOfScreens: config.length,
    lastId: 0,
    data: {},
    serverResponse: {},
    modalAberto: false,
    motivo: "",
    nomeDaPessoa: "",
    endpoint_URL: "",
    photo_base64: "",
    filtroLiberaManual: ""
  }

  handleChange = event => {
    const { name, value } = event.target

    this.setState({ [name]: value })
  }

  abrirModal = () => this.setState({ modalAberto: true })
  fecharModal = () => this.setState({ modalAberto: false })

  renderizarTela = (configuracao, autorizacaoManual = false, motivo) => {
    const date = new Date()
    const time = date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit"
    })

    if (
      configuracao.filtro.includes(
        this.state.serverResponse &&
        this.state.serverResponse.nomeCatraca.toLowerCase()
      )
    ) {
      const { serverResponse } = this.state

      const style = {
        color: `${
          serverResponse.sentidoHorarioLiberado ||
            serverResponse.sentidoAntiHorarioLiberado
            ? "green"
            : "red"
          }`
      }

      configuracao.nomeDaPessoa = serverResponse.usuarioNome.toUpperCase()

      configuracao.autorizado =
        serverResponse.sentidoHorarioLiberado ||
        serverResponse.sentidoAntiHorarioLiberado

      configuracao.texto = `${serverResponse.texto} ${
        autorizacaoManual ? "Manualmente" : ""
        }`

      configuracao.listaMensagens.unshift(
        <p style={style}>
          {time} -&nbsp;
          <a
            target="_blank"
            style={{
              color: "inherit",
              textDecoration: "underline"
            }}
            href={enderecoDoCliente}
          >
            {serverResponse.usuarioId}
          </a>
          &nbsp; -{" "}
          <a
            target="_blank"
            style={{
              color: "inherit",
              textDecoration: "none"
            }}
            href={enderecoDoCliente}
          >
            {serverResponse.usuarioNome.toUpperCase()}
          </a>
          {serverResponse.msgRecepcao && <br />}
          {serverResponse.msgRecepcao
            ? `Mensagem: ${serverResponse.msgRecepcao}`
            : ""}
          {serverResponse.motivoLiberacaoManual && <br />}
          {serverResponse.motivoLiberacaoManual &&
            `Motivo Liberação: ${serverResponse.motivoLiberacaoManual || motivo}`}
        </p>
      )
    }
  }

  renderizarModal = () => {
    return (
      <div className="parent-modal">
        <div
          className="modal"
          style={{ fontSize: 16 }}
        >
          <h3
            style={{
              textAlign: 'center'
            }}
          >Liberação Manual</h3>
          {this.state.erro && (
            <span
              style={{ margin: 10, color: 'red' }}
            >Você precisa preencher os dois campos.</span>
          )}
          <hr />

          <form>
            <span
              style={{ marginLeft: '4%', fontSize: 15 }}
            >
              Motivo da Liberação:&nbsp;&nbsp;
            </span>
            <select
              name="motivo"
              onChange={this.handleChange}
              defaultValue={""}
              required
              style={{ fontSize: 14 }}
            >
              <option disabled value="">
                Selecione Um Valor
              </option>
              {motivosDeLiberacao.map(motivo => (
                <option value={motivo}>{motivo}</option>
              ))}
            </select>
            <hr />
            <span
              style={{ marginLeft: '4%' }}
            >

              Nome da Pessoa: &nbsp;&nbsp;
            </span>
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.nomeDaPessoa}
              name="nomeDaPessoa"
              style={{ fontSize: 16 }}
              required
            />
            <hr />
            <button
              style={{
                padding: ".5rem 1rem",
                backgroundColor: "green",
                border: "1px solid rgba(0,0,0, .7)",
                color: "white",
                fontSize: 15,
                borderRadius: 10,
                margin: "1%",
                marginLeft: '3%',
              }}
              type="submit"
              onClick={event => {
                event.preventDefault()
                if (!this.state.motivo || !this.state.nomeDaPessoa) {
                  this.setState({ erro: true })
                  return null
                } else {
                  this.setState({ erro: false })
                }

                this.autorizacaoComModal()
                this.fecharModal()
              }}
            >
              Liberar
            </button>

            <button
              style={{
                padding: ".5rem 1rem",
                backgroundColor: "red",
                border: "1px solid rgba(0,0,0, .7)",
                color: "white",
                fontSize: 15,
                borderRadius: 10,
                margin: "1%"
              }}
              onClick={event => {
                event.preventDefault()
                this.fecharModal()
                this.setState({ erro: false })
              }}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Work on AUTHORIZE button.
  // You'll pass a STIRNGFIED JSON in the api CALL.

  autorizacaoSemModal = endpoint_URL => {
    fetch(`${endpoint_URL}?libCatraca={ "nsLeitor": "", "nsPlc": "", "semComando": false, "usuarioNome": ${ this.state.serverResponse.usuarioNome }, "usuarioId": ${ this.state.identificacao_usuarioId }, "convidado": false, "dispositivoIdentificacao": "", "texto": "", "msgRecepcao": ${ this.state.serverResponse.msgRecepcao }, "sentidoHorarioLiberado": true, "sentidoAntiHorarioLiberado": true, "liberacaoTempo": 10000, "grupoCatracas": "", "nomeCatraca": "Catraca1", "motivoLiberacaoManual": "{\"liberadoPara\":\"${this.state.serverResponse.usuarioNome}\",\"motivo\": ${this.state.serverResponse.msgRecepcao}}", "qtdAcessosPorDia": 0, "temTimeZones": false, "msgBloqueioTimeZone": "", "gruposTimeZone": "", "intervaloMinimo": 0}'`)
      .then(primeiraRes => primeiraRes.json())
      .then(res => {
        console.log(res)
      })
  }

  autorizacaoComModal = () => {
    fetch(`${this.state.endpoint_URL}?libCatraca={ "nsLeitor": "", "nsPlc": "", "semComando": false, "usuarioNome": ${ this.state.nomeDaPessoa }, "usuarioId": "", "convidado": false, "dispositivoIdentificacao": "", "texto": "", "msgRecepcao": ${ this.state.motivo }, "sentidoHorarioLiberado": true, "sentidoAntiHorarioLiberado": true, "liberacaoTempo": 10000, "grupoCatracas": "", "nomeCatraca": "Catraca1", "motivoLiberacaoManual": "{\"liberadoPara\":\"${this.state.nomeDaPessoa}\",\"motivo\": ${this.state.motivo}}", "qtdAcessosPorDia": 0, "temTimeZones": false, "msgBloqueioTimeZone": "", "gruposTimeZone": "", "intervaloMinimo": 0}'`)
      .then(primeiroRes => primeiroRes.json())
      .then(res => {
        console.log(res)
      })
  }

  componentDidMount() {
    setInterval(() => {
      fetch(
        `http://${hostnameDoServidor}:${portaDoServidor}/servidorCatracaIF/logCatraca/ultimoId`
      )
        .then(res => res.json())
        .then(r => {
          if (this.state.lastId === r.result) {
            return null
          }

          fetch(
            `http://${hostnameDoServidor}:${portaDoServidor}/servidorCatracaIF/logCatraca/${
            r.result
            }`
          )
            .then(res => res.json())
            .then(data => {
              if (data.identificacao_usuarioId) {
                fetch(
                  `http://${hostnameDoServidor}:${portaDoServidor}/servidorCatracaIF/cachePgProcessamento/fotoJpgBase64UsuarioId?usuarioId=${
                  data.identificacao_usuarioId
                  }`
                )
                  .then(r => r.json())
                  .then(res => this.setState({ photo_base64: res.result }))
                  .catch(e => console.log(e))
              } else {
                this.setState({ photo_base64: "" })
              }

              this.setState(
                {
                  data,
                  serverResponse: data.liberaCatracaComando
                    ? JSON.parse(data.liberaCatracaComando)
                    : ""
                },
                () => {
                  config.forEach(configuracao => {
                    this.renderizarTela(configuracao)
                  })
                  this.setState({ lastId: r.result })
                }
              )
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    }, 500)
  }

  render() {
    const { data, numberOfScreens, lastId, photo_base64 } = this.state

    if (!data) {
      return <p>Carregando...</p>
    } else {
      return (
        <React.Fragment>
          <div
            className="flex-parent"
            style={{ backgroundColor: this.state.modalAberto ? "black" : "" }}
          >
            {config.map((screenConfig, index) => {
              // Definindo se o usuário possui imagem ou não
              const foto = photo_base64
                ? `data:image/pngbase64, ${photo_base64}`
                : "./sem_foto.png"

              return (
                <div
                  style={{
                    fontFamily: `"${screenConfig.fonte}", sans-serif`,
                    fontSize: screenConfig.tamanhoDaFonte,
                    backgroundColor: screenConfig.corDoFundo
                  }}
                >
                  <div
                    className="access-control"
                    style={{
                      width: `calc(99.9vw / ${numberOfScreens}`,
                      border: `1px solid ${screenConfig.corDaBorda}`
                    }}
                  >
                    <div
                      className="access-control__title"
                      style={{
                        width: `calc(99.9vw / ${numberOfScreens}`,
                        border: `1px solid ${screenConfig.corDaBorda}`,
                        fontSize: screenConfig.tamanhoDaFonte
                      }}
                    >
                      <p>{screenConfig.titulo}</p>
                    </div>


                    <div className="access-control__header">
                      <div className="access-control__photo">
                        <img src={foto} alt="Foto" />
                      </div>

                      <div className="access-control__info">
                        <p
                          className="access-control__name"
                          style={{
                            fontSize:
                              numberOfScreens === 2
                                ? screenConfig.tamanhoDaFonte * 1.1
                                : screenConfig.tamanhoDaFonte * 0.8,
                            color:
                              screenConfig.autorizado
                                ? screenConfig.corSucesso
                                : screenConfig.corFracasso,
                            marginBottom: 10,
                            padding: 5
                          }}
                        >
                          {screenConfig.nomeDaPessoa.toUpperCase()}
                        </p>

                        <div
                          style={{
                            fontSize:
                              numberOfScreens === 2
                                ? screenConfig.tamanhoDaFonte * 1.1
                                : screenConfig.tamanhoDaFonte * 0.8,
                            color: `${
                              screenConfig.autorizado
                                ? screenConfig.corSucesso
                                : screenConfig.corFracasso
                              }`
                          }}
                          className="access-control__text"
                        >
                          {screenConfig.texto}
                        </div>

                        {!screenConfig.autorizado && screenConfig.nomeDaPessoa && (
                          <button
                            onClick={() =>
                              this.autorizacaoSemModal(
                                screenConfig.endpoint_lib_identificada
                              )
                            }
                            className="access-control__button"
                            style={{
                              border: `1px solid ${screenConfig.corDaBorda}`,
                              fontSize: screenConfig.tamanhoDaFonte,
                              padding:
                                numberOfScreens == 4 ? "1.3vh 4vw" : "1.3vh 5%",
                              width: '100%'
                            }}
                          >
                            LIBERAR
                          </button>
                        )}
                      </div>
                    </div>


                  </div>
                  {this.state.modalAberto && this.renderizarModal()}

                  <div
                    className="output-message"
                    style={{
                      border: `1px solid ${screenConfig.corDaBorda}`,
                      backgroundColor: screenConfig.corDoFundo
                    }}
                  >
                    {screenConfig.listaMensagens.map(mensagem => (
                      <div>{mensagem}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div
            className="status-bar"
            style={{
              width: `calc(99.9vw) / ${numberOfScreens}`,
              fontSize: 16
            }}
          >
            {configuracoesStatusBar.map(configuracao => (
              <button
                onClick={() => {
                  this.setState({
                    endpoint_URL: configuracao.endpoint,
                    filtroLiberaManual: configuracao.filtro
                  })
                  this.abrirModal()
                }}
              >
                {configuracao.titulo}
              </button>
            ))}
          </div>
        </React.Fragment>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
