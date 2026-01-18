export interface WhitelistRecord {
  name: string
  user: string
  expire: Date 
  ip: string
  created: Date
  updated: Date
}

export interface AddWhitelistRecordParam {
  rname: string,
  rip: string,
  uname: string,
  rexpire: Date
}