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
    router.post('/:id/delete', [TranslationsController, 'delete'])
    router.post('/:language/create', [TranslationsController, 'create'])
    router.delete('/:id', [TranslationsController, 'delete'])
    router.put('/:id', [TranslationsController, 'update'])
    router.get('/:language?', [TranslationsController, 'index'])
  })
  .prefix('/api/v1/translations')
router
  .group(() => {
    router.get('/:language/:id', [TranslationsController, 'edit']).as('translations.edit')
    router
      .get('/:language/:id/delete', [TranslationsController, 'remove'])
      .as('translations.delete')
    router
      .post('/:language/:id/delete', [TranslationsController, 'delete'])
      .as('translations.deletePost')
    router.get('/:language?', [TranslationsController, 'index']).as('translations.index')
  })
  .prefix('/view/translations')
