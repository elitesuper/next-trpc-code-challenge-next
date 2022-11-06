import { Code, Heading, Text } from '@chakra-ui/react'
import NextError from 'next/error'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '~/pages/_app'
import { trpc } from '~/utils/trpc'

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string
  const postQuery = trpc.post.byId.useQuery({ id })

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    )
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>
  }
  const { data } = postQuery
  return (
    <>
      <Heading>{data.title}</Heading>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <Text>{data.text}</Text>

      <h2>Raw data:</h2>
      <Code>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </Code>
    </>
  )
}

export default PostViewPage
