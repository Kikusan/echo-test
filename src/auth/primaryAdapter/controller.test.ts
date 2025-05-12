import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthModule } from '../module';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    const authRepositoryMockGetById = jest.fn();
    const authRepositoryMockGetByNickname = jest.fn();
    const authRepositoryMock = {
        getById: authRepositoryMockGetById,
        getByNickname: authRepositoryMockGetByNickname,
        logout: jest.fn(),
        refreshToken: jest.fn(),
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
        })
            .overrideProvider('authRepository')
            .useValue(authRepositoryMock)
            .compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        app.useGlobalInterceptors(new ErrorInterceptor());
        app.use(cookieParser());
        await app.init();
    });
    let cryptedpassword = bcrypt.hashSync('pass', 10);

    describe('POST /auth/login', () => {
        it('should return access token and set refresh cookie', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ nickname: 'testuser', password: 'pass' })
                .expect(201);
            const decoded = jwt.decode(response.body.accessToken);

            const expected = {
                exp: expect.any(Number),
                iat: expect.any(Number),
                nickname: 'testuser',
                role: 'admin',
                sub: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
            };
            expect(decoded).toEqual(expected);
            expect(response.headers['set-cookie']).toEqual(
                expect.arrayContaining([
                    expect.stringContaining('refresh_token='),
                ]),
            );
        });

        it('should throw an unauthorized error if the user is unknown', async () => {

            authRepositoryMockGetByNickname.mockResolvedValueOnce(null)
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ nickname: 'testuser', password: 'pass' })
                .expect(401);
        });
    })

    describe('POST /auth/logout', () => {
        it('should return access token and set refresh cookie', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)

            const login = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ nickname: 'testuser', password: 'pass' });

            const token = login.body.accessToken;

            await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(201);

        });

        it('should throw an unauthorized error there is no token or the token is invalid', async () => {
            authRepositoryMockGetByNickname.mockResolvedValueOnce(null)
            await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer invalid-token`)
                .expect(401);
        });
    })



    afterAll(async () => {
        await app.close();
    });
});
