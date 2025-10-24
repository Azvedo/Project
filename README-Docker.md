# Run with Docker Compose

Use Docker Compose para subir frontend e backend em containers.

No diretório raiz do repositório (onde está `docker-compose.yml`) execute:

```powershell
docker compose up --build
```

Depois que os serviços subirem:

- Frontend: http://localhost:8080
- Backend (API): http://localhost:5000

Observações:

- O backend roda internamente na porta 80 do container e é mapeado para a porta 5000 do host.
- O frontend é servido via nginx no container e é mapeado para a porta 8080 do host.
- A variável de ambiente `FRONTEND_URL` é usada pelo backend para configurar a política de CORS; o `docker-compose.yml` define `http://localhost:8080` para o ambiente de desenvolvimento.
- Para o frontend chamar a API via browser usando as portas do host, a URL de API deve apontar para `http://localhost:5000` (durante a build o `VITE_API_URL` pode estar definido como `http://backend:80` para uso dentro da rede Docker).

Importante:

- Os repositórios são em memória — os dados persistem apenas enquanto o backend estiver em execução. Se o backend for reiniciado, os dados serão perdidos.
- Você pode acessar a documentação Swagger da API em: http://localhost:5000/swagger
- Há um endpoint útil para listar usuários: `GET /api/Auth/all`.

Problemas comuns:

- Erros de CORS: verifique se `FRONTEND_URL` no `docker-compose.yml` corresponde ao origin exibido no navegador.
- Certifique-se de que o Docker Desktop está rodando e que há memória suficiente disponível.
