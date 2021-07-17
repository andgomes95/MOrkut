import Box from '../Box';
import { AnimeBoxWrapper } from '../ProfileRelations';

export const AnimeListBox = (props)=>{
    return (
        <AnimeBoxWrapper>
            <h2 className="title">
                Animes para assistir (
                    {props.animes.filter((value)=>{
                        if(props.screenState=="onlyUser")
                            return value.creatorSlug == props.githubUser
                        else return true
                    }).length}
                )
                </h2>
                <ul>
                    {props.screenState == "onlyUser" && props.animes.map((item,index)=>{
                        if(item.creatorSlug == props.githubUser) 
                            return (
                                <>
                                <li>
                                    <a key={item.id}>
                                        <img src={`${item.imageUrl}`} />
                                        
                                    </a>
                                </li>
                                <li>
                                    <h2 className="smallTitle">{item.title}</h2>
                                    <hr />
                                    adicionado por: {item.creatorSlug}
                                </li>
                                </>
                            )
                    })}
                    {props.screenState == "All" && props.animes.map((item,index)=>{ 
                        return (
                            <>
                            <li>
                                <a key={item.id}>
                                    <img src={`${item.imageUrl}`} />
                                    
                                </a>
                            </li>
                            <li>
                                <h2 className="smallTitle">{item.title}</h2>
                                <hr />
                                adicionado por: {item.creatorSlug}
                            </li>
                            </>
                        )
                    })}

                </ul>
          </AnimeBoxWrapper>
    )
}

export const ProfileAnimePage = (props)=>{
    return (
        <Box as="aside">
            <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px'}}></img>
            <hr />
            <p>
                <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
                    @{props.githubUser}
                </a>
            </p>
            <hr />
            <h2 className="smallTitle">
                Ver animes:
            </h2>
            <button onClick={(e)=>{
                e.preventDefault();
                props.onSetScreenState("onlyUser")
                }}>Criados por Você</button>
                <hr />
            <button onClick={(e)=>{
                e.preventDefault();
                props.onSetScreenState("All")
                }}>Todos Animes</button>
        </Box>
    )
}

export const AddAnimeForm = (props)=>{
    return (
    <Box>
      <h2 className="title"> Adicione um anime para sua Lista :)</h2>
      <form 
        onSubmit={function handleCriaAnime(e){
          e.preventDefault();
          const dadosDoFrom = new FormData(e.target);
          const anime = {
            title:dadosDoFrom.get('title'),
            imageUrl:dadosDoFrom.get('image'),
            creatorSlug:props.githubUser,
          }
  
          fetch('/api/animes',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(anime)
          })
          .then(async (res)=>{
            const dados = await res.json();
            props.setAnimes([...props.animes, dados.novoAnime]);
          })
        }}
      >
        <div>
          <input 
            placeholder="Qual vai ser o anime que você quer ver?" 
            name="title" 
            arial-label="Qual vai ser o anime que você quer ver?" 
            type="text"
          />
        </div>
        <div>
          <input 
            placeholder="Coloque uma URL da imagem do anime?" 
            name="image" 
            arial-label="Coloque uma URL da imagem do anime?" 
          />
        </div>
        <button type="submit">
          Adicionar anime
        </button>
      </form>
    </Box>
    )
  }