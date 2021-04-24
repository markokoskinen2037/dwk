const k8s = require("@kubernetes/client-node")
const mustache = require("mustache")
const request = require("request")
const JSONStream = require("json-stream")
const fs = require("fs").promises

const kc = new k8s.KubeConfig()

process.env.NODE_ENV === "development"
  ? kc.loadFromDefault()
  : kc.loadFromCluster()

const opts = {}
kc.applyToRequest(opts)

const client = kc.makeApiClient(k8s.CoreV1Api)

const sendRequestToApi = async (api, method = "get", options = {}) =>
  new Promise((resolve, reject) =>
    request[method](
      `${kc.getCurrentCluster().server}${api}`,
      { ...opts, ...options, headers: { ...options.headers, ...opts.headers } },
      (err, res) => {
        if (err) return reject(err)
        return resolve(JSON.parse(res.body))
      }
    )
  )

const fieldsFromDummysite = (object) => ({
  dummysite_name: object.metadata.name,
  url_to_clone: object.spec.url_to_clone,
  ingresspath: object.spec.ingresspath,
  pod_name: `${object.metadata.name}-pod`,
  service_name: `${object.metadata.name}-service`,
  namespace: object.metadata.namespace,
})

const getPodYAML = async (fields) => {
  const deploymentTemplate = await fs.readFile("pod.mustache", "utf-8")
  return mustache.render(deploymentTemplate, fields)
}

const getServiceYAML = async (fields) => {
  const deploymentTemplate = await fs.readFile("service.mustache", "utf-8")
  return mustache.render(deploymentTemplate, fields)
}

const getIngressYAML = async (fields, serviceDataForIngressUpdate) => {
  const deploymentTemplate = await fs.readFile("ingress.mustache", "utf-8")

  const acual_data = {
    stooges: serviceDataForIngressUpdate,
  }

  return mustache.render(deploymentTemplate, acual_data)
}

const createPod = async (fields) => {
  console.log(
    "Creating new pod for",
    fields.dummysite_name,
    "to namespace",
    fields.namespace
  )

  const yaml = await getPodYAML(fields)

  console.log(yaml)

  const result = await sendRequestToApi(
    `/api/v1/namespaces/${fields.namespace}/pods`,
    "post",
    {
      headers: {
        "Content-Type": "application/yaml",
      },
      body: yaml,
    }
  )

  console.log("createPod, result:")
  console.log(result)

  return result
}

const createService = async (fields) => {
  console.log(
    "Creating new service for",
    fields.dummysite_name,
    "to namespace",
    fields.namespace
  )

  const yaml = await getServiceYAML(fields)

  console.log(yaml)

  const result = await sendRequestToApi(
    `/api/v1/namespaces/${fields.namespace}/services`,
    "post",
    {
      headers: {
        "Content-Type": "application/yaml",
      },
      body: yaml,
    }
  )

  console.log("createService, result:")
  console.log(result)

  return result
}

const createIngress = async (fields) => {
  const currentServices = await sendRequestToApi(
    `/api/v1/namespaces/${fields.namespace}/services`
  )

  const currentIngresses = await sendRequestToApi(
    `/apis/networking.k8s.io/v1/namespaces/${fields.namespace}/ingresses`
  )

  console.log("currentingresses:")
  console.log(currentIngresses.items)
  const ingressExists = currentIngresses.items.find(
    (e) => e.metadata.name === "dummysite-ingress"
  )

  const serviceDataForIngressUpdate = currentServices.items
    .filter((e) => e.metadata.labels.dummysite)
    .map(({ metadata }) => {
      return {
        serviceName: metadata.name,
        ingresspath: metadata.labels.ingresspath,
      }
    })

  console.log("Creating new ingress to namespace", fields.namespace)

  if (!ingressExists) {
    console.log("creating new ingress")
    const yaml = await getIngressYAML(fields, serviceDataForIngressUpdate)

    console.log(yaml)

    const result = await sendRequestToApi(
      `/apis/networking.k8s.io/v1/namespaces/${fields.namespace}/ingresses`,
      "post",
      {
        headers: {
          "Content-Type": "application/yaml",
        },
        body: yaml,
      }
    )

    console.log("createIngress, result:")
    console.log(result)

    return result
  } else {
    console.log("paching existing ingress...")

    const newSpec = {
      rules: [
        {
          http: {
            paths: serviceDataForIngressUpdate.map(
              ({ serviceName, ingresspath }) => ({
                backend: {
                  service: {
                    name: serviceName,
                    port: {
                      number: 2345,
                    },
                  },
                },
                path: `/${ingresspath}`,
                pathType: "Exact",
              })
            ),
          },
        },
      ],
    }

    const result = await sendRequestToApi(
      `/apis/networking.k8s.io/v1/namespaces/${fields.namespace}/ingresses/dummysite-ingress`,
      "patch",
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify([
          {
            op: "replace",
            path: "/spec",
            value: newSpec,
          },
        ]),
      }
    )

    console.log("patchIngress, result:")
    console.log(result)

    return result
  }
}

const removeService = async (namespace, service_name) => {
  return sendRequestToApi(
    `/api/v1/namespaces/${namespace}/services/${service_name}`,
    "delete"
  )
}

const removePod = (namespace, pod_name) =>
  sendRequestToApi(`/api/v1/namespaces/${namespace}/pods/${pod_name}`, "delete")

const cleanupForDummysite = async ({ namespace, service_name, pod_name }) => {
  console.log("Doing cleanup", service_name, pod_name)

  console.log("removing pod")
  const res = await removePod(namespace, pod_name)
  console.log(res)

  console.log("removing service")
  const res2 = await removeService(namespace, service_name)
  console.log(res2)
}

const maintainStatus = async () => {
  ;(await client.listPodForAllNamespaces()).body // A bug in the client(?) was fixed by sending a request and not caring about response

  const dummysite_stream = new JSONStream()

  dummysite_stream.on("data", async ({ type, object }) => {
    console.log(object)
    const fields = fieldsFromDummysite(object)

    if (type === "ADDED") {
      console.log("New dummysite added... creating resources")
      await createPod(fields)
      await createService(fields)
      await createIngress(fields)
    }
    if (type === "DELETED") cleanupForDummysite(fields)
  })

  request
    .get(
      `${
        kc.getCurrentCluster().server
      }/apis/stable.dwk/v1/dummysites?watch=true`,
      opts
    )
    .pipe(dummysite_stream)
}

maintainStatus()
