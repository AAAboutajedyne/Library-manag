## About
This is a library management app, handling collection of books and their authors. It uses a 3-tier classic NestJS architecture with:
  - Prisma: as an ORM
  - Ramda: for some functions utils, and FP techniques
  - dayjs: alternative to moment.js; for manipulating dates
  - axios: HTTP Client, for external call to "openlibrary"
  - class-transformer / class-validator: for transforming and validating input data
  - @nestjs/config: for parsing .env files
  - @nestjs/mapped-types: to construct variants on a base dto/entity type in a more convenient way.
  - Express: the underlying HTTP server framework

## TODO
  1. ✔︎ Ajouter un nouveau livre avec les informations suivantes : titre, auteur, date de publication, genre.

  2. ✔︎ Mettre à jour les informations d’un livre existant.
      - ✔︎ (Avec Tests unitaires)

  3. ✔︎ Obtenir les informations d’un livre spécifique.
      - ✔︎ (Avec Tests unitaires)    

  4. ✔︎ Lister tous les livres, avec la possibilité de filtrer par auteur, genre ou date de publication.

  5. ✔︎ Avoir une note sur 10 d’un livre spécifique en fonction de sa date de publication (la note est meilleurs pour les livres récents) et du nom de l’auteur (certains auteurs sont mieux noté que d’autres)
      - ✔︎ (Avec Tests unitaires)

  6. ✔︎ Requête externe (Appel HTTP client): Pouvoir trouver un livre à partir de son code ISBN en appelant une autre api:
      - [API] https://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405&format=json

## Installation

```bash
$ npm install
$ docker-compose up -d
$ npx prisma migrate deploy
$ npx prisma db seed

# [OPTIONAL] to see data in a GUI
$ npx prisma studio
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

```

---
<p align="right">Written with Care ❤️</p>
