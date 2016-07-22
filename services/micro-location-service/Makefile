TAG = 0.0.22
PROJECT = microservices-kube
IMAGE = image_name
pwd = $(shell pwd)
MOCK_IMAGE = us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)
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
	kubectl patch deployment fellowship-role -p '{"spec":{"template":{"spec":{"containers":[{"name":"fellowship-role","image":"'$(MOCK_IMAGE)'"}]}}}}'

run:
	docker run  us.gcr.io/$(PROJECT)/$(IMAGE):$(TAG)

clean:
