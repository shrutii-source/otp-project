export declare class OtpService {
    private readonly otpFilePath;
    constructor();
    private ensureFileExists;
    generateOtp(userId: string): string;
    verifyOtp(userId: string, otp: string): string;
}
