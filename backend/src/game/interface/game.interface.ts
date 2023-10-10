import { User } from "@prisma/client"

export interface Room {
    id: number
    userone: User
    usertwo: User
  }