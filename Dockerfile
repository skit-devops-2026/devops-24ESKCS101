FROM nginx:1.27-alpine
ARG COMMIT_SHA=unknown
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY images/ /usr/share/nginx/html/images/
COPY js/ /usr/share/nginx/html/js/
RUN echo "$COMMIT_SHA" > /usr/share/nginx/html/health
EXPOSE 80