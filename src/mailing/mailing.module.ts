import { Module } from '@nestjs/common';
import { SendMailWithTweetsJob } from './send-mail-with-tweets.jobs';

@Module({
  providers: [SendMailWithTweetsJob],
})
export class MailingModule {}
