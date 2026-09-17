cd C:\Releaf-Book
@"
.PHONY: install test build run docker-build docker-up

install:
`tnpm install

test:
`tnpm test

build:
`t@echo "Releaf-Book is a static site — no build step is required."

run:
`tnpx serve .

# Needed from M4 onwards
docker-build:
`t@echo "TODO: docker build" && exit 1

docker-up:
`tdocker compose up --build
"@ | Set-Content Makefile -Encoding UTF8
Get-Content Makefile