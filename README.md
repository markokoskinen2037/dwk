#### Exercise 3.06: DBaaS vs DIY

##### Database as a service (Google Cloud SQL)

Pros:

- Is fully managed, eliminating a lot of work required from the part of developers.
- Mainentance tasks such as scaling, patching and backups are handled by a third party = less work required.
- Making backups should be easy: "Easily configure replication and backups to protect your data."
- No need for specialized (internal) database professionals.
- Less downtime, because the DB does not run in kubernetes pods.

Cons:

- Reduced amount of database config options and general flexibility.
- Can be more expensive.

##### DIY database (PSQL with persistent volumes)

Pros:

- More flexibility on databases and their configuration.
- Can be cheaper than DBSaaS.

Cons:

- The database's containers run in pods, so they might sometimes need to be restarted causing downtime.
- Requires significant amount of manpower to configure and manage = more work.
- Not yet a mature field like DBSaaS.
- Faulty setups can cause data loss.
- Setting up backups is more difficult than in DBSaaS solutions.

Sources
https://cloud.google.com/sql
https://cloud.google.com/blog/products/databases/to-run-or-not-to-run-a-database-on-kubernetes-what-to-consider
https://convox.com/blog/k8s-cost-saving

---

#### Exercise 3.07: Commitment

Decided to go with a PostgreSQL database on Google SQL. Definitely sounded like the better (and easier) option for real world usecases. Besides I wanted to test how easily a Google SQL database can be set up for use.

---

#### Exercise 3.10

![image](https://user-images.githubusercontent.com/22393121/115245683-e0ad8300-a12d-11eb-9875-78a9565d94ab.png)

---

#### Exercise 4.03

Query: `sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})`

---

#### How to flux:

1. create flux-system namespace
2. apply ss master.key
3. `flux bootstrap github --owner=markokoskinen2037 --repository=dwk --personal --private=false --branch=master --path=clusters/my-cluster`

---

#### Exercise 5.03

![image](https://user-images.githubusercontent.com/22393121/115956260-884afc80-a504-11eb-8e94-9032c178fd2a.png)

---

#### Exercise 5.04 Platform comparison

Rancher vs. OpenShift.

Rancher is better, because:

- Installing Rancher takes minutes instead of days or even weeks.
- Updating Rancher is a smooth process with no issues nor disruptions to service.
- Rancher has less (no?) platform specific tools, reducing vendor lock-in.
- Rancher support extends beyond the service, to kubernetes ecosystem related tools.
- Rancher supports Docker containers.
- Rancher is cheaper.
- Rancher has less restrictions and more options to do stuff.
- Rancher does not turn OSS into proprietary solutions.
- Rancher is 100% OSS.

Sources:
https://rancher.com/blog/2020/rancher-vs-openshift/
https://ubuntu.com/kubernetes/compare
https://stackoverflow.com/questions/60934114/openshift-vs-rancher-what-are-the-differences

---

#### Exercise 5.06: Landscape

red = used elsewhere; green = used in this course

![image](./landscape_filled.png)



- Outside of this course: MySQL, mongodb, postgresql, apache spark, docker-compose, circleCI, jenkins, gitlab, aws, docker, sap, heroku, grafana, sentry, elastic, graylog, nginx, amazon ecs, containerd, aws cloudformation, docker container registry, and amazon ecs.

- New stuff within this course: redis, nats, helm, flux, k3s, k3d, kubernetes, coredns, traefik proxy, linkerd, google cloud (gke), google persistent disk, google container registry, prometheus, and grafana loki.

- Redis: was used in some exercises as the database.
- Nats: was used to pass messages between services to allow scaling.
- Helm: was used to easily install a lot of stuff, like SealedSecrets and NATS.
- Flux: was used together with GitHub Actions to enable CI/CD and gitops practices.
- K3s and k3d: were used to run a lightweight kubernetes cluster locally.
- Kubernetes: was used to define, scale, and manage containerized applications.
- Coredns: was used by k3d. It probably handles some service discovery stuff.
- Traefik-proxy: was used by k3d, as the Ingress contoller.
- Linkerd: was used to add a servicemesh to the project and for performing canary releases.
- Google cloud (gke): was used to learn, in practice, how a real cluster can be set up.
- Google persistent disk: was used by gke at some point to store GKE volumes.
- Google container registry: was used as the container registry for some docker images.
- Prometheus: was used to store/collect, search and visualize metrics collected from pods.
- Grafana loki: was used to collect and store logs from pods.
