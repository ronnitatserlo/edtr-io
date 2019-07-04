import * as R from 'ramda'

import { scopeActions, setupStore, waitUntil } from '../../__helpers__'
import { selectors } from '../../src/store'
import { persist } from '../../src/store/history/actions'
import { plugins } from '../../__fixtures__/plugins'

let store: ReturnType<typeof setupStore>
const scopedActions = scopeActions()

function initRoot(initialState: { plugin: string; state?: unknown }) {
  return scopedActions.initRoot({
    initialState,
    plugins,
    defaultPlugin: 'text'
  })
}

beforeEach(() => {
  store = setupStore()
})

describe('Root', () => {
  test('Initial state', () => {
    expect(selectors.getRoot(store.getState())).toEqual(null)
  })

  describe('Init Root', () => {
    test('Stateless Plugin', async () => {
      store.dispatch(initRoot({ plugin: 'stateless' }))
      await waitUntil(() =>
        R.any(action => action.type === persist.type, store.getActions())
      )
      expect(selectors.serializeRootDocument(store.getState())).toEqual({
        plugin: 'stateless'
      })
    })

    test('Stateful Plugin', async () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === persist.type, store.getActions())
      )
      expect(selectors.serializeRootDocument(store.getState())).toEqual({
        plugin: 'stateful',
        state: 0
      })
    })

    test('Nested', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === persist.type, store.getActions())
      )
      expect(selectors.serializeRootDocument(store.getState())).toEqual({
        plugin: 'nested',
        state: {
          child: {
            plugin: 'stateful',
            state: 0
          }
        }
      })
    })

    test('Nested Array', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nestedArray',
          state: {
            children: [{ plugin: 'stateful', state: 1 }]
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === persist.type, store.getActions())
      )
      expect(selectors.serializeRootDocument(store.getState())).toEqual({
        plugin: 'nestedArray',
        state: {
          children: [
            {
              plugin: 'stateful',
              state: 1
            }
          ]
        }
      })
    })

    test('Nested Inside Nested', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nestedArray',
          state: {
            children: [
              { plugin: 'stateful', state: 1 },
              {
                plugin: 'nested',
                state: {
                  child: {
                    plugin: 'stateful',
                    state: 2
                  }
                }
              }
            ]
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === persist.type, store.getActions())
      )
      expect(selectors.serializeRootDocument(store.getState())).toEqual({
        plugin: 'nestedArray',
        state: {
          children: [
            {
              plugin: 'stateful',
              state: 1
            },
            {
              plugin: 'nested',
              state: {
                child: { plugin: 'stateful', state: 2 }
              }
            }
          ]
        }
      })
    })
  })
})
