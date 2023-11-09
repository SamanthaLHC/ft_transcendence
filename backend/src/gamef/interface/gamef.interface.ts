import { User } from "@prisma/client"

export interface Data {
  jgaucheid: number
  jgauche: number
  jdroiteid: number
  jdscockid: string
  jgscockid: string
  jdroite: number
  scoregauche: number
  scoredroite: number
  posballex: number
  posballey: number
  speedballX: number
  speedballY: number
}

export interface Room {
    id: number
    waitingId: number
    userone: User
    usertwo: User
    data: Data
  }