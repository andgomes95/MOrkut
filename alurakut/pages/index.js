import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';

function ProfileSidebar(props ){
  return(
  <Box>
    <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px'}}></img>
  </Box>
  );
}
export default function Home() {
  const githubUser = 'andgomes95';
  const pessoasFavoritas = [
    'Remoliveira',
    'paulohtobias',
    'Niehaus', 
    'Luzim', 
    'jenaroaaugusto', 
    'Matheusrlr'
  ]
  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar 
      githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
        <h1 className="title">Bem vindos</h1>
        <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <Box>
          <h2 className="smallTitle">
            Pessoas da Comunidades ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.map((item)=>{
              return (
                <li>
                  <a href={`/users/${item}`} key={item}>
                    <img src={`https://github.com/${item}.png`} />
                    <span> {item}</span>
                  </a>
                </li>
                )
            })}
          </ul>
        </Box>
        {/* <Box>
          Comunidades
        </Box> */}
      </div>
    </MainGrid>
    </>
  )
}
