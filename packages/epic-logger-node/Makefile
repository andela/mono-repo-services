TAG = latest
IMAGE = us.gcr.io/microservices-kube/logger

run: image
	docker run $(IMAGE):$(TAG) 
image:
	gcloud docker -- build -t $(IMAGE):$(TAG) .


push: image
	gcloud docker -- push $(IMAGE):$(TAG)

deploy: push
	kubectl set image deployment/logger logger=$(IMAGE):$(TAG)