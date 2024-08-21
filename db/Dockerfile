FROM postgres:16.1-bullseye

USER postgres

COPY ./db/scripts/1_create_users_table.sql /docker-entrypoint-initdb.d/
RUN echo "Copied 1_create_users_table.sql"
