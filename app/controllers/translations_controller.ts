import Translation from '#models/translation'
import { HttpContext } from '@adonisjs/core/http'

export default class TranslationsController {
  public async index({ view, params }: HttpContext) {
    const { language } = params

    let query = Translation.query()
    if (language) {
      query = query.where('language', language.toUpperCase())
    }
    const translations = await query

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

  public async update({ params, request, response }: HttpContext) {
    const data = request.only(['key', 'value'])
    const translation = await Translation.findOrFail(params.id)

    translation.key = data.key
    translation.value = data.value

    await translation.save()

    return response.json({
      success: true,
      message: 'Translation updated successfully',
      data: translation,
    })
  }

  public async delete({ params, response }: HttpContext) {
    const translation = await Translation.findOrFail(params.id)
    await translation.delete()
    return response.json({
      success: true,
      message: 'Translation deleted successfully',
    })
  }
}
