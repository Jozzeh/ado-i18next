import Translation from '#models/translation'
import { HttpContext } from '@adonisjs/core/http'

export default class TranslationsController {
  public async index({ view, params }: HttpContext) {
    const { language } = params

    let query = Translation.query()
    if (language) {
      query = query.where('language', language.toUpperCase())
    }

    // Execute the query
    const translations = await query

    // Render your Edge template, passing the results
    return view.render('translations/index', { translations })
  }

  public async create({ request, response, params }: HttpContext) {
    const { language } = params
    const translationsObject = request.body()

    if (typeof translationsObject !== 'object' || Array.isArray(translationsObject)) {
      return response.badRequest({
        error: 'Request body must be a JSON object of { key: value } pairs.',
      })
    }

    let createdCount = 0
    const skippedKeys: string[] = []

    for (const [key, value] of Object.entries(translationsObject)) {
      if (!key || typeof value !== 'string') {
        skippedKeys.push(key)
        continue
      }
      const existing = await Translation.query()
        .where('key', key)
        .where('language', language.toUpperCase())
        .first()

      if (existing) {
        skippedKeys.push(key)
      } else {
        await Translation.create({ key, value, language: language.toUpperCase() })
        createdCount++
      }
    }

    return response.json({
      message: 'Bulk translation insert completed.',
      createdCount,
      skippedKeys,
    })
  }
}
