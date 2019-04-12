function Screen(props) {
  return (
    <div className="columner">
      <div
        className="access-control"
        style={{ width: `calc(100vw / ${props.numberOfScreens}` }}
      >
        <div
          className="access-control__title"
          style={{ width: `calc(100vw / ${props.numberOfScreens}` }}
        >
          <p>{props.title}</p>
        </div>
        <div className="access-control__photo">
          <img src="./profile.png" alt="Foto" />
        </div>

        <div className="access-control__name"
          style={{ color: 'white' }}
        >
          <p>{liberaCatracaComando.usuarioNome}</p>
        </div>

        <div
          style={{
            color: `${liberaCatracaComando.sentidoHorarioLiberado || liberaCatracaComando.sentidoAntiHorarioLiberado
              ? 'green' : 'red'}`
          }}
          className="access-control__text"
        >
          {liberaCatracaComando.texto}
        </div>
      </div>

      <div className="output-message">
        {liberaCatracaComando.usuarioId} - {liberaCatracaComando.msgRecepcao}
      </div>
    </div>
  )
}