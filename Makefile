DOCKER_COMPOSE = docker-compose.yml

# VOLUME_DB=/home/mriant/data/database
# VOLUME_WEBSITE=/home/mriant/data/website

.PHONY: all
all: up

.PHONY: up
up: build
	docker compose -f ${DOCKER_COMPOSE} up

.PHONY: detach
detach: build
	docker compose -f ${DOCKER_COMPOSE} up -d

.PHONY: stop
stop:
	docker compose -f ${DOCKER_COMPOSE} stop

.PHONY: down
down:
	docker compose -f ${DOCKER_COMPOSE} down

.PHONY: build
build:
	docker compose -f ${DOCKER_COMPOSE} build

.PHONY: clean_images
clean_images: down
	docker system prune -af

.PHONY: clean_volumes
clean_volumes: down
	if [ $(shell docker volume ls -q | wc -l) != '0' ]; \
	then \
		docker volume rm -f $(shell docker volume ls -q); \
	fi

.PHONY: fclean
fclean: clean_images clean_volumes

.PHONY: re
re: fclean
	make all
