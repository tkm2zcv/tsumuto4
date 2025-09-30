export interface Account {
  id: string
  name: string
  dmLink: string
  createdAt: Date
  updatedAt: Date
  isFavorite?: boolean
  order?: number
  lastUsed?: Date
}

export interface Tweet {
  id: string
  content: string
  originalContent: string
  dmLink: string | null
  hashTags: string[]
  accountId: string | null
  used: boolean
  createdAt: Date
}

export interface ImportResult {
  success: boolean
  tweets: Tweet[]
  duplicates: Tweet[]
  errors: string[]
}

export interface StockTweet {
  id: string
  content: string
  createdAt: Date
}