PROJECT = sandbox-kube
IMAGE = us.gcr.io/$(PROJECT)/location
pwd = $(shell pwd)
TOPIC = location-topic
LOCATION_IMAGE = us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)
# DATABASE_URL will be passed as environment variable
export TAG = $(shell git rev-parse --short HEAD)
export HOST_IP=$(shell ipconfig getifaddr en0 || ipconfig getifaddr en1)

all: 
	docker-compose up location-svc

docker_build:
	docker-compose build --no-cache location-svc

dependencies:
	npm install -g npm
	npm install module-deps
	npm install -g gulp

test:
	docker-compose run -e DATABASE_URL='postgres://postgres:password@200.0.0.1:5432/location_test' location-svc npm test

image:
	docker build -t $(IMAGE):$(TAG) -t $(IMAGE):latest .

push: image
	gcloud docker -- push $(IMAGE):$(TAG)
  	gcloud docker -- push $(IMAGE):latest

deploy: push
	kubectl set image deployment/location location=$(IMAGE):$(TAG)

deploy_stage: 
	make deploy PROJECT=microservices-kube

deploy_prod: build
	make deploy PROJECT=andela-kube

run:
	docker run $(IMAGE):$(TAG)

minikube:
	git submodule update --init
	eval $$(minikube docker-env) && docker build -t $(IMAGE):latest .

shared:
	git submodule sync
	git submodule update --init
	git submodule foreach "(git checkout develop; git pull)"
	
keys:
	openssl genrsa -out compose/keys/auth-private-key.json 1024 && \
	openssl rsa -in compose/keys/auth-private-key.json -pubout > compose/keys/auth-public-key.json

gen_compose:
	svc_level='' svc_user='' svc_authorization='' envtpl < shared/compose/docker-compose.yaml.jinja2 > docker-compose.yml
	
compose:
	sudo ifconfig lo0 alias 200.0.0.1 255.255.255.0
	./shared/compose/up.sh

bootstrap:
	git submodule update --init && cd shared && git checkout develop && cd ..
	./shared/compose/bootstrap.sh
	rm -rf node_modules
	cp docker-compose.override.yml.sample docker-compose.override.yml