import { OtpService } from './otp.service';
export declare class OtpController {
    private readonly otpService;
    constructor(otpService: OtpService);
    generateOtp(userId: string): string;
    verifyOtp(userId: string, otp: string): string;
}
