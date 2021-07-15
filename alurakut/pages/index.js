import {useState,useEffect} from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';

function ProfileSidebar(props ){
  return(
  <Box as="aside">
    <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px'}}></img>

    <hr />
    <p>
      <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
        @{props.githubUser}
      </a>
    </p>
    <hr />

    <AlurakutProfileSidebarMenuDefault />
  </Box>
  );
}
    
function ProfileRelationsBox(props){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.itens.length})
      </h2>
      <ul>
        {props.itens.map((item,index)=>{
          if(index < 6)
          return (
            <li  key={item.id}>
              <a href={`https://github.com/${item.login}`} key={item} target="_blank">
                <img src={`https://github.com/${item.login}.png`} />
                <span> {item.login}</span>
              </a>
            </li>
            )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() { 
  const githubUser = 'andgomes95';
  const [animes,setAnimes] = useState([{
    // id: '2093209',
    // title: 'FullMetal Alchemist Brotherhood', 
    // image: 'https://3.bp.blogspot.com/-Wa1FvHJfo2U/WUSRvaWawaI/AAAAAAAADiU/-PeEXPCi2n0yy2hj7Krf_CVdGMwawaHVACLcBGAs/s640/JPEG-Promo-15.jpg'
  }]);
  
  const [seguidores,setSeguidores]= useState([]);
  // GET: array de dados do git
  useEffect(()=>{
    fetch('https://api.github.com/users/andgomes95/followers')
    .then((res) =>{
      return res.json();
    }).then((res)=>{
      setSeguidores(res);
    })
    //pegar array do datocms
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'cd50365b8b452fcfda7316bb0c361a',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": 
      ` query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }` 
      })
    })
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
      setAnimes(res.data.allCommunities)
    })

    
  },[])
  
  //box com map


  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
        <h1 className="title">Seja bem vindo, {githubUser}</h1>
        <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
        </Box>
        <Box>
          <h2 className="subTitle"> O que você deseja fazer?</h2>
          <form 
            onSubmit={function handleCriaAnime(e){
              e.preventDefault();
              const dadosDoFrom = new FormData(e.target);
              const anime = {
                title:dadosDoFrom.get('title'),
                imageUrl:dadosDoFrom.get('image'),
                creatorSlug:githubUser,
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
                setAnimes([...animes, dados.novoAnime]);
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
            <button>
              Adicionar anime
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Animes para assistir ({animes.length})
          </h2>
        <ul>
            {animes.map((item,index)=>{
              if(index < 6)
              return (
                <li  key={item.id}>
                  <a href={`/animes/${item.id}`} key={item.id}>
                    <img src={`${item.imageUrl}`} />
                    <span> {item.title}</span>
                  </a>
                </li>
                )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBox
          itens={seguidores}
          title="Seguidores"
        />
      </div>
    </MainGrid>
    </>
  )
}
