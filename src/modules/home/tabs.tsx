import clsx from 'clsx'
import { defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

import { NoteList } from '../notes/list'
import { PostList } from '../notes/posts/list'

const styles = {
  // tab: 'data-[headlessui-state="selected"]:(bg-white shadow text-primary-700)',
  tab: 'w-16 box-border',
}

const routeType = ['note', 'post', 'about']
export const HomeTabs = defineComponent({
  name: 'HomeTabs',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const selectedIndex = ref(
      route.query.type ? routeType.indexOf(route.query.type as string) : 0,
    )

    watchEffect(() => {
      selectedIndex.value = routeType.indexOf(route.query.type as string)
    })

    return () => (
      <TabGroup
        defaultIndex={0}
        selectedIndex={selectedIndex.value}
        onChange={(index) => {
          router.replace({
            query: {
              ...route.query,
              page: 1,
              type: routeType[index],
            },
          })
          selectedIndex.value = index
        }}
      >
        <TabList
          class={clsx(
            'space-x-2 rounded-xl bg-primary-100-lighter/10 dark:bg-neutral-900/50 inline-block py-1 px-1 -ml-1 relative',
            '[&>button]:(rounded-lg py-2.5 px-4 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-primary-100 !outline-none focus:ring-2 z-1 relative)',
          )}
        >
          <Tab class={styles.tab}>日志</Tab>
          <Tab class={styles.tab}>技术</Tab>
          <Tab class={styles.tab}>关于</Tab>
          <div
            class={
              'absolute top-0 bottom-0 w-16 bg-white shadow text-primary-700 rounded-lg my-1.25 -left-1 z-[0] transition-left duration-300'
            }
            style={{
              left: `calc(4rem * ${selectedIndex.value} - 0.25rem + ${selectedIndex.value} * 0.5rem)`,
            }}
          ></div>
        </TabList>
        <TabPanels class={'mt-6'}>
          <TabPanel>
            <NoteList />
          </TabPanel>
          <TabPanel>
            <PostList />
          </TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    )
  },
})
