import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserService } from '../services/service';
import { UserController } from './controller';
import { FakeAuthModule } from '../../auth/fakeModule';
import * as bcrypt from 'bcryptjs';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';

describe('user controller', () => {
    let app: INestApplication;
    const serviceMockGet = jest.fn();
    const serviceMockRegister = jest.fn();
    const serviceMockUpdate = jest.fn();
    const serviceMockDelete = jest.fn();
    const serviceMockGetByNickname = jest.fn();
    const serviceMock = {
        get: serviceMockGet,
        getByNickname: serviceMockGetByNickname,
        register: serviceMockRegister,
        update: serviceMockUpdate,
        delete: serviceMockDelete,
        updateRefreshToken: jest.fn(),

    }
    let cryptedpassword = bcrypt.hashSync('testpassword', 10);

    const authRepositoryMockGetById = jest.fn();
    const authRepositoryMockGetByNickname = jest.fn();
    const authRepositoryMock = {
        getById: authRepositoryMockGetById,
        getByNickname: authRepositoryMockGetByNickname,
        logout: jest.fn(),
        refreshToken: jest.fn(),
    }


    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [FakeAuthModule.forRoot(authRepositoryMock)],
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: serviceMock },
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        app.useGlobalInterceptors(new ErrorInterceptor());
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('GET /users', () => {
        const testGet = async (token: string, code: number) => {
            await request(app.getHttpServer())
                .get('/users?pageSize=10&page=1')
                .set('Authorization', `Bearer ${token}`)
                .expect(code);
        }
        it('should be ok if the user is admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);
            await testGet(token, 200);

            const expectedRequester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'testuser',
                role: 'admin'
            };
            const expectedSearchParams = {
                filter: {},
                page: 1,
                pageSize: 10,
            }
            expect(serviceMockGet).toHaveBeenCalledWith(expectedRequester, expectedSearchParams);
        });

        it('should return a 403 if the user is not admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)

            const token = await getToken(app);
            await testGet(token, 403);
            expect(serviceMockGet).not.toHaveBeenCalled();
        });

        it('should return a 401 if the user is not logged in', async () => {
            const token = await getToken(app);
            await testGet(token, 401);
            expect(serviceMockGet).not.toHaveBeenCalled();
        });

        it('should return a 400 if the search params are wrong', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)

            const token = await getToken(app);
            await request(app.getHttpServer())
                .get('/users?pageSize=10&page=1&failure=true')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        });
    });

    describe('DELETE /users/:id', () => {
        const testDelete = async (token: string, code: number) => {
            await request(app.getHttpServer())
                .delete(`/users/4204e0cc-9153-4b93-bbdb-275bae7f4bd5`)
                .set('Authorization', `Bearer ${token}`)
                .expect(code);
        }
        it('should be ok if the user is admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);

            await testDelete(token, 204);

            const expectedRequester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'testuser',
                role: 'admin'
            };
            expect(serviceMockDelete).toHaveBeenCalledWith(expectedRequester, '4204e0cc-9153-4b93-bbdb-275bae7f4bd5');
        });

        it('should return a 403 if the user is not admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);
            await testDelete(token, 403);
            expect(serviceMockDelete).not.toHaveBeenCalled();
        });

        it('should return a 401 if the user is not logged in', async () => {
            const token = await getToken(app);
            await testDelete(token, 401);
            expect(serviceMockDelete).not.toHaveBeenCalled();
        });
    });

    describe('PUT /users/:id', () => {
        const payload = {
            address: 'testaddress',
            comment: 'testcomment',
            name: 'testname',
            nickname: 'testuser',
            password: 'testpassword',
            role: {
                id: '22222222-2222-2222-2222-222222222222',
                name: 'admin'
            }
        };
        const testUpdate = async (token: string, code: number, userToBeUpdated: any) => {

            await request(app.getHttpServer())
                .put(`/users/4204e0cc-9153-4b93-bbdb-275bae7f4bd5`)
                .send(userToBeUpdated)
                .set('Authorization', `Bearer ${token}`)
                .expect(code);
        }
        it('should be ok if the user is admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);

            const expectedRequester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'testuser',
                role: 'admin'
            };
            await testUpdate(token, 200, payload);
            expect(serviceMockUpdate).toHaveBeenCalledWith(expectedRequester, { ...payload, id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5' });
        });

        it('should be ok if the user is not admin', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);
            const expectedRequester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'testuser',
                role: 'user'
            };

            await testUpdate(token, 200, payload);
            expect(serviceMockUpdate).toHaveBeenCalledWith(expectedRequester, { ...payload, id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5' });
        });

        it('should return a 400 if the payload is bad', async () => {
            const mockedUser = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'testuser',
                password: cryptedpassword,
            }
            authRepositoryMockGetByNickname.mockResolvedValueOnce(mockedUser)
            serviceMockGetByNickname.mockResolvedValueOnce(mockedUser)
            const token = await getToken(app);
            const badPayload = {
                "nickname": "popol",
                "password": "itIsASecret",
                "sas": "Robert",
                "comment": "the one with the popol nickname",
                "address": "Robert",
                "role": {
                    "id": "22222222-2222-2222-2222-222222222222",
                    "name": "admin"
                }
            }
            await testUpdate(token, 400, badPayload);
            expect(serviceMockUpdate).not.toHaveBeenCalled();
        });

        it('should return a 401 if the user is not logged in', async () => {
            const token = await getToken(app);
            await testUpdate(token, 401, payload);
            expect(serviceMockUpdate).not.toHaveBeenCalled();
        });
    });

    describe('POST /users', () => {
        const payload = {
            address: 'testaddress',
            comment: 'testcomment',
            name: 'testname',
            nickname: 'testuser',
            password: 'testpassword',
            role: {
                id: '22222222-2222-2222-2222-222222222222',
                name: 'admin'
            }
        };
        const testRegister = async (token: string, code: number, userToBeCreated: any) => {

            await request(app.getHttpServer())
                .post(`/users`)
                .send(userToBeCreated)
                .set('Authorization', `Bearer ${token}`)
                .expect(code);
        }
        it('should be ok', async () => {
            serviceMockGetByNickname.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testuser',
                password: cryptedpassword,
            })
            const token = await getToken(app);

            await testRegister(token, 201, payload);
            expect(serviceMockRegister).toHaveBeenCalledWith(payload);
        });

        it('should return a 400 if the payload is bad', async () => {
            serviceMockGetByNickname.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'testuser',
                password: cryptedpassword,
            })
            const token = await getToken(app);
            const badPayload = {
                "nickname": "popol",
                "password": "itIsASecret",
                "sas": "Robert",
                "comment": "the one with the popol nickname",
                "address": "Robert",
                "role": {
                    "id": "22222222-2222-2222-2222-222222222222",
                    "name": "admin"
                }
            }
            await testRegister(token, 400, badPayload);
            expect(serviceMockRegister).not.toHaveBeenCalled();
        });
    });

});

async function getToken(app: INestApplication<any>) {
    const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ nickname: 'testuser', password: 'testpassword' });

    const token = login.body.accessToken;
    return token;
}

