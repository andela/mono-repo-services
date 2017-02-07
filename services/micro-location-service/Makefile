TAG = $(shell git rev-parse --short HEAD)
PROJECT = sandbox-kube
IMAGE = us.gcr.io/$(PROJECT)/location
pwd = $(shell pwd)
TOPIC = location-topic
LOCATION_IMAGE = us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)
# DATABASE_URL will be passed as environment variable

all: test

dependencies:
	npm install -g npm
	npm install module-deps
	npm install -g gulp

test:
	npm test

image:
	docker build -t $(IMAGE):$(TAG) -t $(IMAGE):latest .

push: image
	gcloud docker push $(IMAGE):$(TAG)
  gcloud docker push $(IMAGE):latest

deploy: push
	kubectl set image deployment/location location=$(IMAGE)/$(TAG)

deploy_stage: 
	make deploy PROJECT=microservices-kube

deploy_prod: build
	make deploy PROJECT=andela-kube

run:
	docker run $(IMAGE):$(TAG)

minikube:
	git submodule update --init
	eval $$(minikube docker-env) && docker build -t $(IMAGE):latest .

kafka_install:
	brew install kafka

ki: kafka_install

kafka_start:
	zkserver start && brew services start kafka

ks: kafka_start

kafka_stop:
	brew services stop kafka && zkserver stop

kst: kafka_stop

kafka_create:
	kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partition 1 --topic $(TOPIC)
kc: kafka_create

kafka_consume: kafka_start
	kafka-console-consumer --zookeeper localhost:2181 --topic $(TOPIC) --from-beginning

kafka_produce: kafka_start
	kafka-console-producer --broker-list localhost:9092 --topic $(TOPIC)

clean:
