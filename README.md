# setup rules

1. npm i
2. populate env as per .env.example (S3 id and secret are the same as MINIO\_ credentials)
3. npx prisma db push
4. npm run dev
5. cd docker
6. populate the MINIO_ROOT_PASSWORD with your password of choice
7. run docker-compose up -d
8. log in to the minio console with your credentials
9. create a bucket with the name you entered into the .env file

enjoy development

# TODO

- invalidate data on mutations for better UX
