import authApiRequest from '@/apiRequests/auth';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken"
import { NextResponse } from 'next/server';

export async function POST(request:Request){
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value
    if(!refreshToken) {
        return NextResponse.json({
            message: 'Không tìm thấy refresh token'
        },{
            status: 401
        })
    }
    try {
        const { payload } = await authApiRequest.sRefreshToken({
            refreshToken
        })
        const decodeAccessToken = jwt.decode(payload.data.accessToken) as {exp: number}
        const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as {exp: number}
        cookieStore.set('accessToken', payload.data.accessToken, {
            path: '/',
            httpOnly: true,
            sameSite:'lax',
            secure: true,
            expires: decodeAccessToken.exp * 1000
        })
        cookieStore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite:'lax',
            secure: true,
            expires: decodeRefreshToken.exp * 1000
        })
        return NextResponse.json(payload)
    } catch (error:any) {
            return NextResponse.json({
                message: error.message ?? 'Có lỗi xảy ra'
            },{
                status: 401
            })
    }
}