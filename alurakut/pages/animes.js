import {useState,useEffect} from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import {AlurakutMenu} from '../src/lib/AlurakutCommons';
import { AnimeGrid } from '../src/components/MainGrid';
import {ProfileAnimePage, AnimeListBox,AddAnimeForm} from '../src/components/AnimePageComponents';

export default function AnimePage(props){
    const githubUser = props.githubUser;
    const [animes,setAnimes] = useState([]);
    const [screenState,setScreenState] = useState("onlyUser");
    // GET: array de dados do git
    useEffect(()=>{
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
      <AnimeGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileAnimePage
            githubUser={githubUser}
            onSetScreenState={(screenState)=>{
                setScreenState(screenState)
            }}
        />
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <AddAnimeForm
              animes = {animes}
              setAnimes = {(retAnimes)=>{
                setAnimes(retAnimes)
              }}
              githubUser = {githubUser}
            />
            <AnimeListBox 
                animes={animes}
                githubUser={githubUser}
                screenState={screenState}
            />    
        </div>
        </AnimeGrid>
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