import { SetMetadata } from '@nestjs/common';

export const IS_2FA_KEY = 'is2fa';
export const is2fa = () => SetMetadata(IS_2FA_KEY, true);