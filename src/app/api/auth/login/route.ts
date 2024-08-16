
import authApiRequest from '@/apiRequests/auth';
import { cookies } from 'next/headers';
import { LoginBodyType } from './../../../../../../template/src/schemaValidations/auth.schema';
import jwt from "jsonwebtoken"
import { NextResponse } from 'next/server';
import { HttpError } from '@/lib/http';
export async function POST(request:Request){
    const body = (await request.json()) as LoginBodyType
    const cookieStore = cookies()
    try {
        const {payload} = await authApiRequest.sLogin(body)
        const {accessToken, refreshToken} = payload.data
        const decodeAccessToken = jwt.decode(accessToken) as {exp: number}
        const decodeRefreshToken = jwt.decode(refreshToken) as {exp: number}
        cookieStore.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            sameSite:'lax',
            secure: true,
            expires: decodeAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite:'lax',
            secure: true,
            expires: decodeRefreshToken.exp * 1000
        })
        return NextResponse.json(payload)
    } catch (error) {
        if(error instanceof HttpError){
            return NextResponse.json(error.payload, {
                status: error.status
            })
        }else{
            return NextResponse.json({
                message:'Có lỗi xảy ra'
            },{
                status: 500
            })
        }
    }
}