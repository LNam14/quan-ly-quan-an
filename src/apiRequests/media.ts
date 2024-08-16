import { UploadImageResType } from '@/schemaValidations/media.schema';
import http from '@/lib/http';

const mediaApiRequest = {
    upload: (formData:FormData) => http.post<UploadImageResType>("/media/upload",formData)
}

export default mediaApiRequest