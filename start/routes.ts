/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TranslationsController = () => import('#controllers/translations_controller')

router
  .group(() => {
    router.post('/:language/create', [TranslationsController, 'create']).as('translations.create')
    router.get('/:language?', [TranslationsController, 'index']).as('translations.index')
  })
  .prefix('/api/v1/translations')
