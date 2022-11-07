import React from "react"
import { trpc } from '../utils/trpc'
import NextError from 'next/error'

import { inferProcedureInput } from '@trpc/server'
import { Heading, Input, Textarea } from '@chakra-ui/react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { AppRouter } from '~/server/routers/_app'
import { useRouter } from 'next/router'

export interface Item {
  label: string;
  value: string;
}

const AddPost = () => {

  const [dataload, setdataload] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const handleCreateItem = (item: Item) => {
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  const utils = trpc.useContext()

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      await utils.post.list.invalidate()
    }
  })

  const router = useRouter()

  const tagQuery = trpc.post.alltaglist.useQuery()

  if (tagQuery.error) {
    return (
      <NextError
        title={tagQuery.error.message}
        statusCode={tagQuery.error.data?.httpStatus ?? 500}
      />
    )
  }

  const {data} = tagQuery;

  return (
    <>
      <Heading size="lg">Add a Post</Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const $form = e.currentTarget
          const values = Object.fromEntries(new FormData($form))
          type Input = inferProcedureInput<AppRouter['post']['add']>
          //    ^?
          var tags: String[] = [];
          selectedItems.map(item=>{
            tags.push(item.value);
          })
          const input: Input = {
            title: values.title as string,
            text: values.text as string,
            tags: selectedItems as {
              value: string;
              label: string;
          }[],
          }
          try {
            await addPost.mutateAsync(input)
            $form.reset()
            router.push('/')
          } catch (cause) {
            console.error({ cause }, 'Failed to add post')
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />

        <CUIAutoComplete
          label="Choose tags"
          placeholder="Type a Tags"
          onCreateItem={handleCreateItem}
          items={data}
          selectedItems={selectedItems}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
        />

        <Input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <Textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <Input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  )
}

export default AddPost
