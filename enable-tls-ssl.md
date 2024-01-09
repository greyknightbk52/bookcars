# Generate TLS/SSL private key and certificate
- Original guideline https://github.com/aelassas/bookcars/wiki/Docker#ssl
- Install `mkcert` tool to create valid certificates recognized by browsers
  - https://github.com/FiloSottile/mkcert
  - create rootCA
    `mkcert -install`
- Create key & cert for mongodb
  - `mkcert -cert-file mongodb.crt -key-file mongodb.key localhost 127.0.0.1 mongo`
  - Note: `mongo` as docker FQNS for mongodb instance
- Create key & cert for application services
  - `mkcert -client -cert-file bookcars.crt -key-file bookcars.key localhost 127.0.0.1 mongo`
    - Note: option `-client` to create certificate with purpose for client SSL verification
  - Combine key & cert for usage of `mongoose` library when configure SSL DB connection
    - `cat bookcars.key bookcars.crt > bookcars.pem`
- get key & cert of rootCA
  `cat $(mkcer -CAROOT)/rootCA.pem > ./rootCA.crt`
  `cat $(mkcer -CAROOT)/rootCA-key.pem > ./rootCA.key`

# Update docker-compose.yml file
- To mount key & certificate files to containers
- To enable SSL on mongodb

# Start just mongodb instance to test TLS/SSL connection
- `docker compose up mongo`
- Use `mongosh` CLI tool to connect to DB
  - From host
  `mongosh --tls --tlsCAFile ./rootCA.crt --tlsCertificateKeyFile ./bookcars.pem`
  - From inside the DB container
  `mongosh --tls --tlsCAFile /etc/ssl/rootCA.crt --tlsCertificateKeyFile /etc/ssl/bookcars.pem`

# Start `api` service to test connection from mongoose
- `docker compose up api`
- Check console log to ensure the service start successfully

# Lastly, start `fronend` & `backend` service

# Browse driver & admin web sites at HTTPS links
- driver site for making booking: https://localhost
- admin site for management: https://localhost:3001
- ensure all certificates valid to browser without trust issue

# Restore demo database
- Use `mongorestore` in tool set mongo database tools at https://www.mongodb.com/try/download/database-tools
  - `mongorestore --ssl --sslCAFile ../rootCA.crt --sslPEMKeyFile ../bookcars.pem --verbose --drop --gzip --host=127.0.0.1 --port=27017 --username=admin --password=PASSWORD --authenticationDatabase=admin --nsInclude="bookcars.*" --archive=bookcars.gz`
