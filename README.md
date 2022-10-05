# setup rules

1. npm i
2. populate env as per .env.example
   - S3 id and secret are the same as MINIO\_ credentials
   - DATABASE_URL is the full postgres url with credentials from the docker compose YAML file (e.g. https://www.prisma.io/docs/guides/development-environment/environment-variables#expanding-variables)
   - without postgres, you can use DATABASE_URL=file:./db.sqlite and switch the driver to sqlite in schema.prisma, but you'll have to comment out all @db.Text occurrences in the schema as well.
3. npx prisma db push
4. npm run dev
5. cd docker
6. populate the MINIO_ROOT_PASSWORD and POSTGRES_PASSWORD fields with your passwords of choice
7. run docker-compose up -d
8. log in to the minio console with your credentials
9. create a bucket with the name you entered into the .env file

enjoy development

# TODO

- invalidate data on mutations for better UX
