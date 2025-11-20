let _id = 0

export const useConfirm = () => {
  const id = ref(`dialog-${_id++}`)
  const { t } = useI18n()

  const open = (message: string): Promise<boolean> => {
    const promise = Promise.withResolvers<boolean>()

    const dialog = document.createElement('dialog')
    dialog.id = id.value
    dialog.textContent = message
    dialog.addEventListener('close', () => {
      promise.resolve(false)
      document.body.removeChild(dialog)
    })

    const confirm = document.createElement('button')
    confirm.textContent = t('Confirm')
    confirm.addEventListener('click', (event) => {
      event.preventDefault()
      promise.resolve(true)
      document.body.removeChild(dialog)
    })
    dialog.append(confirm)

    const cancel = document.createElement('button')
    cancel.textContent = t('Cancel')
    cancel.type = 'button'
    cancel.autofocus = true
    cancel.addEventListener('click', () => {
      promise.resolve(false)
      document.body.removeChild(dialog)
    })
    dialog.append(cancel)

    document.body.append(dialog)
    dialog.showModal()

    return promise.promise
  }

  return { open }
}
