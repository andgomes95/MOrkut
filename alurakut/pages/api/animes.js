import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST'){
        const TOKEN = '9a72314a37d7593e49a0f70365cad8';
        const client = new SiteClient(TOKEN);
        // Validar os dados, também
        const novoAnime = await client.items.create({
            itemType: "968383", //ID do model do dato
            ...request.body
        })
        response.json({
            novoAnime: novoAnime
        });
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no post tem! :)'
    })
}