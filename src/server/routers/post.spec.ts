/**
 * Integration test for the `post` router
 */
import { createContextInner } from '../context'
import { AppRouter, appRouter } from './_app'
import { inferProcedureInput } from '@trpc/server'
import { describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'

describe('post', () => {
  it('add and get post', async () => {
    const ctx = await createContextInner({})
    const caller = appRouter.createCaller(ctx)

    const post = await caller.post.add({
      text: faker.lorem.sentence(),
      title: faker.random.words(3)
    })
    const byId = await caller.post.byId({ id: post.id })

    expect(byId.text).toMatchInlineSnapshot('"Quasi sit nam laudantium."')
    expect(byId.title).toMatchInlineSnapshot('"Clothing woot Northwest"')
  })
})
