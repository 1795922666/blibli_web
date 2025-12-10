import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import type { FlatRequestInstance, RequestInstanceOptions } from './type'
import Axios, { AxiosError } from 'axios'

// 扩展 AxiosRequestConfig 接口，添加 showMessage 属性
declare module 'axios' {
  interface AxiosRequestConfig {
    showMessage?: boolean
  }
}

// 类型守卫函数，用于检查响应数据是否包含 code 和 msg 属性
function hasCodeAndMsg(data: unknown): data is { code: number; msg?: string } {
  return typeof data === 'object' && data !== null && 'code' in data
}

export function createFlatRequest<ResponseData = unknown>(
  instanceConfig: CreateAxiosDefaults & { showMessage: boolean },
  options?: RequestInstanceOptions<ResponseData>
): FlatRequestInstance<ResponseData> {
  const instance: AxiosInstance = customInstance(instanceConfig, options)

  const flatRequest: FlatRequestInstance<ResponseData> = async function flatRequest(
    config: AxiosRequestConfig
  ) {
    try {
      // 启动加载动画
      window.$loadingBar?.start()
      // 发送请求
      const response: AxiosResponse<ResponseData> = await instance(config)
      // 获取响应类型
      const responseType = response.config.responseType ?? 'json'

      // 如果响应类型为 json 且有转换函数，进行响应转换
      if (responseType === 'json' && options?.transformResponse) {
        const data = (await options.transformResponse(response)) ?? response
        return { data, error: null, response }
      }

      // 使用类型守卫检查响应数据
      if (hasCodeAndMsg(response.data)) {
        if (response.data.code === 200) {
          if (response.config.showMessage) {
            window.$message?.success(response.data.msg!)
          }
          return {
            data: response.data,
            error: null,
            response
          }
        }
      }
      return null
    } catch (error) {
      // 结束加载动画
      window.$loadingBar?.finish()
      return null
    } finally {
      // 确保加载动画结束
      window.$loadingBar?.finish()
    }
  } as FlatRequestInstance<ResponseData>

  return flatRequest
}

function customInstance<ResponseData = unknown>(
  config?: CreateAxiosDefaults,
  options?: RequestInstanceOptions<ResponseData>
): AxiosInstance {
  const instance = Axios.create(config)

  if (options === undefined) return instance

  // 请求拦截器
  instance.interceptors.request.use((conf) => {
    return options.onRequest ? options.onRequest(conf) : conf
  })

  // 响应拦截器
  instance.interceptors.response.use(
    async (res) => {
      try {
        const responseType = res.config.responseType ?? 'json'
        if (
          responseType !== 'json' ||
          (options.isBackendSuccess && (await options.isBackendSuccess(res)))
        ) {
          return res
        }

        if (options.onBackendFail) {
          const fail = await options.onBackendFail(res, instance)
          if (fail) return fail
        }

        if (hasCodeAndMsg(res.data)) {
          const backendError = new AxiosError<ResponseData>(
            'the backend request error',
            res.data.code,
            res.config,
            res.request,
            res
          )

          if (options.onError) {
            await options.onError(backendError)
          }

          throw backendError
        }
        return res
      } finally {
        // 结束加载动画
        window.$loadingBar?.finish()
      }
    },
    (error) => {
      // 结束加载动画
      window.$loadingBar?.finish()
      return Promise.reject(error)
    }
  )

  return instance
}
