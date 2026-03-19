declare module 'qrcode' {
  type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

  interface QRCodeToDataURLOptions {
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
    margin?: number;
    width?: number;
  }

  const QRCode: {
    toDataURL: (text: string, options?: QRCodeToDataURLOptions) => Promise<string>;
  };

  export default QRCode;
}
