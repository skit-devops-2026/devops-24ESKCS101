.PHONY: install test build run docker-build docker-up

install:
	npm install

test:
	npm test

build:
	@echo "Releaf-Book is a static site -- no build step is required."

run:
	npx serve .

# Needed from M4 onwards
docker-build:
	@echo "TODO: docker build" && exit 1

docker-up:
	docker compose up --build
