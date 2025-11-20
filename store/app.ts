import axios from 'axios'
import * as z from 'zod'

const createResponseSchema = <T>(data: T) =>
  z.object({
    code: z.int(),
    data,
    message: z.string(),
  })

export const useAppStore = defineStore('app', () => {
  const config = useRuntimeConfig()
  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
  })

  const users = ref<{ id: number; name: string; age: number }[]>([])

  const load: () => Promise<void> = async () => {
    const response = await instance.get('/user')

    const schema = createResponseSchema(
      z.array(
        z.object({
          id: z.int(),
          name: z.string(),
          age: z.int(),
        })
      )
    )
    const parsed = schema.parse(response.data)
    if (parsed.code !== 200) {
      alert('Please retry later...')
      throw Error('Something went wrong...')
    }

    users.value = parsed.data
  }

  const get: (req: { id: number }) => Promise<{ name: string; age: number }> = async (req) => {
    return users.value.find((user) => user.id === req.id)!
  }

  const post: (req: { name: string; age: number }) => Promise<void> = async (req) => {
    const response = await instance.post('/user', { name: req.name, age: req.age })

    const schema = createResponseSchema(
      z.object({
        id: z.int(),
      })
    )
    const parsed = schema.parse(response.data)
    if (parsed.code !== 200) {
      alert('Please retry later...')
      throw Error('Something went wrong...')
    }

    users.value = [...users.value, { id: parsed.data.id, name: req.name, age: req.age }]
  }

  const put: (req: { id: number; name: string; age: number }) => Promise<void> = async (req) => {
    const response = await instance.put('/user', { id: req.id, name: req.name, age: req.age })

    const schema = createResponseSchema(z.undefined())
    const parsed = schema.parse(response.data)
    if (parsed.code !== 200) {
      alert('Please retry later...')
      throw Error('Something went wrong...')
    }

    const index = users.value.findIndex((user) => user.id === req.id)
    if (index === -1) throw ReferenceError()
    users.value = users.value
      .slice(0, index)
      .concat(req)
      .concat(users.value.slice(index + 1))
  }

  const remove: (req: { id: number }) => Promise<void> = async (req) => {
    const response = await instance.delete('/user', { data: { id: req.id } })

    const schema = createResponseSchema(z.undefined())
    const parsed = schema.parse(response.data)
    if (parsed.code !== 200) {
      alert('Please retry later...')
      throw Error('Something went wrong...')
    }

    const index = users.value.findIndex((user) => user.id === req.id)
    if (index === -1) throw ReferenceError()
    users.value = users.value.slice(0, index).concat(users.value.slice(index + 1))
  }

  return {
    users,
    load,
    get,
    post,
    put,
    remove,
  }
})
