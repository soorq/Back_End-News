import { AccessStrategy, RefreshStrategy } from '@/shared/strategy';
import { TokenModule } from '../token/token.module';
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => TokenModule)],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy, RefreshStrategy],
})
export class AuthModule {}
