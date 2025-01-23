import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Translation extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public language!: string

  @column()
  public key!: string

  @column()
  public value!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
