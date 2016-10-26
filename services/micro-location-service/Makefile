TAG = 0.0.23
PROJECT = microservices-kube
IMAGE = location
pwd = $(shell pwd)
TOPIC = locations-topic
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
	docker build -t us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG) -t us.gcr.io/$(PROJECT)/$(IMAGE):latest .

push: image
	gcloud docker push us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)

deploy: push
	kubectl patch deployment locations -p '{"spec":{"template":{"spec":{"containers":[{"name":"locations","image":"'$(LOCATION_IMAGE)'"}]}}}}'

run:
	docker run  us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)

minikube:
	git submodule update --init
	eval $$(minikube docker-env) && docker build -t us.gcr.io/$(PROJECT)/$(IMAGE):minikube .

run:
	docker run  us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)

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
