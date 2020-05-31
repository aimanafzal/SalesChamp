
Instructions and code to deploy MongoDB, a backend Node.js microservice that connects to it, and a frontend that connects to the backend.

The frontend uses React and is served with nginx.

The backend uses Express and features a `/api/movies` endpoint with CRUD operations enabled.
The backend uses Express and features a `/api/genres` endpoint with CRUD operations enabled.

MongoDB is deployed with persistence and replicas: this is where todo items are stored.

Tested using the Kubernetes service provided by [Docker for Desktop on Mac](https://docs.docker.com/docker-for-mac/kubernetes/).

## Quickstart for local development
- Deploy MongoDB as a Docker container or on Kubernetes first
- `cd backend`
- `npm install`
- `npm start`
- `cd ../frontend`
- `npm install`
- `npm start`

## Quickstart for Docker
- `docker build -f frontend/Dockerfile -t frontend:v1.0.0 frontend`
- `docker build -f backend/Dockerfile  -t backend:v1.0.0 backend`
- `docker pull mongo`
- `docker run -d -p 27017:27017 --name mern-mongo mongo `
- `export MONGO_URL=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mern-mongo)`
- `docker run -p 30555:30555 -e MONGO_URL=$MONGO_URL backend:v1.0.0`
- In a new Terminal - `docker run -p 3001:80 frontend:v1.0.0`

## Quickstart for Kubernetes
Requires building the images first, see the quickstart for Docker section.

- Set your Kubernetes context so you're pointing to a Kubernetes environment.
- `helm install --name mongo --set usePassword=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 stable/mongodb`
- `helm install --name backend backend/chart/backend`
- `helm install --name frontend frontend/chart/frontend`


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

### Deploying the frontend
See the frontend folder in this repository. It will discover this backend Kubernetes service and connect to it. The frontend listens on port 3001, the backend listens on port 30555.

### Deploying the backend
`helm install --name backend chart/backend`

### Using Postman

Assuming you've deployed to Kubernetes (notice the bigger port number here: this is the specified NodePort which will be used when you Helm install its chart):




Data is stored in MongoDB (both in the container and in the persistent volume on your local disk).


### Like to script things too?
`./create-todos.sh x` where x is how many todos you would like to create. A POST request is sent to the to create x amount of todos by sending POST requests to the `api/todos endpoint`.


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

With the Prometheus UI, create a graph for `http_requests_total` and then run `./create-todos.sh 500`. You will see the request total increase by 500 (look for POSTs, an example graph is `http_requests_total{code="200",handler="/api/todos",instance="10.1.1.15:30555",job="kubernetes-service-endpoints",kubernetes_name="backend-service",kubernetes_namespace="default",method="post"}`). 
