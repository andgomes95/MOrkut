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