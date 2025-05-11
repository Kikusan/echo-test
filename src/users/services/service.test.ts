import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../tools/errors";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserService } from "./service";
import { Requester, Search, UserToBeRegistered, UserToBeUpdated } from "./types";


describe('User service', () => {
    let userRepository: IUserRepository;
    let service: UserService;
    const mockGet = jest.fn();
    const mockRegister = jest.fn();
    const mockUpdate = jest.fn();
    const mockGetById = jest.fn();
    const mockDelete = jest.fn();
    const mockGetByNickname = jest.fn();

    beforeEach(() => {
        userRepository = {
            get: mockGet,
            getById: mockGetById,
            getByNickname: mockGetByNickname,
            register: mockRegister,
            update: mockUpdate,
            delete: mockDelete,
            refreshToken: jest.fn(),
            logout: jest.fn(),
        }
        service = new UserService(userRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('get', () => {
        it('should call the repository with default option when requester is admin and no search object is given', async () => {
            const defaultSearch: Search = {
                page: 1,
                pageSize: 10,
            }
            mockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }
            await service.get(requester);
            expect(mockGet).toHaveBeenCalledWith(defaultSearch);
        });
        it('should call the repository in order to return the asked page when requester is admin', async () => {
            mockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            const search: Search = { page: 1, pageSize: 5 }
            await service.get(requester, search);
            expect(mockGet).toHaveBeenCalledWith(search);
        });

        it('should throw an forbidden error if requester is not admin', async () => {
            mockGetById.mockResolvedValue({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'user',
                nickname: 'john doe',
            })

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }
            try {
                const search: Search = { page: 1, pageSize: 5 }
                await service.get(requester, search);
            } catch (e) {
                expect(e).toEqual(new ForbiddenError('Requester john doe is not authorized to perform this action'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw an unauthorized error if requester is not admin', async () => {
            mockGetById.mockResolvedValue(null)

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }
            try {
                const search: Search = { page: 1, pageSize: 5 }
                await service.get(requester, search);
            } catch (e) {
                expect(e).toEqual(new UnauthorizedError(`unknown requester`));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

    });

    describe('register', () => {
        it('should call the register method with a crypted password', async () => {
            mockGetByNickname.mockResolvedValueOnce(null)
            const userTobeRegistered: UserToBeRegistered = {
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }

            await service.register(userTobeRegistered);

            expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
                nickname: 'albator',
                name: 'Robert',
                password: expect.stringMatching(/^\$2[aby]?\$\d{2}\$.{53}$/),
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }));
        });

        it('should throw a bad request error if the username is already taken', async () => {
            mockGetByNickname.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })
            const userTobeRegistered: UserToBeRegistered = {
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }

            try {
                await service.register(userTobeRegistered);
            } catch (e) {
                expect(e).toEqual(new BadRequestError('username already used'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });
    });

    describe('delete', () => {
        it('should call the delete method when requester is admin', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'admin',
            })

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            await service.delete(requester, '4204e0cc-9153-4b93-bbdb-11111111111');
            expect(mockDelete).toHaveBeenCalledWith('4204e0cc-9153-4b93-bbdb-11111111111');
        });

        it('should throw a forbidden error if requester is not admin', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
                role: 'user',
            })

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            try {
                await service.delete(requester, '4204e0cc-9153-4b93-bbdb-11111111111');
            } catch (e) {
                expect(e).toEqual(new ForbiddenError('Requester john doe is not authorized to perform this action'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw an unauthorized error if requester is unknown', async () => {
            mockGetById.mockResolvedValue(null)

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }
            try {
                await service.delete(requester, '4204e0cc-9153-4b93-bbdb-11111111111');
            } catch (e) {
                expect(e).toEqual(new UnauthorizedError(`unknown requester`));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw a not found error the user to be updated does not exist', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
                role: 'admin',
            })
            mockGetById.mockResolvedValue(null)

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            try {
                await service.delete(requester, '4204e0cc-9153-4b93-bbdb-11111111111');
            } catch (e) {
                expect(e).toEqual(new NotFoundError('user not found'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });
    });

    describe('update', () => {
        afterEach(() => {
            jest.clearAllMocks();
        })
        it('should call the update method when requester is admin', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'admin',
            })

            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            await service.update(requester, userTobeUpdated);
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                name: 'Robert',
                password: expect.stringMatching(/^\$2[aby]?\$\d{2}\$.{53}$/),
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }));
        });

        it('should call the update method if requester is not admin but the user to be updated', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'user',
            })

            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'user',
            })

            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "user"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'john doe',
            }

            await service.update(requester, userTobeUpdated);
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                name: 'Robert',
                password: expect.stringMatching(/^\$2[aby]?\$\d{2}\$.{53}$/),
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "user"
                }
            }));
        });

        it('should throw a forbidden error if requester is not admin nor the user to be updated', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'user',
                nickname: 'john doe',
            })



            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "user"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'john doe',
            }



            try {
                await service.update(requester, userTobeUpdated);
            } catch (e) {
                expect(e).toEqual(new ForbiddenError('Requester john doe is not authorized to perform this action'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw an unauthorized error if the requester is unknown', async () => {
            mockGetById.mockResolvedValueOnce(null)

            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "user"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'john doe',
            }
            try {
                await service.update(requester, userTobeUpdated);
            } catch (e) {
                expect(e).toEqual(new UnauthorizedError(`unknown requester`));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw a bad request error if the username is already taken', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'admin',
            })

            mockGetByNickname.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            try {
                await service.update(requester, userTobeUpdated);
            } catch (e) {
                expect(e).toEqual(new BadRequestError('username already used'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

        it('should throw a not found error if the user to be updated is not found', async () => {
            mockGetById.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                role: 'admin',
            })

            mockGetById.mockResolvedValueOnce(null)

            const userTobeUpdated: UserToBeUpdated = {
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                nickname: 'albator',
                password: "itIsASecret",
                name: "Robert",
                comment: "the one withe a big space ship",
                address: "Somewhere in the space",
                role: {
                    id: "22222222-2222-2222-2222-222222222222",
                    name: "admin"
                }
            }

            const requester: Requester = {
                id: '4204e0cc-9153-4b93-bbdb-275bae7f4bd5',
                nickname: 'john doe',
            }

            try {
                await service.update(requester, userTobeUpdated);
            } catch (e) {
                expect(e).toEqual(new NotFoundError('user not found'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });

    });

    describe('getByNickname', () => {
        it('should call the getByNickname method', async () => {
            mockGetByNickname.mockResolvedValueOnce({
                id: '4204e0cc-9153-4b93-bbdb-11111111111',
                role: 'admin',
                nickname: 'john doe',
            })
            await service.getByNickname('john doe');
            expect(mockGetByNickname).toHaveBeenCalledWith('john doe');
        });

        it('should throw a not found error the user does not exist', async () => {
            mockGetByNickname.mockResolvedValue(null)

            try {
                await service.getByNickname('john doe');
            } catch (e) {
                expect(e).toEqual(new NotFoundError('user not found'));
                return;
            }
            //you are not supposed to reach this line
            expect(true).toBeFalsy();
        });
    });
});