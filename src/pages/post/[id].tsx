import { Stack,Badge, Heading, Text } from '@chakra-ui/react'
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
      <Stack spacing={3}>
        <Heading>{data[0].title}</Heading>
        <Stack direction='row'>
          <Badge variant='solid' colorScheme='green'>
            Created {data[0].createdAt.toLocaleDateString('en-us')}
          </Badge>
        </Stack>
        <Stack direction='row'>
          {data[1].map((item:any)=>
            <Badge key={item.label} variant='outline' colorScheme='green'>
              {item.label}
            </Badge>
          )}
        </Stack>
        <Text fontSize='2xl'>{data[0].text}</Text>
      </Stack>

      {/* <h2>Raw data:</h2>
      <Code>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </Code> */}
    </>
  )
}

export default PostViewPage
