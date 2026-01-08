import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private redis: ReturnType<typeof createClient>){}
    
    generateOtp(): string{
        return Math.floor(100000 + Math.random() * 90000).toString();
    }

    async saveOtp(identifier: string, otpName: string, otp: string, ttlSeconds = 300): Promise<void>{
        const key = `${otpName}:${identifier}`;
        await this.redis.set(key, otp, {EX: ttlSeconds});//Сохранение OTP с автоматическим удалением, ttl - 5 мин
    }

    async verifyAndConsumeOtp(identifier: string, otpName: string,  otp: string): Promise<boolean>{
        const key = `${otpName}:${identifier}`;
        const storedOtp = await this.redis.get(key);

        if(storedOtp === otp){
            await this.redis.del(key);//Удаление otp
            return true;
        }

        return false;
    }

    async exists(identifier: string, otpName: string): Promise<boolean>{
        const key = `${otpName}:${identifier}`;
        return (await this.redis.exists(key)) === 1;
    }

    async saveResetToken(identifier: string, resetTokenName: string, resetToken: string, ttlSeconds = 900): Promise<void>{
        const key = `${resetTokenName}:${identifier}`;
        await this.redis.set(key, resetToken, {EX: ttlSeconds});
    }

    async verifyAndConsumeResetToken(identifier: string, resetTokenName: string, resetToken: string): Promise<boolean>{
        const key = `${resetTokenName}:${identifier}`;
        const storedResetToken = await this.redis.get(key);
        if(storedResetToken == resetToken){
            await this.redis.del(key);
            return true;
        }

        return false;
    }
}
