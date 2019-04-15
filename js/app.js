config.forEach(function (configuracoes) {
  configuracoes.listaMensagens = [];
  configuracoes.nomeDaPessoa = '';
})

class App extends React.Component {
  state = {
    numberOfScreens: config.length,
    lastId: 0,
    data: {},
    serverResponse: {},
    modalAberto: false,
    motivo: '',
    nomeDaPessoa: '',
    endpoint_URL: ''
  }

  handleChange = (event) => {
    const { name, value } = event.target

    this.setState({ [name]: value })
  }

  abrirModal = () => this.setState({ modalAberto: true })
  fecharModal = () => this.setState({ modalAberto: false })

  renderizarTela = (configuracao, autorizacaoManual = false, motivo) => {
    const date = new Date()
    const time = date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    })

    if (configuracao.filtro.includes(this.state.serverResponse.nomeCatraca.toLowerCase())) {
      const { serverResponse } = this.state

      const style = {
        color: `${serverResponse.sentidoHorarioLiberado || serverResponse.sentidoAntiHorarioLiberado
          ? 'green' : 'red'}`
      }

      configuracao.nomeDaPessoa = serverResponse.usuarioNome.toUpperCase()

      configuracao.autorizado = serverResponse.sentidoHorarioLiberado || serverResponse.sentidoAntiHorarioLiberado

      configuracao.texto = `${serverResponse.texto} ${autorizacaoManual ? 'Manualmente' : ''}`

      configuracao.listaMensagens.unshift(
        <p style={style}>
          {time} -&nbsp;
          <a
            target="_blank"
            style={{
              color: 'inherit',
              textDecoration: 'underline'
            }}
            href={enderecoDoCliente}
          >
            {serverResponse.usuarioId}
          </a>&nbsp;
          - <a
            target="_blank"
            style={{
              color: 'inherit',
              textDecoration: 'underline'
            }}
            href={enderecoDoCliente}
          >
            {serverResponse.usuarioNome.toUpperCase()}
          </a>

          {
            serverResponse.msgRecepcao && <br />
          }

          {
            serverResponse.msgRecepcao
              ? `Mensagem: ${serverResponse.msgRecepcao}`
              : ''
          }

          {
            serverResponse.motivoLiberacaoManual && <br />
          }

          {
            serverResponse.motivoLiberacaoManual && `Motivo Liberação: ${serverResponse.motivoLiberacaoManual}`
          }
        </p>
      )
    }
  }

  renderizarModal = () => {
    return (
      <div className="parent-modal">
        <div className="modal">
          <form>
            <p>Motivo da Liberação</p>
            <select
              name="motivo"
              onChange={this.handleChange}
              defaultValue={""}
              required
            >
              <option disabled value="">Selecione Um Valor</option>
              {motivosDeLiberacao.map(motivo => (
                <option value={motivo}>{motivo}</option>
              ))}
            </select>
            <br />

            <p
              style={{ marginTop: '3%' }}
            >Nome da pessoa</p>
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.nomeDaPessoa}
              name="nomeDaPessoa"
            />
            <br />
            <button
              style={{
                padding: '.5rem 1rem',
                backgroundColor: 'green',
                border: '1px solid yellow',
                color: 'white',
                fontSize: 15,
                borderRadius: 10,
                marginTop: '1%',
              }}
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                this.autorizacaoComModal()
                this.fecharModal()
              }}
            >
              Liberar
            </button>
          </form>

          <button
            onClick={this.fecharModal}
            style={{
              position: 'absolute',
              top: '3vh',
              left: '27vw',
              padding: 0,
              margin: 0,
              border: 'none',
              color: 'inherit',
              fontSize: 30,
              cursor: 'pointer'
            }}
          >
            X</button>
        </div>
      </div>
    )
  }

  autorizacaoSemModal = (endpoint_URL) => {
    fetch(endpoint_URL)
      .then(primeiraRes => primeiraRes.json())
      .then(res => {
        this.setState({
          data: res,
          serverResponse: JSON.parse(res.liberaCatracaComando)
        }, () => {
          config.forEach(configuracao => this.renderizarTela(configuracao, true))
          this.setState(this.state)
        })
      })
  }

  autorizacaoComModal = () => {
    fetch(this.state.endpoint_URL)
      .then(primeiroRes => primeiroRes.json())
      .then(res => {
        this.setState({
          data: res,
          serverResponse: JSON.parse(res.liberaCatracaComando)
        }, () => {
          config.forEach(configuracao => {
            this.renderizarTela(configuracao, true)
            this.setState(this.state)
          })
        })
      })
  }

  componentDidMount() {
    setInterval(() => {
      fetch(`http://${hostnameDoServidor}:${portaDoServidor}/servidorCatracaIF/logCatraca/ultimoId`)
        .then(res => res.json())
        .then(r => {
          if (this.state.lastId === r.result) {
            return null
          }

          fetch(`http://${hostnameDoServidor}:${portaDoServidor}/servidorCatracaIF/logCatraca/${r.result}`)
            .then(res => res.json())
            .then(data => {
              this.setState({
                data,
                serverResponse: JSON.parse(data.liberaCatracaComando)
              }, () => {
                config.forEach(configuracao => {
                  this.renderizarTela(configuracao)
                })
                this.setState({ lastId: r.result })
              })
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    }, 1500)
  }

  render() {
    const { data, numberOfScreens, lastId } = this.state

    if (!data) {
      return <p>Carregando...</p>
    } else {
      return (
        <React.Fragment>
          <div
            className="flex-parent"
            style={{ backgroundColor: this.state.modalAberto ? 'black' : '' }}
          >
            {config.map((screenConfig, index) => {
              // Definindo a posição do botão LIBERAR.
              let width
              if (numberOfScreens === 2) width = 30 + (50 * index)
              if (numberOfScreens === 3) width = 13 + (33 * index)
              if (numberOfScreens === 4) width = 8 + (25 * index)

              width = `${width}vw`

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
                    <div className="access-control__photo">
                      <img src="./profile.png" alt="Foto" />
                    </div>

                    <div className="access-control__name"
                      style={{
                        position: 'absolute',
                        top: '7vh',
                        left: numberOfScreens === 2 ? width : `calc(${width} + 10vw)`,
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: numberOfScreens === 2
                          ? screenConfig.tamanhoDaFonte * 1.1
                          : screenConfig.tamanhoDaFonte * 0.8,
                        color: `${screenConfig.autorizado
                          ? screenConfig.corSucesso : screenConfig.corFracasso}`
                      }}
                    >
                      <p>{screenConfig.nomeDaPessoa.toUpperCase()}</p>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        top: '13vh',
                        left: numberOfScreens === 2 ? width : `calc(${width} + 10vw)`,
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: numberOfScreens === 2
                          ? screenConfig.tamanhoDaFonte * 1.1
                          : screenConfig.tamanhoDaFonte * 0.8,
                        color: `${screenConfig.autorizado
                          ? screenConfig.corSucesso : screenConfig.corFracasso}`
                      }}
                      className="access-control__text"
                    >
                      {screenConfig.texto}
                    </div>


                    {!screenConfig.autorizado && screenConfig.nomeDaPessoa && (
                      <button
                        onClick={() => this.autorizacaoSemModal(screenConfig.endpoint_lib_identificada)}
                        className="access-control__button"
                        style={{
                          border: `1px solid ${screenConfig.corDaBorda}`,
                          fontSize: screenConfig.tamanhoDaFonte,
                          position: 'absolute',
                          padding: numberOfScreens == 4 ? '10px 40px' : '10px 70px',
                          top: '22vh',
                          left: width
                        }}
                      >
                        LIBERAR
                </button>
                    )}
                  </div>
                  {
                    this.state.modalAberto && this.renderizarModal()
                  }

                  <div
                    className="output-message"
                    style={{
                      border: `1px solid ${screenConfig.corDaBorda}`,
                      backgroundColor: screenConfig.corDoFundo
                    }}
                  >
                    {screenConfig.listaMensagens.map(mensagem => <div>{mensagem}</div>)}
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
                  this.abrirModal()
                  this.setState({ endpoint_URL: configuracao.endpoint })
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

ReactDOM.render(<App />, document.getElementById('root'));
