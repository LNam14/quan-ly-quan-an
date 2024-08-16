import { getAccessTokenFormLocalStorage, getRefreshTokenFormLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken"
import authApiRequest from "@/apiRequests/auth";

export default function RefreshToken() {
    // Nhưng trang không check refresh token
    const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
    const pathname = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return
        let interval: any = null
        const checkAndRefreshToken = async () => {
            // Không nên đưa logic lấy accessToken và refreshToken ra khỏi func này
            // Vì mỗi lần checkAndRefreshToken được gọi thì sẽ có 1 accessToken và refreshToken mới
            const accessToken = getAccessTokenFormLocalStorage()
            const refreshToken = getRefreshTokenFormLocalStorage()
            if (!accessToken || !refreshToken) return
            const decodeAccessToken = jwt.decode(accessToken) as { exp: number, iat: number }
            const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number }
            const now = Math.round(new Date().getTime() / 1000)
            if (decodeRefreshToken.exp <= now) return
            if (decodeRefreshToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken()
                    setAccessTokenToLocalStorage(res.payload.data.accessToken)
                    setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }
        //Time out phải bé hơn thời gian hết hạn của access token
        const TIMEOUT = 1000
        checkAndRefreshToken()
        interval = setInterval(checkAndRefreshToken, TIMEOUT)
    }, [pathname])
    return null
}