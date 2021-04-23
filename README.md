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
