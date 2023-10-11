import { User } from "@prisma/client"

export interface Data {
  jgaucheid: number
  jgauche: number
  jdroiteid: number
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
    userone: User
    usertwo: User
    data: Data
  }