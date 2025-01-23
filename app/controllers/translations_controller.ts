import Translation from '#models/translation'
import { HttpContext } from '@adonisjs/core/http'

export default class TranslationsController {
  public async index({ view }: HttpContext) {
    const translations = await Translation.query()
    return view.render('translations/index', { translations })
  }
}
