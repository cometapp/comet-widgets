// import Map from "core-js/library"

export class MediaModel {
  uuid: string
  type: number
  thumbnail?: string
  created_at: Date
  taken_at: Date
  owner: string
  ratio: number
  formats: any
  // formats: Map<string, string>;
}
