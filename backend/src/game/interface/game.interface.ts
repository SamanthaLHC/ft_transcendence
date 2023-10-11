import { User } from "@prisma/client"

export interface Data {
  jgaucheid: number
  jgauche: number
  jdroiteid: number
  jdroite: number
  posballex: number
  posballey: number
}

export interface Room {
    id: number
    userone: User
    usertwo: User
    data: Data
  }