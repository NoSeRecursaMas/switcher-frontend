run-docker:
	docker run -p 8000:80 -v .:/app frontend

build-docker:
	docker build -t frontend .

rebuild:
	docker container rm switcher-frontend-react-1
	docker volume rm switcher-frontend_node_modules
	docker-compose up --build

run:
	npm run dev

test:
	npm run test

install:
	npm install