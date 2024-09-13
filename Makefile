run:
	docker-compose up

rebuild:
	docker container rm switcher-frontend-react-1
	docker volume rm switcher-frontend_node_modules
	docker-compose up --build

test:
	npm run test

run-no-docker: i
	npm run dev

i:
	npm install