/* eslint-disable no-restricted-syntax */

export function createCollectionActions<
  T extends {
    id: string
    created: string
  },
>() {
  type CollectionMap = Map<
    string,
    T & {
      __broken?: boolean
      __created?: Date
    }
  >
  type ThisType = {
    collection: CollectionMap
  }
  return {
    markBroken(this: ThisType, id: string) {
      const item = this.collection.get(id)
      if (item) {
        item.__broken = true
      }
    },

    sortByCreated(this: ThisType) {
      return [...this.collection.values()].sort((b, a) => {
        const leftCreated = a.__created || new Date(a.created)
        const rightCreated = b.__created || new Date(b.created)
        return leftCreated.getTime() - rightCreated.getTime()
      })
    },
    add(this: ThisType, data: T) {
      this.collection.set(data.id, {
        ...data,
        __created: new Date(data.created),
      })
    },
    update(this: ThisType, data: T) {
      this.collection.set(data.id, {
        ...data,
        __created: new Date(data.created),
      })
    },
    remove(this: ThisType, id: string) {
      this.collection.delete(id)
    },
    find(this: ThisType, predicate: (item: T) => boolean) {
      for (const item of this.collection.values()) {
        if (predicate(item)) {
          return item
        }
      }
      return null
    },
  }
}

export function cloneDeep<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj // Return non-object values and null as is
  }

  if (Array.isArray(obj)) {
    const clonedArray = [] as any
    for (const element of obj) {
      clonedArray.push(cloneDeep(element))
    }
    return clonedArray
  }

  const clonedObj = {} as any
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = cloneDeep(obj[key])
    }
  }
  return clonedObj
}
