//Hook do Next.js
import { useRouter } from 'next/router';
import React from 'react';
import nookies from 'nookies';
import Head from 'next/head'

export default function LoginScreen() {
    const router = useRouter();
    const [githubUser,setGithubUser] = React.useState('');
  return (
    <>
    <Head>
      <link  rel="shortcut icon" href="../public/favicon.ico" />
    </Head>
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus seguidores do github</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form 
            className="box"
            onSubmit={(e)=>{
                e.preventDefault();                
                fetch('https://alurakut.vercel.app/api/login',{
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({githubUser: githubUser})
                })
                .then(async (res)=>{
                    const data = await res.json();
                    nookies.set(null, 'USER_TOKEN',data.token,{
                        path: '/',
                        maxAge: 86400 * 7
                    })
                    router.push('/')
                })
            }}
          >
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input 
                placeholder="Usuário do Git"
                value={githubUser}
                onChange={(e)=>{
                    setGithubUser(e.target.value)
                }}
            />
            <button type="submit" disabled={githubUser.length==0}>
              Login
          </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="https://www.github.com" target="_blank">
                <strong>
                  ENTRAR NO GITHUB :)
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 <a href="https://alura.com.br" target="_blank">alura.com.br </a> - 
            <a href="https://www.orkut.br.com/" target="_blank"> Sobre o Orkut.br </a> - 
            <a href="https://www.orkut.br.com/seguranca" target="_blank"> Centro de segurança </a> - 
            <a href="https://www.orkut.br.com/privacidade" target="_blank"> Privacidade </a> - 
            <a href="https://www.orkut.br.com/termos" target="_blank"> Termos </a> - 
            <a href="https://www.orkut.br.com/contato" target="_blank"> Contato </a>
          </p>
        </footer>
      </div>
    </main>
    </>
  )
} 