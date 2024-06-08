# Anylist GraphQL

El presente proyecto es una GraphQL API que implementa Postgres como base de datos para llevar el control de artículos

## Cómo correr el proyecto en desarrollo

1. Clonar el respositorio
2. Copie el `.env.template` y renombrelo a `.env`
3. Ejecutar

```
npm install
```

4. Levantar la base de datos, es necesario tener docker instalado en su equipo

```
docker-compose up -d
```

5. Levantar el servidor

```
npm run start:dev
```

6. Visitar el sitio

```
localhost:3000/graphql
```

7. Ejecutar el seed

```
mutation Mutation {
  executeSeed
}
```
