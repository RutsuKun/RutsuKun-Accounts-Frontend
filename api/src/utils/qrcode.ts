import * as qrcode from 'qrcode';

export const generateDataURLQRCode = (dataURL: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(dataURL, (err, qrcodeData) => {
            if(err) reject(err);
            resolve(qrcodeData)
        });
    });
}