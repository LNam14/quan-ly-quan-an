
import { UseFormSetError } from 'react-hook-form';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from '@/components/ui/use-toast';
import { EntityError } from './http';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path : string) => {
  return path.startsWith("/") ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}:{
  error:any
  setError?:UseFormSetError<any>
  duration?:number
})=>{
  if(error instanceof EntityError && setError){
    error.payload.errors.forEach((item)=>{
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  }else{
    toast({
      title:'Lỗi',
      description:error?.payload?.message ?? 'Lỗi không xác định',
      value: 'destructive',
      duration: duration ?? 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFormLocalStorage = () => isBrowser ? localStorage.getItem('accessToken') : null

export const getRefreshTokenFormLocalStorage = () => isBrowser ? localStorage.getItem('refreshToken') : null

export const setAccessTokenToLocalStorage = (value: string) => isBrowser ? localStorage.setItem('accessToken', value) : null

export const setRefreshTokenToLocalStorage = (value: string) => isBrowser ? localStorage.setItem('refreshToken', value) : null
