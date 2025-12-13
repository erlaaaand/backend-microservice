import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [__dirname + '/../../../**/*.orm-entity{.ts,.js}'], // Scan semua orm-entity
                synchronize: true, // Ubah jadi false saat production!
                logging: true, // Aktifkan log SQL untuk debugging
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }