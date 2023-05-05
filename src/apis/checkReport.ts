import httpRequest from "@/request";


export function apiGetReport(id: number) {
  return httpRequest({
    url: `/api/report/${id}`,
    method: 'get',
  })
}

export function apiGetMetascanFile(key: string) {
  return httpRequest({
    url: `/api/metascan/file/${key}`,
    method: 'get',
  })
}

export function apiGetMythrilscanFile(params: {id:string, name: string}) {
  return httpRequest({
    url: `/api/project/${params.id}/contract/${params.name}/content`,
    method: 'get',
  })
}

export function apiGetContractContent(id: string, name: string) {
  return httpRequest({
    url: `/api/project/${id}/contract/${name}/content`,
    method: 'get',
  })
}