declare namespace Word {
  interface Site {
    url: string
    owner: string
  }

  interface Config {
    urlPrefix: string
    site: Array<Site>
  }

  interface Data {
    page: {
      aliasName: string | null
      indexTitle: string | null
      indexTemplateId: string | null
      searchType: string | null
      current: number
      size: number
      total: number
      records: Record[]
    }
  }

  interface Record {
    owner: number
    editor: string
    siteurl: string
    endDate: string
    author: string
    column: number
    auditing: string
    source: string
    title: string
    columnurl: string
    content?: string
    url: string
    newsType: string
    intro: string
    subtitle: string
    id: number
    keyword: string
    columnName: string
    createDate: string
    es_system_mail: string
    es_system_id_card: string
    es_system_tel: string
    es_system_student_card: string
    ownerName: string
    index: string
    indexId: string
    indexScore: number
    indexTemplateId: string
    attachment?: Attachment
  }

  interface Attachment {
    fileExt: string
    url: string
    downloadUrl: string
    fileName: string
    fileContent: string
  }

  interface Log {
    url: string
    ownerName: string
    title: string
    keyWord: string
  }
}
