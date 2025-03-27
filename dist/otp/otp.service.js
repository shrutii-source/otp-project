"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let OtpService = class OtpService {
    otpFilePath;
    constructor() {
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            this.otpFilePath = path.join(process.cwd(), 'dist', 'otp', 'data', 'otps.json');
        }
        else {
            this.otpFilePath = path.join(process.cwd(), 'src', 'data', 'otps.json');
        }
        this.ensureFileExists();
    }
    ensureFileExists() {
        const dataFolder = path.dirname(this.otpFilePath);
        if (!fs.existsSync(dataFolder)) {
            console.log('Data folder does not exist. Creating...');
            fs.mkdirSync(dataFolder, { recursive: true });
        }
        if (!fs.existsSync(this.otpFilePath)) {
            console.log('OTP file does not exist. Creating...');
            fs.writeFileSync(this.otpFilePath, '[]');
        }
    }
    generateOtp(userId) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const generationTime = Date.now();
        const newOtpRecord = {
            userId,
            otp,
            generationTime,
        };
        let otpRecords = [];
        if (fs.existsSync(this.otpFilePath)) {
            const fileData = fs.readFileSync(this.otpFilePath, 'utf-8');
            otpRecords = JSON.parse(fileData);
        }
        otpRecords.push(newOtpRecord);
        fs.writeFileSync(this.otpFilePath, JSON.stringify(otpRecords, null, 2));
        return otp;
    }
    verifyOtp(userId, otp) {
        if (!fs.existsSync(this.otpFilePath)) {
            return 'OTP file not found.';
        }
        const otpRecords = JSON.parse(fs.readFileSync(this.otpFilePath, 'utf-8'));
        const record = otpRecords.find((rec) => rec.userId === userId && rec.otp === otp);
        if (!record) {
            return 'OTP is invalid.';
        }
        const expirationTime = 10 * 60 * 1000;
        const currentTime = Date.now();
        if (currentTime - record.generationTime > expirationTime) {
            return 'OTP has expired.';
        }
        return 'OTP verified.';
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OtpService);
//# sourceMappingURL=otp.service.js.map