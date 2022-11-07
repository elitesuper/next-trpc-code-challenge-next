/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { t } from '../trpc'
import { Post, Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '../prisma'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  text: true,
  createdAt: true,
  updatedAt: true
})

const defaultTagSelect = Prisma.validator<Prisma.TagSelect>()({
  id: true,
  label: true,
  value: true,
})

const defaultTagonPostSelect = Prisma.validator<Prisma.TagonPostsSelect>()({
  tagId:true,
  postId:true,
})


export const postRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish()
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

      const items = await prisma.post.findMany({
        select: defaultPostSelect,

        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor
            }
          : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!
        nextCursor = nextItem.id
      }

      return {
        items: items.reverse(),
        nextCursor
      }
    }),
  alltaglist: t.procedure.query( async () =>{
    const tags = await prisma.tag.findMany({
      select: {
        value:true,
        label:true,
      }
    });
    return tags
  }),
  byId: t.procedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      const { id } = input
      const post = await prisma.post.findUnique({
        where: { id },
        select: defaultPostSelect
      })

      const tagsref = await prisma.tagonPosts.findMany({
        where: { postId: post?.id },
        select:{tagId:true},
      })
      var tags:any[] = []
      for(var i of tagsref){
        const selftags = await prisma.tag.findUnique({
          where: { id: i.tagId },
          select:{label:true,},
        })
        tags.push(selftags);
      }

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`
        })
      }
      return [post,tags]
    }),
  add: t.procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        text: z.string().min(1),
        tags:z.array(z.object({value:z.string(),label:z.string()}))
      })
    )
    .mutation(async ({ input }) => {
      const postdata = {
        id: input.id,
        title: input.title,
        text: input.text,
      }
      const post = await prisma.post.create({
        data: postdata,
        select: defaultPostSelect
      })
      

      for(const i of input.tags){
        const value = await prisma.tag.findFirst(
          {
            select: defaultTagSelect,
            where: { value: i.value },
          }
        )
        if(value == null)
        {
          const tag = await prisma.tag.create({
            data:i,
            select: defaultTagSelect
          })

          const tagonpostdata = {
            tagId:tag.id,
            postId:post.id,
          }
          const tagonpost = await prisma.tagonPosts.create({
            data:tagonpostdata,
            select:defaultTagonPostSelect
          })
        }else{
          const tagonpostdata = {
            tagId:value.id,
            postId:post.id,
          }
          const tagonpost = await prisma.tagonPosts.create({
            data:tagonpostdata,
            select:defaultTagonPostSelect
          })
        }
      }
      return post
    })
})
