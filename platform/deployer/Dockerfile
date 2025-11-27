FROM traefik:v3.6.2

# Creamos la carpeta donde cargarán las reglas dinámicas
RUN mkdir -p /etc/traefik/dynamic/projects

# Copiamos configuración estática
COPY traefik.yml /etc/traefik/traefik.yml

# Copiamos configuración dinámica (global)
COPY dynamic/ /etc/traefik/dynamic/

# Puerto interno que Traefik expone
EXPOSE 80

CMD ["traefik"]
 