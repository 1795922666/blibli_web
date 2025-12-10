import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import { computed, ref } from 'vue'

const themeRef = ref<'light' | 'dark'>('light')
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: themeRef.value === 'light' ? lightTheme : darkTheme
}))

// 提示实例
export function setupNaiveUIMessage(): void {
  const { message, loadingBar } = createDiscreteApi(['message', 'loadingBar'], {
    configProviderProps: configProviderPropsRef
  })

  window.$message = message
  window.$loadingBar = loadingBar
}
