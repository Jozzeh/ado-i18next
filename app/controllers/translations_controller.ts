import Translation from '#models/translation'
import { HttpContext } from '@adonisjs/core/http'

export default class TranslationsController {
  public async index({ view, params, request }: HttpContext) {
    const { language } = params
    const page = request.input('page', 1)
    const distinctLangs = await Translation.query().select('language').distinct('language')
    const languages = distinctLangs.map((record) => record.language)

    let query = Translation.query()
    if (language) {
      query = query.where('language', language.toUpperCase())
    }
    const translations = await query.paginate(page, 9)

    return view.render('translations/index', {
      translations,
      languages,
      language: language,
      returnUrl: request.completeUrl(true),
    })
  }

  public async edit({ view, params }: HttpContext) {
    const { id } = params

    let query = Translation.find(id)
    const translation = await query

    return view.render('translations/edit', { translation })
  }

  public async remove({ view, params }: HttpContext) {
    const { id } = params

    let query = Translation.find(id)
    const translation = await query

    return view.render('translations/delete', { translation, id })
  }

  public async save({ request, view, params }: HttpContext) {
    const data = request.only(['id', 'value'])
    const translation = await Translation.findOrFail(data.id)

    translation.value = data.value

    await translation.save()
    const { language } = params

    let query = Translation.query()
    if (language) {
      query = query.where('language', language.toUpperCase())
    }
    const translations = await query

    return view.render('translations/index', { language: translation.language, translations })
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

  public async delete({ params, response, request }: HttpContext) {
    const translation = await Translation.findOrFail(params.id)
    await translation.delete()
    const returnUrl = request.input('returnUrl')
    if (returnUrl) {
      return response.redirect(returnUrl)
    } else {
      return response.redirect().toPath('/view/translations')
    }
  }
}
