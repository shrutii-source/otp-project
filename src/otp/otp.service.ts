import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';


interface OTPRecord {
    userId: string;
    otp: string;
    generationTime: number;
  }

@Injectable()
export class OtpService {

    private readonly otpFilePath :string;

    constructor() {// Check if we are in production or development
      const isProduction = process.env.NODE_ENV === 'production';
  
      // Set the correct path based on whether the app is running in production or development
      if (isProduction) {
        // In production, look for the file in dist folder (after build)
        this.otpFilePath = path.join(process.cwd(), 'dist', 'otp', 'data', 'otps.json');
      } else {
        // In development, look for the file in src folder
        this.otpFilePath = path.join(process.cwd(), 'src', 'data', 'otps.json');
      }
  
      this.ensureFileExists();}
      private ensureFileExists() {
        // Get the directory for the file path
        const dataFolder = path.dirname(this.otpFilePath);
    
        // Check if the 'data' folder exists
        if (!fs.existsSync(dataFolder)) {
          console.log('Data folder does not exist. Creating...');
          fs.mkdirSync(dataFolder, { recursive: true }); // Create folder if it doesn't exist
        }
    
        // Check if the file exists
        if (!fs.existsSync(this.otpFilePath)) {
          console.log('OTP file does not exist. Creating...');
          fs.writeFileSync(this.otpFilePath, '[]'); // Create an empty file if it doesn't exist
        }
      }
    // Generate OTP and store it in a JSON file
    generateOtp(userId: string): string {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      const generationTime = Date.now();
  
      const newOtpRecord: OTPRecord = {
        userId,
        otp,
        generationTime,
      };
  
      // Read existing OTP records from otps.json
      let otpRecords: OTPRecord[] = [];
      if (fs.existsSync(this.otpFilePath)) {
        const fileData = fs.readFileSync(this.otpFilePath, 'utf-8');
        otpRecords = JSON.parse(fileData);
      }
  
      // Add the new OTP record
      otpRecords.push(newOtpRecord);
  
      // Write the updated records to the file
      fs.writeFileSync(this.otpFilePath, JSON.stringify(otpRecords, null, 2));
  
      return otp;
    }
  
    // Verify OTP
    verifyOtp(userId: string, otp: string): string {
      if (!fs.existsSync(this.otpFilePath)) {
        return 'OTP file not found.';
      }
  
      const otpRecords: OTPRecord[] = JSON.parse(
        fs.readFileSync(this.otpFilePath, 'utf-8')
      );
  
      const record = otpRecords.find((rec) => rec.userId === userId && rec.otp === otp);
  
      if (!record) {
        return 'OTP is invalid.';
      }
  
      // Check if OTP expired (e.g., after 10 minutes)
      const expirationTime = 10* 60 * 1000; // 10 minutes in ms
      const currentTime = Date.now();
  
      if (currentTime - record.generationTime > expirationTime) {
        return 'OTP has expired.';
      }
  
      return 'OTP verified.';
    }
}
