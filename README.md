Postman collection can be accessed throug the link give below or a copy of collection is available on the root:
https://www.getpostman.com/collections/2eac8c3525d5f390eaca

Instructions and code to deploy MongoDB, a backend Node.js microservice that connects to it.

The backend uses Express and features a `/api/movies` endpoint with CRUD operations enabled.
The backend uses Express and features a `/api/genres` endpoint with CRUD operations enabled.

MongoDB is deployed with persistence and replicas: this is where items are stored.

Tested using the Kubernetes service provided by [Docker for Desktop on Mac](https://docs.docker.com/docker-for-mac/kubernetes/).

## Quickstart for local development
- Deploy MongoDB as a Docker container or on Kubernetes first
- `cd backend`
- `npm install`
- `npm start`

## Quickstart for Docker
- `docker build -f backend/Dockerfile  -t backend:v1.0.0 backend`
- `docker pull mongo`
- `docker run -d -p 27017:27017 --name mern-mongo mongo `
- `export MONGO_URL=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mern-mongo)`
- `docker run -p 30555:30555 -e MONGO_URL=$MONGO_URL backend:v1.0.0`


## Quickstart for Kubernetes
Requires building the images first, see the quickstart for Docker section.

- Set your Kubernetes context so you're pointing to a Kubernetes environment.
- `helm install --name mongo --set usePassword=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 stable/mongodb`
- `helm install --name backend backend/chart/backend`



### Docker

Install Docker on your Mac.

```
docker build -t backend:v1.0.0 .
docker run -d -p 27017:27017 --name mern-mongo mongo
export MONGO_URL=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mern-mongo)
docker run -p 30555:30555 -e MONGO_URL=$MONGO_URL backend:v1.0.0
```

### Kubernetes

Use the Docker system tray (click the whale in the top right corner) then go to Preferences -> Advanced -> Enable Kubernetes, choose Kubernetes as the orchestrator and to show system containers. Apply and restart Docker, waiting for Kubernetes to be reported as available.

Check `values.yaml` points to the image you've built, e.g. `backend:v1.0.0`.

Deploy MongoDB into your cluster with `helm install --name mongo --set usePassword=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 stable/mongodb`

MongoDB has a variety of [configuration options](https://github.com/helm/charts/tree/master/stable/mongodb) you can provide with `--set`.

Deploy this Node.js application into your cluster with  `helm install --name backend chart/mernexample`. 

This Node.js application connects to the MongoDB service and will retry on connection loss (so the MongoDB pod can be killed).

Data from MongoDB is persisted at `$HOME/.docker/Volumes/mongo-mongodb`.

Tested on Mac with Kubernetes (docker-for-desktop).

### Deploying the backend
`helm install --name backend chart/backend`

### Using Postman

Assuming you've deployed to Kubernetes (notice the bigger port number here: this is the specified NodePort which will be used when you Helm install its chart):




Data is stored in MongoDB (both in the container and in the persistent volume on your local disk).


### Like to script things too?
`./script.sh x` where x is how many records you would like to create. A POST request is sent to the to create x amount of records by sending POST requests to the `api/movies endpoint` `api/genres endpoint`.


### Like dashboards?
- Visit `localhost:30555/appmetrics-dash` in your web browser to view request, CPU, memory and call stack information automatically gathered for you

### How about Prometheus?
- `helm install --name prometheus stable/prometheus --set server.service.type=NodePort`

You can view the Prometheus dashboard at the NodePort Prometheus uses: hint, do `kubectl get svc | grep exposed-prometheus`: it is the larger port you see that should be used.

This works because in our Node.js application, `service.yaml` has the following defined:

```
  annotations:
    prometheus.io/scrape: 'true'
```

The `appmetrics-prometheus` module sends data to the `/metrics` endpoint, which is scraped by Prometheus automatically: you can view the collected metrics at `localhost:30555/metrics`.

