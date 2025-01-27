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
    router.post('/:language/create', [TranslationsController, 'create'])
    router.put('/:id', [TranslationsController, 'update'])
    router.delete('/:id', [TranslationsController, 'delete'])
    router.get('/:language?', [TranslationsController, 'index'])
  })
  .prefix('/api/v1/translations')
router
  .group(() => {
    router.get('/:language/:id', [TranslationsController, 'edit']).as('translations.edit')
    router.post('/:language?', [TranslationsController, 'save']).as('translations.save')
    router.get('/:language?', [TranslationsController, 'index']).as('translations.index')
  })
  .prefix('/view/translations')
