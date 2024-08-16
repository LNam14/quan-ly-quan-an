import authApiRequest from '@/apiRequests/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request:Request){
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    if(!accessToken||!refreshToken) return NextResponse.json({
        message: 'Không nhận được access token hoặc refresh token'
    },{
        status: 200
    })
    try {
        const result = await authApiRequest.sLogout({
            accessToken,
            refreshToken
        })
        return NextResponse.json(result.payload)
    } catch (error) {
        return NextResponse.json({
             message:'Lỗi khi gọi API đến server backend'
        },{
             status: 200
        })
    }
}