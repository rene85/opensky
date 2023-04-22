import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export const axiosGet = (
    url: string,
    config?: AxiosRequestConfig<unknown>
): Promise<AxiosResponse<unknown, unknown>> => axios.get(url, config)
