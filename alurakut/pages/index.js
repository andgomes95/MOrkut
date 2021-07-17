import {useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper, ProfileRelationsBox,ProfileSidebar} from '../src/components/ProfileRelations';

export default function Home(props) { 
  const router = useRouter();
  const githubUser = props.githubUser;
  const [dadosPessoais,setDadosPessoais] = useState('');
  const [animes,setAnimes] = useState([]);
  const [seguidores,setSeguidores]= useState([]);
  // GET: array de dados do git
  useEffect(()=>{
    fetch(`https://api.github.com/users/${githubUser}`)
    .then((res) =>{
      return res.json();
    }).then((res)=>{
      setDadosPessoais(res);
    })
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
            <h2 className="smallTitle"> {dadosPessoais.bio} </h2>
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
            {animes.filter((item)=>{
              return item.creatorSlug == githubUser
            })            
            .map((item,index)=>{
              if(index < 6) {
              return (
                <li  key={item.id}>
                  <a key={item.id}>
                    <img src={`${item.imageUrl}`} />
                    <span> {item.title}</span>
                  </a>
                </li>
                )
              }
            })}
          </ul>
          <button onClick={()=>{
            router.push('/animes')
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