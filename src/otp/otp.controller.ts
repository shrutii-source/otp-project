// src/otp/otp.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Endpoint to generate OTP
  @Get('generate')
  generateOtp(@Query('userId') userId: string): string {
    if (!userId) {
      return 'userId is required';
    }
    const otp = this.otpService.generateOtp(userId);
    return `OTP for user ${userId} is: ${otp}`;
  }

  // Endpoint to verify OTP
  @Get('verify')
  verifyOtp(
    @Query('userId') userId: string,
    @Query('otp') otp: string
  ): string {
    if (!userId || !otp) {
      return 'Both userId and otp are required';
    }
    return this.otpService.verifyOtp(userId, otp);
  }
}
