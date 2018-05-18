FROM nginx:1.13.9-alpine

# Add configuration files
COPY image-files/ /

# Copy nginx config
COPY image-files/etc/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
