import {useState,useEffect} from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper, ProfileRelationsBox,ProfileSidebar} from '../src/components/ProfileRelations';


export default function Home(props) { 
  const githubUser = props.githubUser;
  const [animes,setAnimes] = useState([]);
  const [seguidores,setSeguidores]= useState([]);
  // GET: array de dados do git
  useEffect(()=>{
    fetch(`https://api.github.com/users/${githubUser}/followers`)
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
          <button type="submit">
            Adicionar anime
          </button>
        </form>
      </Box>
    </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox
          itens={seguidores}
          title="Seguidores"
        />
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Animes para assistir (
              {animes.filter((value)=>{
                return value.creatorSlug == githubUser
              }).length}
            )
          </h2>
        <ul>
            {animes.map((item,index)=>{
              if(index < 6 && item.creatorSlug == githubUser) 
              return (
                <li  key={item.id}>
                  <a key={item.id}>
                    <img src={`${item.imageUrl}`} />
                    <span> {item.title}</span>
                  </a>
                </li>
                )
            })}
          </ul>
          <button onClick={()=>{
            alert("itsme")
          }}> Ver todos</button>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
    headers: {
      Authorization : token
    }
  })
  .then((res)=>res.json())

  if(!isAuthenticated){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  const {githubUser} = jwt.decode(token)
  return {
    props: {
      githubUser: githubUser
    },
  }
}