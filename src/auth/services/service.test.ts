import { JwtService } from "@nestjs/jwt";
import { IAuthRepository } from "../repositories/IAuthRepository";
import { AuthService } from "./service";
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from "@nestjs/common";

describe('User service', () => {
    let service: AuthService;

    const jwtServiceMockSign = jest.fn();
    const jwtServiceMockVerify = jest.fn();
    const jwtServiceMock = {
        sign: jwtServiceMockSign,
        verify: jwtServiceMockVerify
    }

    const authRepositoryMockGetById = jest.fn();
    const authRepositoryMockGetByNickname = jest.fn();
    const authRepositoryMockLogout = jest.fn();
    const authRepositoryMockRefreshToken = jest.fn();
    const authRepositoryMock: IAuthRepository = {
        getById: authRepositoryMockGetById,
        getByNickname: authRepositoryMockGetByNickname,
        logout: authRepositoryMockLogout,
        refreshToken: authRepositoryMockRefreshToken,
    }

    const cryptedpassword = bcrypt.hashSync('adminpass', 10);

    beforeEach(() => {
        service = new AuthService(authRepositoryMock, jwtServiceMock as unknown as JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('login', () => {
        it('should return the access token and refresh token', async () => {
            authRepositoryMockGetByNickname.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testUser',
                password: cryptedpassword
            })

            jwtServiceMockSign.mockReturnValueOnce('access token')
            jwtServiceMockSign.mockReturnValueOnce('refresh token')
            const result = await service.login('testUser', 'adminpass');
            expect(result).toEqual({
                accessToken: 'access token',
                refreshToken: 'refresh token',
            })
        });

        it('should throw unauthorized exception when wrong password', async () => {
            authRepositoryMockGetByNickname.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testUser',
                password: cryptedpassword
            })

            try {
                await service.login('testUser', 'badabomm');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedException());
                return;
            }
            expect(true).toBeFalsy();
        });
    });

    describe('logout', () => {
        it('should call the logout method from auth repository with the correct id', async () => {
            await service.logout('4204e0cc-9153-4b93-bbdb-275bae7f4bd5');
            expect(authRepositoryMockLogout).toHaveBeenCalledWith('4204e0cc-9153-4b93-bbdb-275bae7f4bd5')
        });
    });

    describe('refresh', () => {
        it('should throw unauthorized exception when no token provided', async () => {
            try {
                await service.refresh('');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedException('Refresh token missing'));
                return;
            }
            expect(true).toBeFalsy();
        });

        it('should throw unauthorized exception when token validation failed', async () => {
            jwtServiceMockVerify.mockImplementationOnce(() => {
                throw new Error();
            });
            try {
                await service.refresh('token');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedException('Refresh token invalid or expired'));
                return;
            }
            expect(true).toBeFalsy();
        });

        it('should throw unauthorized exception when user refresh token not found', async () => {
            jwtServiceMockVerify.mockReturnValueOnce({
                sub: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
            })
            authRepositoryMockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testUser',
                refreshToken: null
            })
            try {
                await service.refresh('token');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedException('User not found or refresh token missing'));
                return;
            }
            expect(true).toBeFalsy();
        });

        it('should throw unauthorized exception when token found is no longer valid', async () => {
            jwtServiceMockVerify.mockReturnValueOnce({
                sub: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
            })
            authRepositoryMockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testUser',
                refreshToken: bcrypt.hashSync('failure', 10)
            })
            try {
                await service.refresh('token');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedException('Refresh token incorrect'));
                return;
            }
            expect(true).toBeFalsy();
        });

        it('should return an access token and a refresh token', async () => {
            jwtServiceMockVerify.mockReturnValueOnce({
                sub: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
            })
            jwtServiceMockSign.mockReturnValueOnce('new access token');
            jwtServiceMockSign.mockReturnValueOnce('new refresh token')
            authRepositoryMockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
                nickname: 'testUser',
                refreshToken: bcrypt.hashSync('token', 10)
            })
            const result = await service.refresh('token');
            expect(authRepositoryMockRefreshToken).toHaveBeenCalledWith('4204e0cc-9153-4b93-bbdb-275bae7f4bd5', expect.any(String));
            expect(result).toEqual({
                accessToken: 'new access token',
                refreshToken: 'new refresh token'
            });
        });
    });


});