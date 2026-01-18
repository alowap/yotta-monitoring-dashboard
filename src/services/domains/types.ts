export interface Domain {
  dname: string
  dstatus: number
  dtype: number
  dfs: string
  busy: boolean
  vanityns1: string
  vanityns2: string
  ns1: string
  ns2: string
  created: Date
  updated: Date
}

export interface DomainListResponse {
  total: {
    total_count: number
    month_total_count: number
  }
  onelink: {
    one_link_count: number
    month_one_link_count: number
  }
  apps: {
    apps_count: number
    month_apps_count: number
  }
  domains: Domain[]
}

export interface AddDomainParam {
  dname: string
  dtype: number
}
