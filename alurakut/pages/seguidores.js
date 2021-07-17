import {useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import {FollowerGrid} from '../src/components/MainGrid'
import {AlurakutMenu} from '../src/lib/AlurakutCommons';
import {FollowersBoxWrapper, ProfileSidebar} from '../src/components/ProfileRelations';

const FollowerListBox = (props)=>{
  return (
      <FollowersBoxWrapper>
         <h2 className="title">
            Seus Seguidores ({props.seguidores.length})
          </h2>
          <ul>
            {props.seguidores.map((seguidor)=>{
              return (
                <li  key={seguidor.id}>
                <a href={`https://github.com/${seguidor.login}`} key={seguidor} target="_blank">
                  <img src={`https://github.com/${seguidor.login}.png`} />
                </a>
                <span> {seguidor.login}</span>
              </li>
            )})}

          </ul>
      </FollowersBoxWrapper>
  )
}

export default function FollowersPage(props){
    const router = useRouter();
    const githubUser = props.githubUser;
    const [seguidores,setSeguidores]= useState([]);

    useEffect(()=>{
        fetch(`https://api.github.com/users/${githubUser}/followers`)
        .then((res) =>{
          return res.json();
        }).then((res)=>{
          setSeguidores(res);
        })
      },[])

    return (
        <>
          <AlurakutMenu />
          <FollowerGrid>
            <div className="profileArea" style={{gridArea: 'profileArea'}}>
              <ProfileSidebar githubUser={githubUser}/>
            </div>
            <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>                    
              <FollowerListBox 
                seguidores={seguidores}
                githubUser={githubUser}
              />
            </div>
          </FollowerGrid> 
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